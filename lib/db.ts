import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { Pool, PoolClient } from 'pg';
import bcrypt from 'bcryptjs';
import {
  AuditLog,
  Category,
  Collection,
  DiscountCoupon,
  HomepageSection,
  Order,
  OrderStatus,
  Product,
  Review,
  StoreSettings,
  User,
  UserRole
} from '../types/index';
import {
  initialCategories,
  initialCollections,
  initialDiscounts,
  initialHomepageSections,
  initialProducts,
  initialStoreSettings
} from './seed-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'virasat.db');

export interface DbDriver {
  kind: 'postgres' | 'sqlite';
  all<T = any>(sql: string, params?: any[]): Promise<T[]>;
  get<T = any>(sql: string, params?: any[]): Promise<T | null>;
  run(sql: string, params?: any[]): Promise<{ changes: number }>;
  exec(sql: string): Promise<void>;
}

interface GlobalDbState {
  driver: DbDriver | null;
  initPromise: Promise<DbDriver> | null;
  pgPool: Pool | null;
  sqliteDb: DatabaseSync | null;
}

const globalForDb = globalThis as unknown as { __virasatDbState?: GlobalDbState };
if (!globalForDb.__virasatDbState) {
  globalForDb.__virasatDbState = {
    driver: null,
    initPromise: null,
    pgPool: null,
    sqliteDb: null
  };
}
const dbState = globalForDb.__virasatDbState;

function isPlaceholder(val?: string): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  return (
    !trimmed ||
    trimmed.includes('YOUR_SUPABASE_DB_PASSWORD') ||
    trimmed === '[YOUR-PASSWORD]' ||
    trimmed === 'your-password'
  );
}

function getPostgresConfig() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const host = (process.env.PGHOST || process.env.DB_HOST || process.env.host || '').trim();
  const port = Number(process.env.PGPORT || process.env.DB_PORT || process.env.port || 5432);
  const database = (process.env.PGDATABASE || process.env.DB_NAME || process.env.database || 'postgres').trim();
  const user = (process.env.PGUSER || process.env.DB_USER || process.env.user || 'postgres').trim();
  const password = (process.env.PGPASSWORD || process.env.DB_PASSWORD || process.env.password || '').trim();

  if (databaseUrl && !isPlaceholder(databaseUrl)) {
    let parsedHost = host || 'postgres-url';
    let parsedPort = port;
    let parsedDatabase = database;
    let parsedUser = user;
    try {
      const u = new URL(databaseUrl);
      if (u.hostname) parsedHost = u.hostname;
      if (u.port) parsedPort = Number(u.port);
      if (u.pathname && u.pathname.length > 1) parsedDatabase = u.pathname.slice(1);
      if (u.username) parsedUser = decodeURIComponent(u.username);
    } catch {
      // keep fallbacks if URL parsing fails
    }

    const useSsl =
      databaseUrl.includes('supabase.') ||
      databaseUrl.includes('sslmode=require') ||
      process.env.PGSSLMODE === 'require';
    return {
      configured: true,
      connectionString: databaseUrl,
      host: parsedHost,
      port: parsedPort,
      database: parsedDatabase,
      user: parsedUser,
      useSsl
    };
  }

  if (host && !isPlaceholder(password)) {
    const useSsl =
      host.includes('supabase.') ||
      process.env.PGSSLMODE === 'require' ||
      process.env.PGSSL === 'true';
    return {
      configured: true,
      host,
      port,
      database,
      user,
      password,
      useSsl
    };
  }

  return {
    configured: false,
    host: host || undefined,
    port,
    database,
    user,
    useSsl: false
  };
}

function toPgSql(sql: string): string {
  let idx = 0;
  let inSingleQuote = false;
  let out = '';
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === "'" && sql[i - 1] !== '\\') {
      inSingleQuote = !inSingleQuote;
      out += ch;
    } else if (ch === '?' && !inSingleQuote) {
      idx += 1;
      out += `$${idx}`;
    } else {
      out += ch;
    }
  }
  return out;
}

function createPgDriver(executor: Pool | PoolClient): DbDriver {
  return {
    kind: 'postgres',
    async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
      const res = await executor.query(toPgSql(sql), params);
      return res.rows as T[];
    },
    async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
      const res = await executor.query(toPgSql(sql), params);
      return (res.rows[0] as T) ?? null;
    },
    async run(sql: string, params: any[] = []): Promise<{ changes: number }> {
      const res = await executor.query(toPgSql(sql), params);
      return { changes: res.rowCount ?? 0 };
    },
    async exec(sql: string): Promise<void> {
      await executor.query(sql);
    }
  };
}

function createSqliteDriver(db: DatabaseSync): DbDriver {
  return {
    kind: 'sqlite',
    async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
      return db.prepare(sql).all(...params) as T[];
    },
    async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
      return (db.prepare(sql).get(...params) as T) ?? null;
    },
    async run(sql: string, params: any[] = []): Promise<{ changes: number }> {
      const res = db.prepare(sql).run(...params);
      return { changes: Number(res.changes || 0) };
    },
    async exec(sql: string): Promise<void> {
      db.exec(sql);
    }
  };
}

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    addresses_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible INTEGER NOT NULL DEFAULT 1,
    seo_title TEXT,
    seo_description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    banner_image TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible INTEGER NOT NULL DEFAULT 1,
    seo_title TEXT,
    seo_description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    price DOUBLE PRECISION NOT NULL,
    compare_at_price DOUBLE PRECISION,
    cost_price DOUBLE PRECISION,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id TEXT NOT NULL,
    collection_ids_json TEXT,
    images_json TEXT,
    variants_json TEXT,
    attributes_json TEXT,
    tags_json TEXT,
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_published INTEGER NOT NULL DEFAULT 1,
    is_archived INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    rating DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address_json TEXT NOT NULL,
    billing_address_json TEXT,
    items_json TEXT NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    discount DOUBLE PRECISION NOT NULL DEFAULT 0,
    discount_code TEXT,
    shipping_fee DOUBLE PRECISION NOT NULL DEFAULT 0,
    tax DOUBLE PRECISION NOT NULL DEFAULT 0,
    total DOUBLE PRECISION NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    order_status TEXT NOT NULL,
    tracking_carrier TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS discounts (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    min_order_value DOUBLE PRECISION,
    max_discount DOUBLE PRECISION,
    starts_at TEXT,
    expires_at TEXT,
    usage_limit INTEGER,
    usage_count INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_sections (
    id TEXT PRIMARY KEY,
    section_type TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    content_json TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS store_settings (
    id TEXT PRIMARY KEY,
    store_name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    logo_url TEXT,
    favicon_url TEXT,
    announcement_text TEXT NOT NULL,
    announcement_link TEXT,
    is_announcement_visible INTEGER NOT NULL DEFAULT 1,
    currency_symbol TEXT NOT NULL DEFAULT '₹',
    currency_code TEXT NOT NULL DEFAULT 'INR',
    tax_rate DOUBLE PRECISION NOT NULL DEFAULT 5,
    free_shipping_threshold DOUBLE PRECISION NOT NULL DEFAULT 1999,
    standard_shipping_fee DOUBLE PRECISION NOT NULL DEFAULT 99,
    cod_enabled INTEGER NOT NULL DEFAULT 1,
    cod_fee DOUBLE PRECISION NOT NULL DEFAULT 50,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    store_address TEXT NOT NULL,
    social_links_json TEXT,
    header_nav_json TEXT,
    footer_nav_json TEXT,
    seo_meta_title TEXT NOT NULL,
    seo_meta_description TEXT NOT NULL,
    payment_gateway_configured INTEGER NOT NULL DEFAULT 0,
    razorpay_key_id TEXT,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    rating DOUBLE PRECISION NOT NULL,
    title TEXT,
    comment TEXT NOT NULL,
    is_verified_purchase INTEGER NOT NULL DEFAULT 1,
    is_approved INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    details_json TEXT,
    ip_address TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug)`,
  `CREATE INDEX IF NOT EXISTS idx_products_cat ON products (category_id)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders (customer_email)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (order_status)`
];

async function hasAllTables(driver: DbDriver): Promise<boolean> {
  if (driver.kind === 'sqlite') {
    const existingTables = await driver.all<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users','categories','collections','products','orders','discounts','homepage_sections','store_settings','reviews','audit_logs')"
    );
    return existingTables.length >= 10;
  }
  const existingTables = await driver.all<{ table_name: string }>(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users','categories','collections','products','orders','discounts','homepage_sections','store_settings','reviews','audit_logs')"
  );
  return existingTables.length >= 10;
}

async function isDatabaseSeeded(driver: DbDriver): Promise<boolean> {
  for (const table of ['products', 'categories', 'homepage_sections', 'store_settings', 'users']) {
    const row = await driver.get<{ count: number | string }>(`SELECT COUNT(*) as count FROM ${table}`);
    if (Number(row?.count || 0) === 0) {
      return false;
    }
  }
  return true;
}

async function initSchemaAndSeed(driver: DbDriver) {
  if (!(await hasAllTables(driver))) {
    for (const stmt of SCHEMA_STATEMENTS) {
      await driver.exec(stmt);
    }
  }

  // Always check whether core catalogue/settings tables are empty so incomplete/empty DBs get seeded
  if (!(await isDatabaseSeeded(driver))) {
    await seedInitialData(driver);
  }
}

async function seedInitialData(driver: DbDriver) {
  // Users
  const userCount = await driver.get<{ count: number | string }>('SELECT COUNT(*) as count FROM users');
  if (Number(userCount?.count || 0) === 0) {
    const salt = bcrypt.genSaltSync(10);
    const devHash = bcrypt.hashSync('Developer@12345', salt);
    const clientHash = bcrypt.hashSync('Client@12345', salt);
    const customerHash = bcrypt.hashSync('Customer@12345', salt);
    const now = new Date().toISOString();

    const userSql = `
      INSERT INTO users (id, name, email, password_hash, role, phone, addresses_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `;

    await driver.run(userSql, [
      'usr-dev-1',
      'System Developer (Super Admin)',
      'developer@virasat.com',
      devHash,
      'DEVELOPER',
      '+91 99999 88888',
      JSON.stringify([]),
      now,
      now
    ]);

    await driver.run(userSql, [
      'usr-client-1',
      'Store Owner (Client Admin)',
      'client@virasat.com',
      clientHash,
      'CLIENT',
      '+91 98765 43210',
      JSON.stringify([]),
      now,
      now
    ]);

    await driver.run(userSql, [
      'usr-cust-1',
      'Aradhya Sharma',
      'aradhya@example.com',
      customerHash,
      'CUSTOMER',
      '+91 98111 22233',
      JSON.stringify([
        {
          id: 'addr-1',
          name: 'Aradhya Sharma',
          phone: '+91 98111 22233',
          addressLine1: 'B-402, Heritage Palms, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true
        }
      ]),
      now,
      now
    ]);
  }

  // Store settings
  const settingsCount = await driver.get<{ count: number | string }>('SELECT COUNT(*) as count FROM store_settings');
  if (Number(settingsCount?.count || 0) === 0) {
    const s = initialStoreSettings;
    await driver.run(
      `
      INSERT INTO store_settings (
        id, store_name, tagline, logo_url, favicon_url, announcement_text, announcement_link,
        is_announcement_visible, currency_symbol, currency_code, tax_rate, free_shipping_threshold,
        standard_shipping_fee, cod_enabled, cod_fee, contact_email, contact_phone, store_address,
        social_links_json, header_nav_json, footer_nav_json, seo_meta_title, seo_meta_description,
        payment_gateway_configured, razorpay_key_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
      `,
      [
        s.id,
        s.storeName,
        s.tagline,
        s.logoUrl || '',
        s.faviconUrl || '',
        s.announcementText,
        s.announcementLink || '',
        s.isAnnouncementVisible ? 1 : 0,
        s.currencySymbol,
        s.currencyCode,
        s.taxRate,
        s.freeShippingThreshold,
        s.standardShippingFee,
        s.codEnabled ? 1 : 0,
        s.codFee,
        s.contactEmail,
        s.contactPhone,
        s.storeAddress,
        JSON.stringify(s.socialLinks),
        JSON.stringify(s.headerNav),
        JSON.stringify(s.footerNav),
        s.seoMetaTitle,
        s.seoMetaDescription,
        s.paymentGatewayConfigured ? 1 : 0,
        s.razorpayKeyId || '',
        s.updatedAt
      ]
    );
  }

  // Categories
  const catCount = await driver.get<{ count: number | string }>('SELECT COUNT(*) as count FROM categories');
  if (Number(catCount?.count || 0) === 0) {
    const catSql = `
      INSERT INTO categories (id, name, slug, description, image, display_order, is_visible, seo_title, seo_description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `;
    for (const c of initialCategories) {
      await driver.run(catSql, [
        c.id,
        c.name,
        c.slug,
        c.description || '',
        c.image || '',
        c.displayOrder,
        c.isVisible ? 1 : 0,
        c.seoTitle || '',
        c.seoDescription || '',
        c.createdAt,
        c.updatedAt
      ]);
    }
  }

  // Collections
  const colCount = await driver.get<{ count: number | string }>('SELECT COUNT(*) as count FROM collections');
  if (Number(colCount?.count || 0) === 0) {
    const colSql = `
      INSERT INTO collections (id, name, slug, description, image, banner_image, display_order, is_visible, seo_title, seo_description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `;
    for (const col of initialCollections) {
      await driver.run(colSql, [
        col.id,
        col.name,
        col.slug,
        col.description || '',
        col.image || '',
        col.bannerImage || '',
        col.displayOrder,
        col.isVisible ? 1 : 0,
        col.seoTitle || '',
        col.seoDescription || '',
        col.createdAt,
        col.updatedAt
      ]);
    }
  }

  // Products
  const prodCount = await driver.get<{ count: number | string }>('SELECT COUNT(*) as count FROM products');
  if (Number(prodCount?.count || 0) === 0) {
    const prodSql = `
      INSERT INTO products (
        id, name, slug, sku, description, short_description, price, compare_at_price, cost_price,
        stock, category_id, collection_ids_json, images_json, variants_json, attributes_json,
        tags_json, is_featured, is_published, is_archived, seo_title, seo_description, rating, review_count,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `;
    for (const p of initialProducts) {
      await driver.run(prodSql, [
        p.id,
        p.name,
        p.slug,
        p.sku,
        p.description,
        p.shortDescription || '',
        p.price,
        p.compareAtPrice || null,
        p.costPrice || null,
        p.stock,
        p.categoryId,
        JSON.stringify(p.collectionIds),
        JSON.stringify(p.images),
        JSON.stringify(p.variants),
        JSON.stringify(p.attributes),
        JSON.stringify(p.tags),
        p.isFeatured ? 1 : 0,
        p.isPublished ? 1 : 0,
        p.isArchived ? 1 : 0,
        p.seoTitle || '',
        p.seoDescription || '',
        p.rating,
        p.reviewCount,
        p.createdAt,
        p.updatedAt
      ]);
    }
  }

  // Discounts
  const discCount = await driver.get<{ count: number | string }>('SELECT COUNT(*) as count FROM discounts');
  if (Number(discCount?.count || 0) === 0) {
    const discSql = `
      INSERT INTO discounts (id, code, type, value, min_order_value, max_discount, starts_at, expires_at, usage_limit, usage_count, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `;
    for (const d of initialDiscounts) {
      await driver.run(discSql, [
        d.id,
        d.code,
        d.type,
        d.value,
        d.minOrderValue || null,
        d.maxDiscount || null,
        d.startsAt || null,
        d.expiresAt || null,
        d.usageLimit || null,
        d.usageCount,
        d.isActive ? 1 : 0,
        d.createdAt
      ]);
    }
  }

  // Homepage sections
  const secCount = await driver.get<{ count: number | string }>('SELECT COUNT(*) as count FROM homepage_sections');
  if (Number(secCount?.count || 0) === 0) {
    const secSql = `
      INSERT INTO homepage_sections (id, section_type, title, subtitle, content_json, display_order, is_visible, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `;
    for (const s of initialHomepageSections) {
      await driver.run(secSql, [
        s.id,
        s.sectionType,
        s.title,
        s.subtitle || '',
        JSON.stringify(s.content),
        s.displayOrder,
        s.isVisible ? 1 : 0,
        s.createdAt,
        s.updatedAt
      ]);
    }
  }

  // Sample reviews
  const revCount = await driver.get<{ count: number | string }>('SELECT COUNT(*) as count FROM reviews');
  if (Number(revCount?.count || 0) === 0) {
    const revSql = `
      INSERT INTO reviews (id, product_id, customer_id, customer_name, rating, title, comment, is_verified_purchase, is_approved, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `;
    const now = new Date().toISOString();
    await driver.run(revSql, [
      'rev-1',
      'prod-1',
      'usr-cust-1',
      'Aradhya Sharma',
      5,
      'Breathtaking Pure Silk!',
      'The Kanjeevaram Korvai weave is stunning in person. Pure silk weight with Silk Mark tag. Got countless compliments at my brother’s reception.',
      1,
      1,
      now
    ]);
    await driver.run(revSql, [
      'rev-2',
      'prod-4',
      'usr-cust-1',
      'Sunita Reddy',
      5,
      'Royal Temple Feel',
      'Looks like authentic ancestral heirloom gold. The Kemp stones and seed pearl detailing are exquisite.',
      1,
      1,
      now
    ]);
    await driver.run(revSql, [
      'rev-3',
      'prod-2',
      'usr-cust-1',
      'Devika Sen',
      5,
      'Museum Grade Banarasi',
      'Kadwa weaving is so fine and pure. Beautiful soft drape. Arrived securely packed in a gorgeous heritage box.',
      1,
      1,
      now
    ]);
  }

  // Sample order
  const orderCount = await driver.get<{ count: number | string }>('SELECT COUNT(*) as count FROM orders');
  if (Number(orderCount?.count || 0) === 0) {
    const sampleOrderDate = new Date(Date.now() - 86400000 * 2).toISOString();
    await driver.run(
      `
      INSERT INTO orders (
        id, order_number, customer_id, customer_name, customer_email, customer_phone,
        shipping_address_json, billing_address_json, items_json, subtotal, discount,
        discount_code, shipping_fee, tax, total, payment_method, payment_status,
        order_status, tracking_carrier, tracking_number, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
      `,
      [
        'ord-sample-1',
        'ORD-2026-849201',
        'usr-cust-1',
        'Aradhya Sharma',
        'aradhya@example.com',
        '+91 98111 22233',
        JSON.stringify({
          id: 'addr-1',
          name: 'Aradhya Sharma',
          phone: '+91 98111 22233',
          addressLine1: 'B-402, Heritage Palms, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001'
        }),
        null,
        JSON.stringify([
          {
            productId: 'prod-1',
            productName: 'Imperial Kanjeevaram Pure Mulberry Silk Saree',
            productSlug: 'imperial-kanjeevaram-pure-mulberry-silk-saree',
            variantId: 'var-1-1',
            variantTitle: 'Crimson & Muted Gold / Free Size with Blouse',
            sku: 'SAR-KAN-001-CRIMSON',
            price: 18499,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
            total: 18499
          }
        ]),
        18499,
        1849.9,
        'VIRASAT10',
        0,
        832.45,
        17481.55,
        'ONLINE_RAZORPAY',
        'PAID',
        'SHIPPED',
        'BlueDart Express',
        'BD-938210398',
        'Delivered gift wrapped with handwritten royal scroll',
        sampleOrderDate,
        sampleOrderDate
      ]
    );
  }
}

export async function getDb(): Promise<DbDriver> {
  if (dbState.driver) {
    return dbState.driver;
  }

  if (!dbState.initPromise) {
    dbState.initPromise = (async () => {
      const pgConfig = getPostgresConfig();
      if (pgConfig.configured) {
        const poolLimits = {
          max: process.env.VERCEL ? 5 : 10,
          idleTimeoutMillis: 10000,
          connectionTimeoutMillis: 10000
        };
        const pool = new Pool(
          'connectionString' in pgConfig && pgConfig.connectionString
            ? {
                connectionString: pgConfig.connectionString,
                ssl: pgConfig.useSsl ? { rejectUnauthorized: false } : undefined,
                ...poolLimits
              }
            : {
                host: pgConfig.host,
                port: pgConfig.port,
                database: pgConfig.database,
                user: pgConfig.user,
                password: pgConfig.password,
                ssl: pgConfig.useSsl ? { rejectUnauthorized: false } : undefined,
                ...poolLimits
              }
        );

        try {
          const driver = createPgDriver(pool);
          // Skip advisory locks on already-initialized DBs (compatible with PgBouncer transaction pooler)
          const ready = (await hasAllTables(driver)) && (await isDatabaseSeeded(driver));
          if (!ready) {
            const client = await pool.connect();
            try {
              await client.query('SELECT pg_advisory_lock(84920142)');
              try {
                await initSchemaAndSeed(createPgDriver(client));
              } finally {
                await client.query('SELECT pg_advisory_unlock(84920142)').catch(() => {});
              }
            } finally {
              client.release();
            }
          }
          dbState.pgPool = pool;
          dbState.driver = driver;
          console.info(`[DB] Connected to PostgreSQL (${pgConfig.host}:${pgConfig.port}/${pgConfig.database})`);
          return driver;
        } catch (err: any) {
          await pool.end().catch(() => {});
          dbState.initPromise = null;
          throw new Error(
            `PostgreSQL connection failed (${pgConfig.host}:${pgConfig.port}/${pgConfig.database}): ${err?.message || err}`
          );
        }
      }

      // Local SQLite fallback when PostgreSQL credentials (e.g. PGPASSWORD / DATABASE_URL) are not set
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const sqlite = new DatabaseSync(DB_PATH);
      sqlite.exec('PRAGMA busy_timeout = 10000;');
      sqlite.exec('PRAGMA journal_mode = WAL;');
      sqlite.exec('PRAGMA foreign_keys = ON;');
      const driver = createSqliteDriver(sqlite);
      await initSchemaAndSeed(driver);
      dbState.sqliteDb = sqlite;
      dbState.driver = driver;
      return driver;
    })();
  }

  return dbState.initPromise;
}

export function getDatabaseStatus() {
  const pg = getPostgresConfig();
  return {
    activeDriver: dbState.driver?.kind || (pg.configured ? 'postgres' : 'sqlite'),
    postgresConfigured: pg.configured,
    postgresHost: pg.host || null,
    postgresPort: pg.port,
    postgresDatabase: pg.database,
    sqlitePath: DB_PATH
  };
}

// ======================== REPOSITORY METHODS ========================

function mapProduct(row: any, categoriesMap?: Map<string, string>): Product {
  const catName = categoriesMap?.get(row.category_id) || '';
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    description: row.description,
    shortDescription: row.short_description || undefined,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price !== null && row.compare_at_price !== undefined ? Number(row.compare_at_price) : undefined,
    costPrice: row.cost_price !== null && row.cost_price !== undefined ? Number(row.cost_price) : undefined,
    stock: Number(row.stock),
    categoryId: row.category_id,
    categoryName: catName,
    collectionIds: row.collection_ids_json ? JSON.parse(row.collection_ids_json) : [],
    images: row.images_json ? JSON.parse(row.images_json) : [],
    variants: row.variants_json ? JSON.parse(row.variants_json) : [],
    attributes: row.attributes_json ? JSON.parse(row.attributes_json) : [],
    tags: row.tags_json ? JSON.parse(row.tags_json) : [],
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    isArchived: Boolean(row.is_archived),
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getCategoriesMap(): Promise<Map<string, string>> {
  const db = await getDb();
  const rows = await db.all<{ id: string; name: string }>('SELECT id, name FROM categories');
  const map = new Map<string, string>();
  for (const r of rows) {
    map.set(r.id, r.name);
  }
  return map;
}

export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  collectionId?: string;
  collectionSlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  isArchived?: boolean;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'featured';
  limit?: number;
  offset?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<{ products: Product[]; total: number }> {
  const db = await getDb();
  const catMap = await getCategoriesMap();

  const whereClauses: string[] = [];
  const params: any[] = [];

  if (filters.isArchived !== undefined) {
    whereClauses.push('is_archived = ?');
    params.push(filters.isArchived ? 1 : 0);
  } else {
    whereClauses.push('is_archived = 0');
  }

  if (filters.isPublished !== undefined) {
    whereClauses.push('is_published = ?');
    params.push(filters.isPublished ? 1 : 0);
  }

  if (filters.isFeatured !== undefined) {
    whereClauses.push('is_featured = ?');
    params.push(filters.isFeatured ? 1 : 0);
  }

  if (filters.categoryId) {
    whereClauses.push('category_id = ?');
    params.push(filters.categoryId);
  } else if (filters.categorySlug) {
    const cat = await db.get<{ id: string }>('SELECT id FROM categories WHERE slug = ?', [filters.categorySlug]);
    if (cat) {
      whereClauses.push('category_id = ?');
      params.push(cat.id);
    } else {
      return { products: [], total: 0 };
    }
  }

  if (filters.collectionId) {
    whereClauses.push('collection_ids_json LIKE ?');
    params.push(`%"${filters.collectionId}"%`);
  } else if (filters.collectionSlug) {
    const col = await db.get<{ id: string }>('SELECT id FROM collections WHERE slug = ?', [filters.collectionSlug]);
    if (col) {
      whereClauses.push('collection_ids_json LIKE ?');
      params.push(`%"${col.id}"%`);
    } else {
      return { products: [], total: 0 };
    }
  }

  if (filters.minPrice !== undefined) {
    whereClauses.push('price >= ?');
    params.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    whereClauses.push('price <= ?');
    params.push(filters.maxPrice);
  }

  if (filters.inStock) {
    whereClauses.push('stock > 0');
  }

  if (filters.search) {
    const term = `%${filters.search.trim().toLowerCase()}%`;
    whereClauses.push('(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(sku) LIKE ? OR LOWER(tags_json) LIKE ?)');
    params.push(term, term, term, term);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const countRow = await db.get<{ count: number | string }>(`SELECT COUNT(*) as count FROM products ${whereSql}`, params);
  const total = Number(countRow?.count || 0);

  let orderSql = 'ORDER BY created_at DESC';
  if (filters.sort === 'price-asc') {
    orderSql = 'ORDER BY price ASC';
  } else if (filters.sort === 'price-desc') {
    orderSql = 'ORDER BY price DESC';
  } else if (filters.sort === 'popular') {
    orderSql = 'ORDER BY review_count DESC, rating DESC';
  } else if (filters.sort === 'featured') {
    orderSql = 'ORDER BY is_featured DESC, created_at DESC';
  }

  let limitSql = '';
  if (filters.limit !== undefined && Number.isFinite(Number(filters.limit))) {
    const safeLimit = Math.max(1, Math.floor(Number(filters.limit)));
    limitSql = `LIMIT ${safeLimit}`;
    if (filters.offset !== undefined && Number.isFinite(Number(filters.offset))) {
      const safeOffset = Math.max(0, Math.floor(Number(filters.offset)));
      limitSql += ` OFFSET ${safeOffset}`;
    }
  }

  const query = `SELECT * FROM products ${whereSql} ${orderSql} ${limitSql}`;
  const rows = await db.all<any>(query, params);

  return {
    products: rows.map(r => mapProduct(r, catMap)),
    total
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  const row = await db.get<any>('SELECT * FROM products WHERE id = ?', [id]);
  if (!row) return null;
  const catMap = await getCategoriesMap();
  return mapProduct(row, catMap);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await getDb();
  const row = await db.get<any>('SELECT * FROM products WHERE slug = ?', [slug]);
  if (!row) return null;
  const catMap = await getCategoriesMap();
  return mapProduct(row, catMap);
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const db = await getDb();
  const id = product.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  await db.run(
    `
    INSERT INTO products (
      id, name, slug, sku, description, short_description, price, compare_at_price, cost_price,
      stock, category_id, collection_ids_json, images_json, variants_json, attributes_json,
      tags_json, is_featured, is_published, is_archived, seo_title, seo_description, rating, review_count,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      product.name || 'Untitled Product',
      product.slug || `prod-${Date.now()}`,
      product.sku || `SKU-${Date.now()}`,
      product.description || '',
      product.shortDescription || '',
      product.price || 0,
      product.compareAtPrice || null,
      product.costPrice || null,
      product.stock !== undefined ? product.stock : 0,
      product.categoryId || 'cat-1',
      JSON.stringify(product.collectionIds || []),
      JSON.stringify(product.images || []),
      JSON.stringify(product.variants || []),
      JSON.stringify(product.attributes || []),
      JSON.stringify(product.tags || []),
      product.isFeatured ? 1 : 0,
      product.isPublished !== undefined ? (product.isPublished ? 1 : 0) : 1,
      product.isArchived ? 1 : 0,
      product.seoTitle || product.name || '',
      product.seoDescription || product.shortDescription || '',
      product.rating || 5.0,
      product.reviewCount || 0,
      now,
      now
    ]
  );

  return (await getProductById(id))!;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await getDb();
  const existing = await getProductById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: Product = {
    ...existing,
    ...updates,
    updatedAt: now
  };

  await db.run(
    `
    UPDATE products SET
      name = ?, slug = ?, sku = ?, description = ?, short_description = ?,
      price = ?, compare_at_price = ?, cost_price = ?, stock = ?, category_id = ?,
      collection_ids_json = ?, images_json = ?, variants_json = ?, attributes_json = ?,
      tags_json = ?, is_featured = ?, is_published = ?, is_archived = ?,
      seo_title = ?, seo_description = ?, rating = ?, review_count = ?, updated_at = ?
    WHERE id = ?
    `,
    [
      updated.name,
      updated.slug,
      updated.sku,
      updated.description,
      updated.shortDescription || null,
      updated.price,
      updated.compareAtPrice || null,
      updated.costPrice || null,
      updated.stock,
      updated.categoryId,
      JSON.stringify(updated.collectionIds),
      JSON.stringify(updated.images),
      JSON.stringify(updated.variants),
      JSON.stringify(updated.attributes),
      JSON.stringify(updated.tags),
      updated.isFeatured ? 1 : 0,
      updated.isPublished ? 1 : 0,
      updated.isArchived ? 1 : 0,
      updated.seoTitle || null,
      updated.seoDescription || null,
      updated.rating,
      updated.reviewCount,
      now,
      id
    ]
  );

  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.run('DELETE FROM products WHERE id = ?', [id]);
  return result.changes > 0;
}

// Categories
export async function getCategories(onlyVisible = false): Promise<Category[]> {
  const db = await getDb();
  const where = onlyVisible ? 'WHERE is_visible = 1' : '';
  const rows = await db.all<any>(`SELECT * FROM categories ${where} ORDER BY display_order ASC`);

  const countRows = await db.all<{ category_id: string; count: number | string }>(
    'SELECT category_id, COUNT(*) as count FROM products WHERE is_archived = 0 AND is_published = 1 GROUP BY category_id'
  );
  const countMap = new Map<string, number>();
  for (const c of countRows) countMap.set(c.category_id, Number(c.count || 0));

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description || undefined,
    image: r.image || undefined,
    displayOrder: Number(r.display_order),
    isVisible: Boolean(r.is_visible),
    seoTitle: r.seo_title || undefined,
    seoDescription: r.seo_description || undefined,
    productCount: countMap.get(r.id) || 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = await getDb();
  const r = await db.get<any>('SELECT * FROM categories WHERE slug = ?', [slug]);
  if (!r) return null;
  const countRow = await db.get<{ count: number | string }>(
    'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_archived = 0 AND is_published = 1',
    [r.id]
  );
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description || undefined,
    image: r.image || undefined,
    displayOrder: Number(r.display_order),
    isVisible: Boolean(r.is_visible),
    seoTitle: r.seo_title || undefined,
    seoDescription: r.seo_description || undefined,
    productCount: Number(countRow?.count || 0),
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export async function createCategory(cat: Partial<Category>): Promise<Category> {
  const db = await getDb();
  const id = cat.id || `cat-${Date.now()}`;
  const now = new Date().toISOString();
  const slug = cat.slug || `cat-${Date.now()}`;
  await db.run(
    `
    INSERT INTO categories (id, name, slug, description, image, display_order, is_visible, seo_title, seo_description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      cat.name || 'New Category',
      slug,
      cat.description || '',
      cat.image || '',
      cat.displayOrder || 0,
      cat.isVisible !== undefined ? (cat.isVisible ? 1 : 0) : 1,
      cat.seoTitle || '',
      cat.seoDescription || '',
      now,
      now
    ]
  );
  return (
    (await getCategoryBySlug(slug)) || {
      id,
      name: cat.name || '',
      slug,
      displayOrder: 0,
      isVisible: true,
      createdAt: now,
      updatedAt: now
    }
  );
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const db = await getDb();
  const existing = await db.get<any>('SELECT * FROM categories WHERE id = ?', [id]);
  if (!existing) return null;
  const now = new Date().toISOString();
  const nextSlug = updates.slug ?? existing.slug;
  await db.run(
    `
    UPDATE categories SET name = ?, slug = ?, description = ?, image = ?, display_order = ?, is_visible = ?, seo_title = ?, seo_description = ?, updated_at = ?
    WHERE id = ?
    `,
    [
      updates.name ?? existing.name,
      nextSlug,
      updates.description ?? existing.description,
      updates.image ?? existing.image,
      updates.displayOrder ?? existing.display_order,
      updates.isVisible !== undefined ? (updates.isVisible ? 1 : 0) : existing.is_visible,
      updates.seoTitle ?? existing.seo_title,
      updates.seoDescription ?? existing.seo_description,
      now,
      id
    ]
  );
  return getCategoryBySlug(nextSlug);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await getDb();
  const prod = await db.get<{ count: number | string }>('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]);
  const prodCount = Number(prod?.count || 0);
  if (prodCount > 0) {
    throw new Error(`Cannot delete category with ${prodCount} associated products. Reassign products first.`);
  }
  const res = await db.run('DELETE FROM categories WHERE id = ?', [id]);
  return res.changes > 0;
}

// Collections
export async function getCollections(onlyVisible = false): Promise<Collection[]> {
  const db = await getDb();
  const where = onlyVisible ? 'WHERE is_visible = 1' : '';
  const rows = await db.all<any>(`SELECT * FROM collections ${where} ORDER BY display_order ASC`);
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description || undefined,
    image: r.image || undefined,
    bannerImage: r.banner_image || undefined,
    displayOrder: Number(r.display_order),
    isVisible: Boolean(r.is_visible),
    seoTitle: r.seo_title || undefined,
    seoDescription: r.seo_description || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const db = await getDb();
  const r = await db.get<any>('SELECT * FROM collections WHERE slug = ?', [slug]);
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description || undefined,
    image: r.image || undefined,
    bannerImage: r.banner_image || undefined,
    displayOrder: Number(r.display_order),
    isVisible: Boolean(r.is_visible),
    seoTitle: r.seo_title || undefined,
    seoDescription: r.seo_description || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export async function createCollection(col: Partial<Collection>): Promise<Collection> {
  const db = await getDb();
  const id = col.id || `col-${Date.now()}`;
  const now = new Date().toISOString();
  const slug = col.slug || `col-${Date.now()}`;
  await db.run(
    `
    INSERT INTO collections (id, name, slug, description, image, banner_image, display_order, is_visible, seo_title, seo_description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      col.name || 'New Collection',
      slug,
      col.description || '',
      col.image || '',
      col.bannerImage || '',
      col.displayOrder || 0,
      col.isVisible !== undefined ? (col.isVisible ? 1 : 0) : 1,
      col.seoTitle || '',
      col.seoDescription || '',
      now,
      now
    ]
  );
  return (await getCollectionBySlug(slug))!;
}

export async function updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | null> {
  const db = await getDb();
  const existing = await db.get<any>('SELECT * FROM collections WHERE id = ?', [id]);
  if (!existing) return null;
  const now = new Date().toISOString();
  const nextSlug = updates.slug ?? existing.slug;
  await db.run(
    `
    UPDATE collections SET name = ?, slug = ?, description = ?, image = ?, banner_image = ?, display_order = ?, is_visible = ?, seo_title = ?, seo_description = ?, updated_at = ?
    WHERE id = ?
    `,
    [
      updates.name ?? existing.name,
      nextSlug,
      updates.description ?? existing.description,
      updates.image ?? existing.image,
      updates.bannerImage ?? existing.banner_image,
      updates.displayOrder ?? existing.display_order,
      updates.isVisible !== undefined ? (updates.isVisible ? 1 : 0) : existing.is_visible,
      updates.seoTitle ?? existing.seo_title,
      updates.seoDescription ?? existing.seo_description,
      now,
      id
    ]
  );
  return getCollectionBySlug(nextSlug);
}

export async function deleteCollection(id: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.run('DELETE FROM collections WHERE id = ?', [id]);
  return res.changes > 0;
}

// Orders
function mapOrder(r: any): Order {
  return {
    id: r.id,
    orderNumber: r.order_number,
    customerId: r.customer_id || undefined,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    shippingAddress: JSON.parse(r.shipping_address_json),
    billingAddress: r.billing_address_json ? JSON.parse(r.billing_address_json) : undefined,
    items: JSON.parse(r.items_json),
    subtotal: Number(r.subtotal),
    discount: Number(r.discount),
    discountCode: r.discount_code || undefined,
    shippingFee: Number(r.shipping_fee),
    tax: Number(r.tax),
    total: Number(r.total),
    paymentMethod: r.payment_method,
    paymentStatus: r.payment_status,
    orderStatus: r.order_status,
    trackingCarrier: r.tracking_carrier || undefined,
    trackingNumber: r.tracking_number || undefined,
    notes: r.notes || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export async function getOrders(
  filters: { status?: OrderStatus; search?: string; customerEmail?: string; limit?: number; offset?: number } = {}
): Promise<{ orders: Order[]; total: number }> {
  const db = await getDb();
  const whereClauses: string[] = [];
  const params: any[] = [];

  if (filters.status) {
    whereClauses.push('order_status = ?');
    params.push(filters.status);
  }

  if (filters.customerEmail) {
    whereClauses.push('LOWER(customer_email) = ?');
    params.push(filters.customerEmail.toLowerCase());
  }

  if (filters.search) {
    const term = `%${filters.search.trim().toLowerCase()}%`;
    whereClauses.push(
      '(LOWER(order_number) LIKE ? OR LOWER(customer_name) LIKE ? OR LOWER(customer_email) LIKE ? OR LOWER(customer_phone) LIKE ?)'
    );
    params.push(term, term, term, term);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const countRow = await db.get<{ count: number | string }>(`SELECT COUNT(*) as count FROM orders ${whereSql}`, params);
  const total = Number(countRow?.count || 0);

  let limitSql = '';
  if (filters.limit !== undefined && Number.isFinite(Number(filters.limit))) {
    const safeLimit = Math.max(1, Math.floor(Number(filters.limit)));
    limitSql = `LIMIT ${safeLimit}`;
    if (filters.offset !== undefined && Number.isFinite(Number(filters.offset))) {
      const safeOffset = Math.max(0, Math.floor(Number(filters.offset)));
      limitSql += ` OFFSET ${safeOffset}`;
    }
  }

  const query = `SELECT * FROM orders ${whereSql} ORDER BY created_at DESC ${limitSql}`;
  const rows = await db.all<any>(query, params);

  return {
    orders: rows.map(mapOrder),
    total
  };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await getDb();
  const r = await db.get<any>('SELECT * FROM orders WHERE id = ?', [id]);
  if (!r) return null;
  return mapOrder(r);
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const db = await getDb();
  const r = await db.get<any>('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
  if (!r) return null;
  return mapOrder(r);
}

export async function createOrder(order: Partial<Order>): Promise<Order> {
  const db = await getDb();
  const id = order.id || `ord-${Date.now()}`;
  const now = new Date().toISOString();

  if (order.items && order.items.length > 0) {
    for (const item of order.items) {
      const prod = await getProductById(item.productId);
      if (prod) {
        const newStock = Math.max(0, prod.stock - item.quantity);
        let updatedVariants = prod.variants;
        if (item.variantId) {
          updatedVariants = prod.variants.map(v => {
            if (v.id === item.variantId) {
              return { ...v, stock: Math.max(0, v.stock - item.quantity) };
            }
            return v;
          });
        }
        await updateProduct(prod.id, {
          stock: newStock,
          variants: updatedVariants
        });
      }
    }
  }

  if (order.discountCode) {
    await db.run('UPDATE discounts SET usage_count = usage_count + 1 WHERE code = ?', [order.discountCode]);
  }

  await db.run(
    `
    INSERT INTO orders (
      id, order_number, customer_id, customer_name, customer_email, customer_phone,
      shipping_address_json, billing_address_json, items_json, subtotal, discount,
      discount_code, shipping_fee, tax, total, payment_method, payment_status,
      order_status, tracking_carrier, tracking_number, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      order.orderNumber || `ORD-${Date.now()}`,
      order.customerId || null,
      order.customerName || 'Customer',
      order.customerEmail || '',
      order.customerPhone || '',
      JSON.stringify(order.shippingAddress),
      order.billingAddress ? JSON.stringify(order.billingAddress) : null,
      JSON.stringify(order.items || []),
      order.subtotal || 0,
      order.discount || 0,
      order.discountCode || null,
      order.shippingFee || 0,
      order.tax || 0,
      order.total || 0,
      order.paymentMethod || 'COD',
      order.paymentStatus || 'PENDING',
      order.orderStatus || 'PENDING',
      order.trackingCarrier || null,
      order.trackingNumber || null,
      order.notes || null,
      now,
      now
    ]
  );

  return (await getOrderById(id))!;
}

export async function updateOrderStatus(
  id: string,
  orderStatus: OrderStatus,
  trackingCarrier?: string,
  trackingNumber?: string
): Promise<Order | null> {
  const db = await getDb();
  const existing = await getOrderById(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  await db.run(
    `
    UPDATE orders SET
      order_status = ?,
      tracking_carrier = ?,
      tracking_number = ?,
      updated_at = ?
    WHERE id = ?
    `,
    [
      orderStatus,
      trackingCarrier ?? existing.trackingCarrier ?? null,
      trackingNumber ?? existing.trackingNumber ?? null,
      now,
      id
    ]
  );

  return getOrderById(id);
}

export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
): Promise<Order | null> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.run('UPDATE orders SET payment_status = ?, updated_at = ? WHERE id = ?', [paymentStatus, now, id]);
  return getOrderById(id);
}

// Users
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const r = await db.get<any>('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.password_hash,
    role: r.role as UserRole,
    phone: r.phone || undefined,
    addresses: r.addresses_json ? JSON.parse(r.addresses_json) : [],
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDb();
  const r = await db.get<any>('SELECT * FROM users WHERE id = ?', [id]);
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.password_hash,
    role: r.role as UserRole,
    phone: r.phone || undefined,
    addresses: r.addresses_json ? JSON.parse(r.addresses_json) : [],
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export async function getUsers(): Promise<User[]> {
  const db = await getDb();
  const rows = await db.all<any>('SELECT * FROM users ORDER BY created_at DESC');
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.password_hash,
    role: r.role as UserRole,
    phone: r.phone || undefined,
    addresses: r.addresses_json ? JSON.parse(r.addresses_json) : [],
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }));
}

export async function createUser(user: Partial<User> & { password: string }): Promise<User> {
  const db = await getDb();
  const id = user.id || `usr-${Date.now()}`;
  const now = new Date().toISOString();
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(user.password, salt);

  await db.run(
    `
    INSERT INTO users (id, name, email, password_hash, role, phone, addresses_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      user.name || 'New User',
      user.email!.toLowerCase(),
      passwordHash,
      user.role || 'CUSTOMER',
      user.phone || null,
      JSON.stringify(user.addresses || []),
      now,
      now
    ]
  );

  return (await getUserById(id))!;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const db = await getDb();
  const existing = await getUserById(id);
  if (!existing) return null;
  const now = new Date().toISOString();

  await db.run(
    `
    UPDATE users SET
      name = ?, phone = ?, addresses_json = ?, updated_at = ?
    WHERE id = ?
    `,
    [
      updates.name ?? existing.name,
      updates.phone ?? existing.phone ?? null,
      JSON.stringify(updates.addresses ?? existing.addresses ?? []),
      now,
      id
    ]
  );

  return getUserById(id);
}

// Homepage Sections
export async function getHomepageSections(onlyVisible = false): Promise<HomepageSection[]> {
  const db = await getDb();
  const where = onlyVisible ? 'WHERE is_visible = 1' : '';
  const rows = await db.all<any>(`SELECT * FROM homepage_sections ${where} ORDER BY display_order ASC`);
  return rows.map(r => ({
    id: r.id,
    sectionType: r.section_type,
    title: r.title,
    subtitle: r.subtitle || undefined,
    content: JSON.parse(r.content_json),
    displayOrder: Number(r.display_order),
    isVisible: Boolean(r.is_visible),
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }));
}

export async function updateHomepageSection(id: string, updates: Partial<HomepageSection>): Promise<HomepageSection | null> {
  const db = await getDb();
  const existing = await db.get<any>('SELECT * FROM homepage_sections WHERE id = ?', [id]);
  if (!existing) return null;
  const now = new Date().toISOString();

  await db.run(
    `
    UPDATE homepage_sections SET
      title = ?, subtitle = ?, content_json = ?, display_order = ?, is_visible = ?, updated_at = ?
    WHERE id = ?
    `,
    [
      updates.title ?? existing.title,
      updates.subtitle ?? existing.subtitle,
      updates.content ? JSON.stringify(updates.content) : existing.content_json,
      updates.displayOrder ?? existing.display_order,
      updates.isVisible !== undefined ? (updates.isVisible ? 1 : 0) : existing.is_visible,
      now,
      id
    ]
  );

  const updated = await db.get<any>('SELECT * FROM homepage_sections WHERE id = ?', [id]);
  if (!updated) return null;
  return {
    id: updated.id,
    sectionType: updated.section_type,
    title: updated.title,
    subtitle: updated.subtitle || undefined,
    content: JSON.parse(updated.content_json),
    displayOrder: Number(updated.display_order),
    isVisible: Boolean(updated.is_visible),
    createdAt: updated.created_at,
    updatedAt: updated.updated_at
  };
}

export async function reorderHomepageSections(sectionIds: string[]): Promise<boolean> {
  const db = await getDb();
  for (let i = 0; i < sectionIds.length; i++) {
    await db.run('UPDATE homepage_sections SET display_order = ? WHERE id = ?', [i + 1, sectionIds[i]]);
  }
  return true;
}

// Store Settings
export async function getStoreSettings(): Promise<StoreSettings> {
  const db = await getDb();
  const r = await db.get<any>('SELECT * FROM store_settings LIMIT 1');
  if (!r) return initialStoreSettings;
  return {
    id: r.id,
    storeName: r.store_name,
    tagline: r.tagline,
    logoUrl: r.logo_url || undefined,
    faviconUrl: r.favicon_url || undefined,
    announcementText: r.announcement_text,
    announcementLink: r.announcement_link || undefined,
    isAnnouncementVisible: Boolean(r.is_announcement_visible),
    currencySymbol: r.currency_symbol,
    currencyCode: r.currency_code,
    taxRate: Number(r.tax_rate),
    freeShippingThreshold: Number(r.free_shipping_threshold),
    standardShippingFee: Number(r.standard_shipping_fee),
    codEnabled: Boolean(r.cod_enabled),
    codFee: Number(r.cod_fee),
    contactEmail: r.contact_email,
    contactPhone: r.contact_phone,
    storeAddress: r.store_address,
    socialLinks: r.social_links_json ? JSON.parse(r.social_links_json) : {},
    headerNav: r.header_nav_json ? JSON.parse(r.header_nav_json) : [],
    footerNav: r.footer_nav_json ? JSON.parse(r.footer_nav_json) : [],
    seoMetaTitle: r.seo_meta_title,
    seoMetaDescription: r.seo_meta_description,
    paymentGatewayConfigured: Boolean(r.payment_gateway_configured),
    razorpayKeyId: r.razorpay_key_id || undefined,
    updatedAt: r.updated_at
  };
}

export async function updateStoreSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const db = await getDb();
  const existing = await getStoreSettings();
  const now = new Date().toISOString();

  await db.run(
    `
    UPDATE store_settings SET
      store_name = ?, tagline = ?, logo_url = ?, favicon_url = ?, announcement_text = ?, announcement_link = ?,
      is_announcement_visible = ?, currency_symbol = ?, currency_code = ?, tax_rate = ?, free_shipping_threshold = ?,
      standard_shipping_fee = ?, cod_enabled = ?, cod_fee = ?, contact_email = ?, contact_phone = ?, store_address = ?,
      social_links_json = ?, header_nav_json = ?, footer_nav_json = ?, seo_meta_title = ?, seo_meta_description = ?,
      payment_gateway_configured = ?, razorpay_key_id = ?, updated_at = ?
    WHERE id = ?
    `,
    [
      updates.storeName ?? existing.storeName,
      updates.tagline ?? existing.tagline,
      updates.logoUrl ?? existing.logoUrl ?? null,
      updates.faviconUrl ?? existing.faviconUrl ?? null,
      updates.announcementText ?? existing.announcementText,
      updates.announcementLink ?? existing.announcementLink ?? null,
      updates.isAnnouncementVisible !== undefined
        ? updates.isAnnouncementVisible
          ? 1
          : 0
        : existing.isAnnouncementVisible
        ? 1
        : 0,
      updates.currencySymbol ?? existing.currencySymbol,
      updates.currencyCode ?? existing.currencyCode,
      updates.taxRate ?? existing.taxRate,
      updates.freeShippingThreshold ?? existing.freeShippingThreshold,
      updates.standardShippingFee ?? existing.standardShippingFee,
      updates.codEnabled !== undefined ? (updates.codEnabled ? 1 : 0) : existing.codEnabled ? 1 : 0,
      updates.codFee ?? existing.codFee,
      updates.contactEmail ?? existing.contactEmail,
      updates.contactPhone ?? existing.contactPhone,
      updates.storeAddress ?? existing.storeAddress,
      JSON.stringify(updates.socialLinks ?? existing.socialLinks),
      JSON.stringify(updates.headerNav ?? existing.headerNav),
      JSON.stringify(updates.footerNav ?? existing.footerNav),
      updates.seoMetaTitle ?? existing.seoMetaTitle,
      updates.seoMetaDescription ?? existing.seoMetaDescription,
      updates.paymentGatewayConfigured !== undefined
        ? updates.paymentGatewayConfigured
          ? 1
          : 0
        : existing.paymentGatewayConfigured
        ? 1
        : 0,
      updates.razorpayKeyId ?? existing.razorpayKeyId ?? null,
      now,
      existing.id
    ]
  );

  return getStoreSettings();
}

// Discounts
export async function getDiscounts(): Promise<DiscountCoupon[]> {
  const db = await getDb();
  const rows = await db.all<any>('SELECT * FROM discounts ORDER BY created_at DESC');
  return rows.map(r => ({
    id: r.id,
    code: r.code,
    type: r.type,
    value: Number(r.value),
    minOrderValue: r.min_order_value !== null && r.min_order_value !== undefined ? Number(r.min_order_value) : undefined,
    maxDiscount: r.max_discount !== null && r.max_discount !== undefined ? Number(r.max_discount) : undefined,
    startsAt: r.starts_at || undefined,
    expiresAt: r.expires_at || undefined,
    usageLimit: r.usage_limit !== null && r.usage_limit !== undefined ? Number(r.usage_limit) : undefined,
    usageCount: Number(r.usage_count),
    isActive: Boolean(r.is_active),
    createdAt: r.created_at
  }));
}

export async function getDiscountByCode(code: string): Promise<DiscountCoupon | null> {
  const db = await getDb();
  const r = await db.get<any>('SELECT * FROM discounts WHERE UPPER(code) = ?', [code.trim().toUpperCase()]);
  if (!r) return null;
  return {
    id: r.id,
    code: r.code,
    type: r.type,
    value: Number(r.value),
    minOrderValue: r.min_order_value !== null && r.min_order_value !== undefined ? Number(r.min_order_value) : undefined,
    maxDiscount: r.max_discount !== null && r.max_discount !== undefined ? Number(r.max_discount) : undefined,
    startsAt: r.starts_at || undefined,
    expiresAt: r.expires_at || undefined,
    usageLimit: r.usage_limit !== null && r.usage_limit !== undefined ? Number(r.usage_limit) : undefined,
    usageCount: Number(r.usage_count),
    isActive: Boolean(r.is_active),
    createdAt: r.created_at
  };
}

export async function createDiscount(coupon: Partial<DiscountCoupon>): Promise<DiscountCoupon> {
  const db = await getDb();
  const id = coupon.id || `disc-${Date.now()}`;
  const now = new Date().toISOString();
  const code = coupon.code!.trim().toUpperCase();
  await db.run(
    `
    INSERT INTO discounts (id, code, type, value, min_order_value, max_discount, starts_at, expires_at, usage_limit, usage_count, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      code,
      coupon.type || 'PERCENTAGE',
      coupon.value || 0,
      coupon.minOrderValue || null,
      coupon.maxDiscount || null,
      coupon.startsAt || null,
      coupon.expiresAt || null,
      coupon.usageLimit || null,
      0,
      coupon.isActive !== undefined ? (coupon.isActive ? 1 : 0) : 1,
      now
    ]
  );
  return (await getDiscountByCode(code))!;
}

export async function updateDiscount(id: string, updates: Partial<DiscountCoupon>): Promise<DiscountCoupon | null> {
  const db = await getDb();
  const existing = await db.get<any>('SELECT * FROM discounts WHERE id = ?', [id]);
  if (!existing) return null;
  await db.run(
    `
    UPDATE discounts SET
      code = ?, type = ?, value = ?, min_order_value = ?, max_discount = ?,
      starts_at = ?, expires_at = ?, usage_limit = ?, is_active = ?
    WHERE id = ?
    `,
    [
      updates.code ? updates.code.trim().toUpperCase() : existing.code,
      updates.type ?? existing.type,
      updates.value ?? existing.value,
      updates.minOrderValue ?? existing.min_order_value,
      updates.maxDiscount ?? existing.max_discount,
      updates.startsAt ?? existing.starts_at,
      updates.expiresAt ?? existing.expires_at,
      updates.usageLimit ?? existing.usage_limit,
      updates.isActive !== undefined ? (updates.isActive ? 1 : 0) : existing.is_active,
      id
    ]
  );
  const updated = await db.get<any>('SELECT * FROM discounts WHERE id = ?', [id]);
  if (!updated) return null;
  return {
    id: updated.id,
    code: updated.code,
    type: updated.type,
    value: Number(updated.value),
    minOrderValue: updated.min_order_value !== null && updated.min_order_value !== undefined ? Number(updated.min_order_value) : undefined,
    maxDiscount: updated.max_discount !== null && updated.max_discount !== undefined ? Number(updated.max_discount) : undefined,
    startsAt: updated.starts_at || undefined,
    expiresAt: updated.expires_at || undefined,
    usageLimit: updated.usage_limit !== null && updated.usage_limit !== undefined ? Number(updated.usage_limit) : undefined,
    usageCount: Number(updated.usage_count),
    isActive: Boolean(updated.is_active),
    createdAt: updated.created_at
  };
}

export async function deleteDiscount(id: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.run('DELETE FROM discounts WHERE id = ?', [id]);
  return res.changes > 0;
}

// Reviews
export async function getReviews(productId?: string): Promise<Review[]> {
  const db = await getDb();
  const where = productId ? 'WHERE product_id = ? AND is_approved = 1' : '';
  const query = `SELECT * FROM reviews ${where} ORDER BY created_at DESC`;
  const rows = productId ? await db.all<any>(query, [productId]) : await db.all<any>(query);
  return rows.map(r => ({
    id: r.id,
    productId: r.product_id,
    customerId: r.customer_id || undefined,
    customerName: r.customer_name,
    rating: Number(r.rating),
    title: r.title || undefined,
    comment: r.comment,
    isVerifiedPurchase: Boolean(r.is_verified_purchase),
    isApproved: Boolean(r.is_approved),
    createdAt: r.created_at
  }));
}

export async function createReview(rev: Partial<Review>): Promise<Review> {
  const db = await getDb();
  const id = rev.id || `rev-${Date.now()}`;
  const now = new Date().toISOString();
  await db.run(
    `
    INSERT INTO reviews (id, product_id, customer_id, customer_name, rating, title, comment, is_verified_purchase, is_approved, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      rev.productId!,
      rev.customerId || null,
      rev.customerName || 'Customer',
      rev.rating || 5,
      rev.title || '',
      rev.comment || '',
      rev.isVerifiedPurchase ? 1 : 0,
      1,
      now
    ]
  );

  const avg = await db.get<{ avg: number | string | null; count: number | string }>(
    'SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ? AND is_approved = 1',
    [rev.productId!]
  );
  if (avg) {
    await db.run('UPDATE products SET rating = ?, review_count = ? WHERE id = ?', [
      Math.round((Number(avg.avg) || 5) * 10) / 10,
      Number(avg.count || 0),
      rev.productId!
    ]);
  }

  return {
    id,
    productId: rev.productId!,
    customerName: rev.customerName || 'Customer',
    rating: rev.rating || 5,
    title: rev.title,
    comment: rev.comment || '',
    isVerifiedPurchase: Boolean(rev.isVerifiedPurchase),
    isApproved: true,
    createdAt: now
  };
}

// Audit Logs
export async function createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
  try {
    const db = await getDb();
    const id = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    await db.run(
      `
      INSERT INTO audit_logs (id, user_id, user_name, user_role, action, entity, entity_id, details_json, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        log.userId,
        log.userName,
        log.userRole,
        log.action,
        log.entity,
        log.entityId || null,
        log.details ? JSON.stringify(log.details) : null,
        log.ipAddress || null,
        now
      ]
    );
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

export async function getAuditLogs(limit = 100): Promise<AuditLog[]> {
  const db = await getDb();
  const safeLimit = Math.max(1, Math.floor(Number(limit) || 100));
  const rows = await db.all<any>('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?', [safeLimit]);
  return rows.map(r => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    userRole: r.user_role as UserRole,
    action: r.action,
    entity: r.entity,
    entityId: r.entity_id || undefined,
    details: r.details_json ? JSON.parse(r.details_json) : undefined,
    ipAddress: r.ip_address || undefined,
    createdAt: r.created_at
  }));
}

// Admin Stats
export async function getAdminStats() {
  const db = await getDb();

  const totalOrdersRow = await db.get<{ count: number | string }>('SELECT COUNT(*) as count FROM orders');
  const totalOrders = Number(totalOrdersRow?.count || 0);

  const paidRevRow = await db.get<{ sum: number | string | null }>(
    "SELECT SUM(total) as sum FROM orders WHERE payment_status = 'PAID'"
  );
  const paidRevenue = Number(paidRevRow?.sum || 0);

  const pendingRevRow = await db.get<{ sum: number | string | null }>(
    "SELECT SUM(total) as sum FROM orders WHERE payment_status = 'PENDING' AND order_status != 'CANCELLED'"
  );
  const pendingRevenue = Number(pendingRevRow?.sum || 0);

  const grossRevRow = await db.get<{ sum: number | string | null }>(
    "SELECT SUM(total) as sum FROM orders WHERE order_status != 'CANCELLED'"
  );
  const grossRevenue = Number(grossRevRow?.sum || 0);

  const totalProdsRow = await db.get<{ count: number | string }>(
    'SELECT COUNT(*) as count FROM products WHERE is_archived = 0'
  );
  const totalProducts = Number(totalProdsRow?.count || 0);

  const lowStockRow = await db.get<{ count: number | string }>(
    'SELECT COUNT(*) as count FROM products WHERE is_archived = 0 AND stock > 0 AND stock <= 5'
  );
  const lowStock = Number(lowStockRow?.count || 0);

  const outOfStockRow = await db.get<{ count: number | string }>(
    'SELECT COUNT(*) as count FROM products WHERE is_archived = 0 AND stock = 0'
  );
  const outOfStock = Number(outOfStockRow?.count || 0);

  const { orders: recentOrders } = await getOrders({ limit: 5 });

  const statusRows = await db.all<{ order_status: string; count: number | string }>(
    'SELECT order_status, COUNT(*) as count FROM orders GROUP BY order_status'
  );
  const statusBreakdown: Record<string, number> = {};
  for (const s of statusRows) {
    statusBreakdown[s.order_status] = Number(s.count || 0);
  }

  return {
    totalOrders,
    grossRevenue,
    paidRevenue,
    pendingRevenue,
    totalProducts,
    lowStock,
    outOfStock,
    recentOrders,
    statusBreakdown
  };
}
