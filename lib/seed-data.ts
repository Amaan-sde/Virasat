import { Category, Collection, DiscountCoupon, HomepageSection, Product, StoreSettings } from '../types/index';

export const initialStoreSettings: StoreSettings = {
  id: 'store-settings-1',
  storeName: 'VIRASAT',
  tagline: 'Imperial Handlooms & Heritage Jewels',
  logoUrl: '',
  faviconUrl: '',
  announcementText: '✨ Festive Elegance: Complimentary Pure Silk Potli with orders above ₹4,999 | Free Express Delivery across India',
  announcementLink: '/shop',
  isAnnouncementVisible: true,
  currencySymbol: '₹',
  currencyCode: 'INR',
  taxRate: 5,
  freeShippingThreshold: 1999,
  standardShippingFee: 99,
  codEnabled: true,
  codFee: 50,
  contactEmail: 'care@virasatheritage.com',
  contactPhone: '+91 98765 43210',
  storeAddress: 'Heritage Manor, 44 Palace Road, Bengaluru, Karnataka 560001, India',
  socialLinks: {
    instagram: 'https://instagram.com/virasatheritage',
    facebook: 'https://facebook.com/virasatheritage',
    pinterest: 'https://pinterest.com/virasatheritage',
    whatsapp: '+919876543210'
  },
  headerNav: [
    { id: 'nav-1', label: 'All Sarees', url: '/categories/sarees' },
    { id: 'nav-2', label: 'Lehengas', url: '/categories/lehengas' },
    { id: 'nav-3', label: 'Kurtas & Suits', url: '/categories/kurtas' },
    { id: 'nav-4', label: 'Heritage Jewellery', url: '/categories/jewellery' },
    { id: 'nav-5', label: 'Dupattas & Shawls', url: '/categories/dupattas' },
    { id: 'nav-6', label: 'Festive Edit', url: '/collections/festive-edit', badge: 'New' }
  ],
  footerNav: [
    { id: 'f-1', label: 'About Virasat', url: '/about' },
    { id: 'f-2', label: 'Artisan Heritage', url: '/about#artisans' },
    { id: 'f-3', label: 'Contact Us', url: '/contact' },
    { id: 'f-4', label: 'Shipping & Delivery', url: '/policies/shipping' },
    { id: 'f-5', label: 'Returns & Exchange', url: '/policies/returns' },
    { id: 'f-6', label: 'Terms & Conditions', url: '/policies/terms' },
    { id: 'f-7', label: 'Privacy Policy', url: '/policies/privacy' },
    { id: 'f-8', label: 'FAQs', url: '/faq' }
  ],
  seoMetaTitle: 'VIRASAT | Handcrafted Heritage Sarees, Lehengas & Royal Indian Jewellery',
  seoMetaDescription: 'Discover authentic Kanjeevaram silks, Banarasi brocades, royal bridal lehengas, and handcrafted temple jewellery. Certified handloom authenticity, worldwide shipping.',
  paymentGatewayConfigured: false,
  razorpayKeyId: '',
  updatedAt: new Date().toISOString()
};

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Sarees',
    slug: 'sarees',
    description: 'Master handloom weaves in pure Kanjeevaram, Banarasi, Chanderi, and Tussar silks.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    isVisible: true,
    seoTitle: 'Pure Silk & Handloom Sarees Collection | Virasat',
    seoDescription: 'Shop exquisite pure Kanjeevaram silk, Banarasi zari, and Chanderi sarees handcrafted by master artisans.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat-2',
    name: 'Lehengas & Bridal',
    slug: 'lehengas',
    description: 'Opulent bridal lehengas featuring intricate zardozi, gota patti, and hand embroidery.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
    isVisible: true,
    seoTitle: 'Designer Bridal & Festive Lehengas | Virasat',
    seoDescription: 'Handcrafted imperial lehengas with heritage zardozi, resham thread work, and pure silk flair.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat-3',
    name: 'Kurtas & Anarkalis',
    slug: 'kurtas',
    description: 'Regal silhouette kurta sets, Angrakha ensembles, and royal handblock printed sets.',
    image: 'https://images.unsplash.com/photo-1596783049557-414df9cf6c4d?auto=format&fit=crop&w=800&q=80',
    displayOrder: 3,
    isVisible: true,
    seoTitle: 'Handcrafted Kurta Sets & Anarkali Suits | Virasat',
    seoDescription: 'Bespoke handloom kurtas, palazzo suits, and embroidered festive silhouettes.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat-4',
    name: 'Heritage Jewellery',
    slug: 'jewellery',
    description: '22K gold plated temple jewellery, antique Kundan polki sets, and handcrafted jadau pieces.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    displayOrder: 4,
    isVisible: true,
    seoTitle: 'Antique Temple & Kundan Jewellery | Virasat',
    seoDescription: 'Heritage temple jewellery, kundan chokers, jhumkas, and royal heirloom ornaments.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat-5',
    name: 'Dupattas & Shawls',
    slug: 'dupattas',
    description: 'Artisanal Kalamkari silk dupattas, Bandhani stoles, and hand-embroidered Kashmiri Pashmina shawls.',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
    displayOrder: 5,
    isVisible: true,
    seoTitle: 'Artisanal Dupattas & Pure Pashmina Shawls | Virasat',
    seoDescription: 'Authentic hand-woven Kalamkari, Bandhani, and pure Kashmiri Pashmina shawls.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat-6',
    name: 'Festive Accessories',
    slug: 'accessories',
    description: 'Hand-embroidered zardozi potli bags, embellished mojaris, and heirloom waist belts.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    displayOrder: 6,
    isVisible: true,
    seoTitle: 'Embroidered Potlis & Festive Accessories | Virasat',
    seoDescription: 'Complete your ethnic look with hand-embroidered silk potlis and royal bridal accessories.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Royal Bridal Heritage',
    slug: 'royal-bridal',
    description: 'Bespoke bridal heirlooms inspired by Mughal and Rajput royal archives.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85',
    displayOrder: 1,
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'col-2',
    name: 'Pure Zari Banarasi Archive',
    slug: 'banarasi-archive',
    description: 'Intricately woven brocades from the ghats of Varanasi featuring pure silver zari.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
    displayOrder: 2,
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'col-3',
    name: 'Festive Edit 2026',
    slug: 'festive-edit',
    description: 'Vibrant celebratory silks, lightweight organzas, and shimmering temple jewellery.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1600&q=85',
    displayOrder: 3,
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Imperial Kanjeevaram Pure Mulberry Silk Saree',
    slug: 'imperial-kanjeevaram-pure-mulberry-silk-saree',
    sku: 'SAR-KAN-001',
    description: 'Handcrafted by national award-winning weavers in Kanchipuram, this heirloom saree features 100% pure Mulberry silk with 3-ply twisted yarn. Adorned with authentic antique gold zari woven into traditional peacock and temple border motifs (Korvai weave). Accompanied by a matching unstitched pure silk blouse piece with border detailing.',
    shortDescription: 'Pure Mulberry silk handwoven Korvai saree with antique gold zari temple motifs.',
    price: 18499,
    compareAtPrice: 24999,
    costPrice: 11000,
    stock: 7,
    categoryId: 'cat-1',
    categoryName: 'Sarees',
    collectionIds: ['col-1', 'col-3'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      {
        id: 'var-1-1',
        sku: 'SAR-KAN-001-CRIMSON',
        title: 'Crimson & Muted Gold / Free Size with Blouse',
        size: 'Free Size (5.5m + 0.8m)',
        color: 'Royal Crimson',
        colorHex: '#6B1724',
        price: 18499,
        compareAtPrice: 24999,
        stock: 4
      },
      {
        id: 'var-1-2',
        sku: 'SAR-KAN-001-EMERALD',
        title: 'Emerald Green & Gold / Free Size with Blouse',
        size: 'Free Size (5.5m + 0.8m)',
        color: 'Imperial Emerald',
        colorHex: '#1D4E3E',
        price: 18499,
        compareAtPrice: 24999,
        stock: 3
      }
    ],
    attributes: [
      { name: 'Fabric', value: '100% Pure Mulberry Silk (Silk Mark Certified)' },
      { name: 'Weave Technique', value: 'Traditional Handloom Korvai Weave' },
      { name: 'Zari Type', value: 'Tested Antique Gold Metallic Zari' },
      { name: 'Length & Width', value: '5.5 Meters Saree + 80 cm Running Blouse Piece' },
      { name: 'Care Instructions', value: 'Dry Clean Only. Store wrapped in pure muslin cloth.' },
      { name: 'Origin', value: 'Kanchipuram, Tamil Nadu' }
    ],
    tags: ['Silk Mark', 'Handloom', 'Bridal', 'Kanjeevaram', 'Bestseller'],
    isFeatured: true,
    isPublished: true,
    isArchived: false,
    seoTitle: 'Imperial Kanjeevaram Silk Saree in Royal Crimson | Virasat',
    seoDescription: 'Own an authentic handwoven Kanjeevaram pure silk saree with antique zari border. Silk mark certified with unstitched blouse piece.',
    rating: 4.9,
    reviewCount: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Varanasi Heritage Kadwa Meenakari Banarasi Saree',
    slug: 'varanasi-heritage-kadwa-meenakari-banarasi-saree',
    sku: 'SAR-BAN-002',
    description: 'An ode to 500 years of Banaras weaving excellence. This majestic saree is woven on a traditional pit loom using the Kadwa technique, where each motif is individually hand-threaded. Adorned with delicate floral jaal with subtle Meenakari resham accents against rich antique zari.',
    shortDescription: 'Pure Katan silk Kadwa woven Banarasi saree with resham meenakari details.',
    price: 22999,
    compareAtPrice: 29999,
    costPrice: 14000,
    stock: 5,
    categoryId: 'cat-1',
    categoryName: 'Sarees',
    collectionIds: ['col-2', 'col-1'],
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      {
        id: 'var-2-1',
        sku: 'SAR-BAN-002-NAVY',
        title: 'Midnight Royal Blue / Free Size',
        size: 'Free Size',
        color: 'Midnight Navy',
        colorHex: '#1B263B',
        price: 22999,
        compareAtPrice: 29999,
        stock: 3
      },
      {
        id: 'var-2-2',
        sku: 'SAR-BAN-002-MAGENTA',
        title: 'Rani Pink / Free Size',
        size: 'Free Size',
        color: 'Rani Pink',
        colorHex: '#9E2A2B',
        price: 22999,
        compareAtPrice: 29999,
        stock: 2
      }
    ],
    attributes: [
      { name: 'Fabric', value: 'Pure Katan Silk' },
      { name: 'Weave', value: 'Authentic Banarasi Handloom Kadwa' },
      { name: 'Zari', value: 'Pure Silver Dipped Zari' },
      { name: 'Care', value: 'Dry Clean Only' },
      { name: 'Origin', value: 'Varanasi, Uttar Pradesh' }
    ],
    tags: ['Banarasi', 'Kadwa', 'Heirloom', 'Silk Mark'],
    isFeatured: true,
    isPublished: true,
    isArchived: false,
    seoTitle: 'Kadwa Meenakari Pure Silk Banarasi Saree | Virasat',
    seoDescription: 'Handcrafted Kadwa Banarasi Katan silk saree with antique zari jaal and Meenakari floral craftsmanship.',
    rating: 5.0,
    reviewCount: 19,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Noor-e-Awadh Hand-Embroidered Raw Silk Lehenga',
    slug: 'noor-e-awadh-hand-embroidered-raw-silk-lehenga',
    sku: 'LEH-AWA-003',
    description: 'Inspired by Awadhi royalty, this bridal masterpiece takes over 240 artisan hours of intricate hand-embroidery. Tailored from 100% pure raw silk with a generous 5.5-meter flare, featuring dabka, cutdana, sequins, and micro-pearl zardozi work. Paired with a heavy designer blouse and two dupattas (one raw silk, one soft French net).',
    shortDescription: 'Regal raw silk bridal lehenga with 240+ hours of hand zardozi and double dupatta.',
    price: 49999,
    compareAtPrice: 65000,
    costPrice: 28000,
    stock: 4,
    categoryId: 'cat-2',
    categoryName: 'Lehengas & Bridal',
    collectionIds: ['col-1'],
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      {
        id: 'var-3-1',
        sku: 'LEH-AWA-003-S',
        title: 'Imperial Crimson / Size S',
        size: 'S (Bust 34-36)',
        color: 'Imperial Crimson',
        colorHex: '#6B1724',
        price: 49999,
        compareAtPrice: 65000,
        stock: 1
      },
      {
        id: 'var-3-2',
        sku: 'LEH-AWA-003-M',
        title: 'Imperial Crimson / Size M',
        size: 'M (Bust 36-38)',
        color: 'Imperial Crimson',
        colorHex: '#6B1724',
        price: 49999,
        compareAtPrice: 65000,
        stock: 2
      },
      {
        id: 'var-3-3',
        sku: 'LEH-AWA-003-L',
        title: 'Imperial Crimson / Size L',
        size: 'L (Bust 38-40)',
        color: 'Imperial Crimson',
        colorHex: '#6B1724',
        price: 49999,
        compareAtPrice: 65000,
        stock: 1
      }
    ],
    attributes: [
      { name: 'Lehenga Fabric', value: '100% Pure Raw Silk with Cancan & Double Lining' },
      { name: 'Embroidery', value: 'Handcrafted Zardozi, Dabka & Cutdana' },
      { name: 'Dupattas Included', value: '2 Dupattas (Raw Silk & Soft Sheer Net)' },
      { name: 'Flare', value: '5.5 Meters full circle flare' },
      { name: 'Care', value: 'Professional Dry Clean Only' }
    ],
    tags: ['Bridal', 'Luxury', 'Zardozi', 'Raw Silk', 'Wedding'],
    isFeatured: true,
    isPublished: true,
    isArchived: false,
    seoTitle: 'Noor-e-Awadh Hand-Embroidered Raw Silk Lehenga | Virasat',
    seoDescription: 'Bespoke hand-embroidered raw silk bridal lehenga with royal dabka work and dual dupattas. Custom tailoring available.',
    rating: 4.95,
    reviewCount: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Padmavati Antique Temple Gold & Polki Choker Set',
    slug: 'padmavati-antique-temple-gold-polki-choker-set',
    sku: 'JEW-CHO-004',
    description: 'An extraordinary heirloom jewellery set inspired by ancient South Indian temple carvings. Crafted in pure copper alloy with 22K antique matte gold micron plating. Hand-inlaid with natural uncut polki stones, Kemp ruby cabochons, and clustered south-sea pearls. Comes with matching statement chandelier jhumkas and adjustable dori.',
    shortDescription: '22K antique gold plated temple choker with uncut polki, ruby cabochons & matching jhumkas.',
    price: 8999,
    compareAtPrice: 12999,
    costPrice: 4200,
    stock: 12,
    categoryId: 'cat-4',
    categoryName: 'Heritage Jewellery',
    collectionIds: ['col-1', 'col-3'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      {
        id: 'var-4-1',
        sku: 'JEW-CHO-004-RUBY',
        title: 'Antique Gold with Ruby Kemp Stones',
        size: 'Adjustable',
        color: 'Antique Gold / Ruby',
        colorHex: '#C5A059',
        price: 8999,
        compareAtPrice: 12999,
        stock: 8
      },
      {
        id: 'var-4-2',
        sku: 'JEW-CHO-004-EMERALD',
        title: 'Antique Gold with Emerald Cabochons',
        size: 'Adjustable',
        color: 'Antique Gold / Emerald',
        colorHex: '#1D4E3E',
        price: 8999,
        compareAtPrice: 12999,
        stock: 4
      }
    ],
    attributes: [
      { name: 'Metal & Plating', value: 'Brass & Copper Alloy with 22K Antique Matte Gold Micron Plating' },
      { name: 'Stone Types', value: 'Hydro Uncut Polki, High-Grade Kemp Stones, Seed Pearls' },
      { name: 'Closure', value: 'Adjustable Hand-Woven Golden Silk Cord (Dori)' },
      { name: 'Package Contents', value: '1 Choker Necklace, 1 Pair of Statement Jhumkas' },
      { name: 'Hypoallergenic', value: 'Lead & Nickel Free certified' }
    ],
    tags: ['Temple Jewellery', 'Choker', 'Bridal Jewels', 'Antique Gold', 'Bestseller'],
    isFeatured: true,
    isPublished: true,
    isArchived: false,
    seoTitle: 'Padmavati Temple Gold & Polki Choker Set | Virasat',
    seoDescription: 'Handcrafted 22K antique gold plated temple choker set with polki stones and chandelier jhumkas. Authentic heirloom jewellery.',
    rating: 4.88,
    reviewCount: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Chanderi Silk Handblock Printed Angrakha Kurta Set',
    slug: 'chanderi-silk-handblock-printed-angrakha-kurta-set',
    sku: 'KUR-CHA-005',
    description: 'Graceful Angrakha silhouette crafted in airy Chanderi cotton-silk fabric. Features traditional Bagru mud-resist handblock printing done with natural organic vegetable dyes, framed by delicate zari border trims and handmade potli buttons. Comes with pure cotton straight pants and a lightweight Kota Doria dupatta with zari pallu.',
    shortDescription: 'Chanderi silk-cotton Angrakha with authentic Bagru block printing and Kota dupatta.',
    price: 6499,
    compareAtPrice: 8999,
    costPrice: 3100,
    stock: 15,
    categoryId: 'cat-3',
    categoryName: 'Kurtas & Anarkalis',
    collectionIds: ['col-3'],
    images: [
      'https://images.unsplash.com/photo-1596783049557-414df9cf6c4d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      {
        id: 'var-5-1',
        sku: 'KUR-CHA-005-S',
        title: 'Ivory Terracotta / Size S',
        size: 'S',
        color: 'Terracotta Ivory',
        colorHex: '#C86D51',
        price: 6499,
        compareAtPrice: 8999,
        stock: 4
      },
      {
        id: 'var-5-2',
        sku: 'KUR-CHA-005-M',
        title: 'Ivory Terracotta / Size M',
        size: 'M',
        color: 'Terracotta Ivory',
        colorHex: '#C86D51',
        price: 6499,
        compareAtPrice: 8999,
        stock: 6
      },
      {
        id: 'var-5-3',
        sku: 'KUR-CHA-005-L',
        title: 'Ivory Terracotta / Size L',
        size: 'L',
        color: 'Terracotta Ivory',
        colorHex: '#C86D51',
        price: 6499,
        compareAtPrice: 8999,
        stock: 3
      },
      {
        id: 'var-5-4',
        sku: 'KUR-CHA-005-XL',
        title: 'Ivory Terracotta / Size XL',
        size: 'XL',
        color: 'Terracotta Ivory',
        colorHex: '#C86D51',
        price: 6499,
        compareAtPrice: 8999,
        stock: 2
      }
    ],
    attributes: [
      { name: 'Kurta Fabric', value: 'Pure Chanderi Silk-Cotton Blend' },
      { name: 'Pants Fabric', value: '100% Breathable Malmal Cotton' },
      { name: 'Dupatta Fabric', value: 'Kota Doria with Zari Weaving' },
      { name: 'Craft', value: 'Traditional Bagru Dabu Block Print' },
      { name: 'Care', value: 'Gentle Hand Wash with Mild Detergent / Dry Clean' }
    ],
    tags: ['Chanderi', 'Block Print', 'Angrakha', 'Festive Casual', 'New'],
    isFeatured: true,
    isPublished: true,
    isArchived: false,
    seoTitle: 'Chanderi Silk Handblock Angrakha Kurta Set | Virasat',
    seoDescription: 'Shop handcrafted Chanderi cotton silk Angrakha suit with pure cotton pants and Kota Doria dupatta.',
    rating: 4.8,
    reviewCount: 31,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Kashmiri Pure Pashmina Hand-Embroidered Sozni Shawl',
    slug: 'kashmiri-pure-pashmina-hand-embroidered-sozni-shawl',
    sku: 'SHA-PAS-006',
    description: 'Spun from the finest Changthangi mountain goat fleece (Cashmere), this authentic Kashmiri Pashmina shawl features needlepoint Sozni embroidery executed over 6 months by valley masters. Feather-light, exceptionally warm, and certified with the GI (Geographical Indication) tag of Jammu & Kashmir.',
    shortDescription: '100% certified Cashmere Pashmina with fine needle Sozni embroidery.',
    price: 15999,
    compareAtPrice: 21999,
    costPrice: 9500,
    stock: 6,
    categoryId: 'cat-5',
    categoryName: 'Dupattas & Shawls',
    collectionIds: ['col-2'],
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      {
        id: 'var-6-1',
        sku: 'SHA-PAS-006-IVORY',
        title: 'Natural Ivory Cream',
        size: '200cm x 100cm',
        color: 'Natural Ivory',
        colorHex: '#FAF7F2',
        price: 15999,
        compareAtPrice: 21999,
        stock: 4
      },
      {
        id: 'var-6-2',
        sku: 'SHA-PAS-006-MAROON',
        title: 'Imperial Maroon',
        size: '200cm x 100cm',
        color: 'Imperial Maroon',
        colorHex: '#6B1724',
        price: 15999,
        compareAtPrice: 21999,
        stock: 2
      }
    ],
    attributes: [
      { name: 'Material', value: '100% Pure Grade-A Changthangi Pashmina Wool' },
      { name: 'Craft', value: 'Needlepoint Sozni Hand Embroidery' },
      { name: 'Dimensions', value: '100 cm x 200 cm (Standard Full Shawl)' },
      { name: 'GI Certified', value: 'Yes, includes Kashmiri Artisan Authenticity Tag' },
      { name: 'Care', value: 'Strictly Dry Clean Only' }
    ],
    tags: ['Pashmina', 'Kashmir', 'Sozni', 'Winter Luxury', 'GI Certified'],
    isFeatured: true,
    isPublished: true,
    isArchived: false,
    seoTitle: 'Pure Pashmina Sozni Hand-Embroidered Shawl | Virasat',
    seoDescription: 'Authentic 100% Cashmere Pashmina shawl with fine Sozni needlework. GI certified, direct from Srinagar artisans.',
    rating: 4.96,
    reviewCount: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Kalamkari Handpainted Pure Tussar Silk Saree',
    slug: 'kalamkari-handpainted-pure-tussar-silk-saree',
    sku: 'SAR-KAL-007',
    description: 'An art collector’s dream. Hand-drawn and painted using traditional bamboo pens (Kalam) with natural tree bark, madder root, and indigo dyes in Srikalahasti. Depicts mythological tree-of-life and floral motifs across rich textured wild Tussar silk.',
    shortDescription: 'Wild Tussar silk handpainted using organic dyes and traditional Kalam pen.',
    price: 13999,
    compareAtPrice: 18500,
    costPrice: 8000,
    stock: 5,
    categoryId: 'cat-1',
    categoryName: 'Sarees',
    collectionIds: ['col-2'],
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      {
        id: 'var-7-1',
        sku: 'SAR-KAL-007-OCHRE',
        title: 'Antique Ochre & Rust / Free Size',
        size: 'Free Size',
        color: 'Antique Ochre',
        colorHex: '#C5A059',
        price: 13999,
        compareAtPrice: 18500,
        stock: 5
      }
    ],
    attributes: [
      { name: 'Fabric', value: 'Pure Wild Tussar Silk' },
      { name: 'Craft', value: 'Authentic Srikalahasti Kalamkari Hand Painting' },
      { name: 'Dyes', value: '100% Natural Organic Vegetable Dyes' },
      { name: 'Origin', value: 'Andhra Pradesh, India' }
    ],
    tags: ['Tussar Silk', 'Kalamkari', 'Artisanal', 'Handpainted'],
    isFeatured: false,
    isPublished: true,
    isArchived: false,
    seoTitle: 'Authentic Kalamkari Handpainted Tussar Silk Saree | Virasat',
    seoDescription: 'Handpainted Srikalahasti Kalamkari saree on wild pure Tussar silk. Natural dyes, certified artisan craft.',
    rating: 4.85,
    reviewCount: 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Devi Antique Matte Gold Temple Kada Bangles (Pair)',
    slug: 'devi-antique-matte-gold-temple-kada-bangles-pair',
    sku: 'JEW-BAN-008',
    description: 'Magnificent pair of temple kada openable bangles featuring intricately sculpted Gajalakshmi and Mayura motifs. Embellished with synthetic Kemp rubies and screw-lock mechanism.',
    shortDescription: 'Pair of 22K antique matte gold plated temple kada with Mayura carvings.',
    price: 4499,
    compareAtPrice: 6200,
    costPrice: 2000,
    stock: 14,
    categoryId: 'cat-4',
    categoryName: 'Heritage Jewellery',
    collectionIds: ['col-3'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      {
        id: 'var-8-1',
        sku: 'JEW-BAN-008-24',
        title: 'Size 2.4 (Small/Medium)',
        size: '2.4',
        color: 'Antique Gold',
        colorHex: '#C5A059',
        price: 4499,
        compareAtPrice: 6200,
        stock: 7
      },
      {
        id: 'var-8-2',
        sku: 'JEW-BAN-008-26',
        title: 'Size 2.6 (Medium/Large)',
        size: '2.6',
        color: 'Antique Gold',
        colorHex: '#C5A059',
        price: 4499,
        compareAtPrice: 6200,
        stock: 7
      }
    ],
    attributes: [
      { name: 'Metal', value: 'High grade brass alloy with 22K antique gold dip' },
      { name: 'Locking System', value: 'Side Screw Hinged Opening' },
      { name: 'Stones', value: 'Kemp Faceted Ruby Red' }
    ],
    tags: ['Temple Kada', 'Bangles', 'Gold Plated', 'Antique'],
    isFeatured: false,
    isPublished: true,
    isArchived: false,
    seoTitle: 'Devi Antique Gold Temple Kada Bangles | Virasat',
    seoDescription: 'Handcrafted antique gold temple openable kada bangles with traditional Mayura carvings.',
    rating: 4.9,
    reviewCount: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialDiscounts: DiscountCoupon[] = [
  {
    id: 'disc-1',
    code: 'VIRASAT10',
    type: 'PERCENTAGE',
    value: 10,
    minOrderValue: 2999,
    maxDiscount: 2000,
    isActive: true,
    usageLimit: 1000,
    usageCount: 42,
    createdAt: new Date().toISOString()
  },
  {
    id: 'disc-2',
    code: 'FESTIVE15',
    type: 'PERCENTAGE',
    value: 15,
    minOrderValue: 7999,
    maxDiscount: 5000,
    isActive: true,
    usageLimit: 500,
    usageCount: 18,
    createdAt: new Date().toISOString()
  },
  {
    id: 'disc-3',
    code: 'ROYALFLAT1000',
    type: 'FIXED',
    value: 1000,
    minOrderValue: 12000,
    isActive: true,
    usageLimit: 200,
    usageCount: 9,
    createdAt: new Date().toISOString()
  }
];

export const initialHomepageSections: HomepageSection[] = [
  {
    id: 'sec-hero',
    sectionType: 'HERO_SLIDER',
    title: 'Hero Slides',
    subtitle: 'Main homepage visual carousel',
    displayOrder: 1,
    isVisible: true,
    content: {
      slides: [
        {
          badge: 'Imperial Handloom Archive',
          heading: 'Woven for Royalty, Tailored for Eternity',
          subheading: 'Immerse in pure mulberry Kanjeevarams, Kadwa Banarasi silks, and museum-grade heritage weaves from master Indian artisans.',
          primaryBtnText: 'Explore Silk Sarees',
          primaryBtnUrl: '/categories/sarees',
          secondaryBtnText: 'View Bridal Edit',
          secondaryBtnUrl: '/collections/royal-bridal',
          imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85',
          overlayOpacity: 45
        },
        {
          badge: 'Handcrafted Jewels',
          heading: 'Antique Temple Gold & Uncut Polki Heirloom Jewels',
          subheading: 'Recreating historic palace grandeur with 22K gold micron-plated ornaments sculpted with Kemp stones and seed pearls.',
          primaryBtnText: 'Discover Jewellery',
          primaryBtnUrl: '/categories/jewellery',
          secondaryBtnText: 'Festive Collection',
          secondaryBtnUrl: '/collections/festive-edit',
          imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1800&q=85',
          overlayOpacity: 40
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sec-categories',
    sectionType: 'CATEGORY_GRID',
    title: 'Curated by Heritage Craft',
    subtitle: 'Explore distinct handloom traditions and artisanal embellishments',
    displayOrder: 2,
    isVisible: true,
    content: {
      categoryIds: ['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5', 'cat-6']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sec-featured-1',
    sectionType: 'FEATURED_COLLECTION',
    title: 'Royal Bridal Heritage',
    subtitle: 'Unrivalled opulence crafted with pure silver zari and 200+ artisan hours',
    displayOrder: 3,
    isVisible: true,
    content: {
      collectionId: 'col-1',
      limit: 4,
      viewAllUrl: '/collections/royal-bridal'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sec-promo-1',
    sectionType: 'PROMO_BANNER',
    title: 'The Pure Zari Banarasi Masterpiece',
    subtitle: 'Special Curated Archive',
    displayOrder: 4,
    isVisible: true,
    content: {
      tag: 'Handloom Authenticity Guarantee',
      heading: 'The Pure Zari Banarasi Archive',
      description: 'Handwoven in the ancient heart of Varanasi on pit looms using pure silver electroplated in 24 karat gold. Each piece is an irreplaceable work of wearable art.',
      btnText: 'Shop Banarasi Weaves',
      btnUrl: '/categories/sarees',
      imageUrl: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=85'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sec-bestsellers',
    sectionType: 'BEST_SELLERS',
    title: 'Most Cherished Heirlooms',
    subtitle: 'The coveted selections loved by discerning connoisseurs worldwide',
    displayOrder: 5,
    isVisible: true,
    content: {
      limit: 4
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sec-brand-story',
    sectionType: 'BRAND_STORY',
    title: 'Woven in Tradition, Tailored for Grace',
    subtitle: 'Our Artisan Collective',
    displayOrder: 6,
    isVisible: true,
    content: {
      leadText: 'Virasat was founded with an unyielding reverence for India’s living textile heritage.',
      bodyText: 'We partner directly with over 300 hereditary master weavers and jewellery sculptors across Varanasi, Kanchipuram, Chanderi, and Kashmir. By bypassing multiple layers of intermediaries, we guarantee authentic, certified pure silk and museum-grade finishes while ensuring dignified, sustainable livelihoods for our artisans.',
      stat1Number: '300+',
      stat1Label: 'Hereditary Weavers Supported',
      stat2Number: '100%',
      stat2Label: 'Certified Silk Mark Authentic',
      stat3Number: '18+',
      stat3Label: 'Countries Delivered Worldwide',
      imageUrl: 'https://images.unsplash.com/photo-1596783049557-414df9cf6c4d?auto=format&fit=crop&w=1200&q=85'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sec-trust',
    sectionType: 'TRUST_FEATURES',
    title: 'The Virasat Promise',
    subtitle: 'Uncompromising quality and transparency in every parcel',
    displayOrder: 7,
    isVisible: true,
    content: {
      features: [
        {
          icon: 'ShieldCheck',
          title: 'Silk Mark Certified',
          description: 'Every pure silk weave carries a tamper-evident Silk Mark tag verifying genuine natural silk yarn.'
        },
        {
          icon: 'Truck',
          title: 'Insured Global Shipping',
          description: 'Complimentary insured delivery across India; express worldwide dispatch to 18+ nations.'
        },
        {
          icon: 'Sparkles',
          title: 'Direct Artisan Patronage',
          description: 'Zero middlemen. Fair-trade pricing guaranteeing ethical compensation to master craftsmen.'
        },
        {
          icon: 'RefreshCw',
          title: 'Seamless 7-Day Exchange',
          description: 'Hassle-free reverse pick-up and exchange policy for your complete peace of mind.'
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sec-newsletter',
    sectionType: 'NEWSLETTER',
    title: 'Join The Virasat Connoisseurs Circle',
    subtitle: 'Be the first to access intimate weaver drops, bridal previews, and festive curations.',
    displayOrder: 8,
    isVisible: true,
    content: {
      buttonText: 'Request Invitation',
      placeholder: 'Enter your email address',
      disclaimer: 'We respect your privacy. Unsubscribe anytime with 1 click.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
