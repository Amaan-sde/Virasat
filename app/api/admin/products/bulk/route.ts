import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, deleteProduct, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { action, productIds, data } = await req.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No products selected' }, { status: 400 });
    }

    let affectedCount = 0;

    for (const id of productIds) {
      if (action === 'PUBLISH') {
        await updateProduct(id, { isPublished: true });
        affectedCount++;
      } else if (action === 'UNPUBLISH') {
        await updateProduct(id, { isPublished: false });
        affectedCount++;
      } else if (action === 'ARCHIVE') {
        await updateProduct(id, { isArchived: true, isPublished: false });
        affectedCount++;
      } else if (action === 'DELETE') {
        await deleteProduct(id);
        affectedCount++;
      } else if (action === 'UPDATE_STOCK') {
        const stock = Number(data?.stock);
        if (!isNaN(stock)) {
          await updateProduct(id, { stock });
          affectedCount++;
        }
      } else if (action === 'UPDATE_PRICE') {
        const price = Number(data?.price);
        if (!isNaN(price) && price > 0) {
          await updateProduct(id, { price });
          affectedCount++;
        }
      }
    }

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: `BULK_${action}`,
      entity: 'PRODUCT',
      details: { count: affectedCount, productIds }
    });

    return NextResponse.json({ success: true, count: affectedCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

