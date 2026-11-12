import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, getOrderByNumber, updateOrderStatus, updateOrderPaymentStatus, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req);
    // Find either by id or order_number
    let order = await getOrderById(params.id);
    if (!order) {
      order = await getOrderByNumber(params.id);
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Customer can only view their own order
    if (user && user.role === 'CUSTOMER' && order.customerEmail.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized to view this order' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const { orderStatus, paymentStatus, trackingCarrier, trackingNumber } = body;

    let updated = null;
    if (orderStatus) {
      updated = await updateOrderStatus(params.id, orderStatus, trackingCarrier, trackingNumber);
    }
    if (paymentStatus) {
      updated = await updateOrderPaymentStatus(params.id, paymentStatus);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_ORDER_STATUS',
      entity: 'ORDER',
      entityId: params.id,
      details: {
        orderStatus,
        paymentStatus,
        trackingCarrier,
        trackingNumber
      }
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

