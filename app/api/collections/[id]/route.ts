import { NextRequest, NextResponse } from 'next/server';
import { updateCollection, deleteCollection, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await updateCollection(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_COLLECTION',
      entity: 'COLLECTION',
      entityId: params.id,
      details: { name: updated.name }
    });

    return NextResponse.json({ success: true, collection: updated });
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

    await deleteCollection(params.id);

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'DELETE_COLLECTION',
      entity: 'COLLECTION',
      entityId: params.id
    });

    return NextResponse.json({ success: true, message: 'Collection deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

