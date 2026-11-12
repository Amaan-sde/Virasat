import { NextRequest, NextResponse } from 'next/server';
import { getDiscounts, createDiscount, createAuditLog } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || (user.role !== 'DEVELOPER' && user.role !== 'CLIENT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const discounts = await getDiscounts();
    return NextResponse.json({ discounts });
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
    if (!body.code || body.value === undefined) {
      return NextResponse.json({ error: 'Coupon code and value are required' }, { status: 400 });
    }

    const discount = await createDiscount(body);

    await createAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_DISCOUNT',
      entity: 'DISCOUNT',
      entityId: discount.id,
      details: { code: discount.code, value: discount.value }
    });

    return NextResponse.json({ success: true, discount }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

