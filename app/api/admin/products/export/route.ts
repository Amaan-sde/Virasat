import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { products } = await getProducts({ limit: 1000, isPublished: undefined, isArchived: undefined });

    const headers = ['id', 'sku', 'name', 'price', 'compareAtPrice', 'stock', 'categoryId', 'isPublished', 'tags'];
    const csvRows = [headers.join(',')];

    for (const p of products) {
      const row = [
        `"${p.id}"`,
        `"${p.sku}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        p.price,
        p.compareAtPrice || '',
        p.stock,
        `"${p.categoryId}"`,
        p.isPublished ? 'TRUE' : 'FALSE',
        `"${(p.tags || []).join(';')}"`
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="virasat-products-${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

