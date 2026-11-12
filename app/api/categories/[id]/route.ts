import { NextRequest, NextResponse } from 'next/server';
import { updateCategory, deleteCategory, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await updateCategory(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_CATEGORY',
      entity: 'CATEGORY',
      entityId: params.id,
      details: { name: updated.name }
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    await deleteCategory(params.id);

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'DELETE_CATEGORY',
      entity: 'CATEGORY',
      entityId: params.id
    });

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

