import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const categorySlug = searchParams.get('category') || undefined;
    const collectionSlug = searchParams.get('collection') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const inStock = searchParams.get('inStock') === 'true';
    const isFeatured = searchParams.get('featured') === 'true' ? true : undefined;
    const sort = (searchParams.get('sort') as any) || 'newest';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : 0;
    const isPublished = searchParams.get('all') === 'true' ? undefined : true;

    const result = await getProducts({
      search,
      categorySlug,
      collectionSlug,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      sort,
      limit,
      offset,
      isPublished
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Product name and price are required' }, { status: 400 });
    }

    const slug = body.slug ? slugify(body.slug) : `${slugify(body.name)}-${Date.now()}`;
    const product = await createProduct({
      ...body,
      slug,
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      costPrice: body.costPrice ? Number(body.costPrice) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : 0
    });

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_PRODUCT',
      entity: 'PRODUCT',
      entityId: product.id,
      details: { name: product.name, sku: product.sku }
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

