import { NextRequest, NextResponse } from 'next/server';
import { getReviews, createReview } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = await getReviews(productId);
    return NextResponse.json({ reviews });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, rating, title, comment, customerName } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Product ID, rating, and comment are required' }, { status: 400 });
    }

    const authUser = getUserFromRequest(req);
    const name = customerName || authUser?.name || 'Artisan Patron';

    const review = await createReview({
      productId,
      customerId: authUser?.userId,
      customerName: name,
      rating: Math.min(5, Math.max(1, Number(rating))),
      title,
      comment,
      isVerifiedPurchase: true
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

