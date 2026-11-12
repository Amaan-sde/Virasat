import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyVisible = searchParams.get('all') !== 'true';
    const categories = await getCategories(onlyVisible);
    return NextResponse.json({ categories });
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
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    const category = await createCategory({
      name: body.name,
      slug,
      description: body.description,
      image: body.image,
      displayOrder: Number(body.displayOrder || 0),
      isVisible: body.isVisible !== undefined ? body.isVisible : true,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription
    });

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_CATEGORY',
      entity: 'CATEGORY',
      entityId: category.id,
      details: { name: category.name }
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

