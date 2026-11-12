import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { OrderStatus } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get('status') as OrderStatus) || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : 0;

    // If client or developer, can view all
    if (user && (user.role === 'DEVELOPER' || user.role === 'CLIENT')) {
      const result = await getOrders({ status, search, limit, offset });
      return NextResponse.json(result);
    }

    // If regular customer, can only view their own
    if (user && user.role === 'CUSTOMER') {
      const result = await getOrders({ status, search, customerEmail: user.email, limit, offset });
      return NextResponse.json(result);
    }

    // Guest lookup by email query param if provided
    const email = searchParams.get('email');
    if (email) {
      const result = await getOrders({ customerEmail: email, limit: 10 });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

