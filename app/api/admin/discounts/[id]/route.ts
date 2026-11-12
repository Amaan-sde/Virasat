import { NextRequest, NextResponse } from 'next/server';
import { updateDiscount, deleteDiscount, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await updateDiscount(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    }

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_DISCOUNT',
      entity: 'DISCOUNT',
      entityId: params.id,
      details: { code: updated.code }
    });

    return NextResponse.json({ success: true, discount: updated });
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

    await deleteDiscount(params.id);

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'DELETE_DISCOUNT',
      entity: 'DISCOUNT',
      entityId: params.id
    });

    return NextResponse.json({ success: true, message: 'Discount deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

