import { NextRequest, NextResponse } from 'next/server';
import { createProduct, updateProduct, getProducts, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { csvContent } = await req.json();
    if (!csvContent || typeof csvContent !== 'string') {
      return NextResponse.json({ error: 'No CSV content provided' }, { status: 400 });
    }

    const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file must have a header row and at least one data row' }, { status: 400 });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    const requiredHeaders = ['name', 'price'];
    for (const reqH of requiredHeaders) {
      if (!headers.includes(reqH)) {
        return NextResponse.json({ error: `Missing required column: "${reqH}"` }, { status: 400 });
      }
    }

    const nameIdx = headers.indexOf('name');
    const priceIdx = headers.indexOf('price');
    const skuIdx = headers.indexOf('sku');
    const comparePriceIdx = headers.indexOf('compareatprice');
    const stockIdx = headers.indexOf('stock');
    const catIdx = headers.indexOf('categoryid');
    const pubIdx = headers.indexOf('ispublished');
    const tagIdx = headers.indexOf('tags');

    let createdCount = 0;
    let errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Basic CSV splitter respecting quotes
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      const cleanVals = values.map(v => v.trim().replace(/^["']|["']$/g, ''));

      const name = cleanVals[nameIdx];
      const price = parseFloat(cleanVals[priceIdx]);

      if (!name) {
        errors.push(`Row ${i + 1}: Name is empty`);
        continue;
      }
      if (isNaN(price) || price <= 0) {
        errors.push(`Row ${i + 1}: Invalid price for "${name}"`);
        continue;
      }

      const sku = skuIdx > -1 && cleanVals[skuIdx] ? cleanVals[skuIdx] : `SKU-${Date.now()}-${i}`;
      const compareAtPrice = comparePriceIdx > -1 && cleanVals[comparePriceIdx] ? parseFloat(cleanVals[comparePriceIdx]) : undefined;
      const stock = stockIdx > -1 && cleanVals[stockIdx] ? parseInt(cleanVals[stockIdx], 10) : 10;
      const categoryId = catIdx > -1 && cleanVals[catIdx] ? cleanVals[catIdx] : 'cat-1';
      const isPublished = pubIdx > -1 ? cleanVals[pubIdx].toLowerCase() === 'true' : true;
      const tags = tagIdx > -1 && cleanVals[tagIdx] ? cleanVals[tagIdx].split(';').map(t => t.trim()) : [];

      await createProduct({
        name,
        slug: `${slugify(name)}-${Date.now()}-${i}`,
        sku,
        description: `Handcrafted ${name} in authentic heritage craft.`,
        price,
        compareAtPrice: isNaN(compareAtPrice as number) ? undefined : compareAtPrice,
        stock: isNaN(stock) ? 5 : stock,
        categoryId,
        collectionIds: [],
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        variants: [],
        attributes: [{ name: 'Craft', value: 'Artisanal Handloom' }],
        tags,
        isFeatured: false,
        isPublished,
        isArchived: false
      });

      createdCount++;
    }

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'CSV_IMPORT_PRODUCTS',
      entity: 'PRODUCT',
      details: { createdCount, errorsCount: errors.length }
    });

    return NextResponse.json({
      success: true,
      createdCount,
      errors: errors.slice(0, 10)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

