import { NextRequest, NextResponse } from 'next/server';
import {
  getProductById,
  getDiscountByCode,
  createOrder,
  getStoreSettings,
  createAuditLog
} from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';
import { OrderItem, PaymentMethod } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      items,
      discountCode,
      paymentMethod,
      notes
    } = body;

    // Validation
    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: 'Customer name, email, and phone are required' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.pincode) {
      return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    const settings = await getStoreSettings();

    // Server-side price and stock validation
    const validatedItems: OrderItem[] = [];
    let serverSubtotal = 0;

    for (const rawItem of items) {
      const product = await getProductById(rawItem.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${rawItem.productName || rawItem.productId}` }, { status: 400 });
      }

      if (product.isArchived || !product.isPublished) {
        return NextResponse.json({ error: `Product "${product.name}" is not currently available` }, { status: 400 });
      }

      let price = product.price;
      let sku = product.sku;
      let availableStock = product.stock;
      let variantTitle = undefined;

      if (rawItem.variantId) {
        const variant = product.variants?.find(v => v.id === rawItem.variantId);
        if (variant) {
          price = variant.price;
          sku = variant.sku;
          availableStock = variant.stock;
          variantTitle = variant.title;
        }
      }

      const requestedQty = Math.max(1, Number(rawItem.quantity || 1));
      if (requestedQty > availableStock) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Only ${availableStock} units available.` },
          { status: 400 }
        );
      }

      const itemTotal = price * requestedQty;
      serverSubtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantId: rawItem.variantId || undefined,
        variantTitle,
        sku,
        price,
        quantity: requestedQty,
        image: product.images[0] || '',
        total: itemTotal
      });
    }

    // Validate Coupon
    let serverDiscount = 0;
    if (discountCode) {
      const coupon = await getDiscountByCode(discountCode);
      if (coupon && coupon.isActive) {
        const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt) >= new Date();
        const underLimit = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit;
        const meetsMin = !coupon.minOrderValue || serverSubtotal >= coupon.minOrderValue;

        if (notExpired && underLimit && meetsMin) {
          if (coupon.type === 'PERCENTAGE') {
            serverDiscount = Math.round((serverSubtotal * coupon.value) / 100);
            if (coupon.maxDiscount && serverDiscount > coupon.maxDiscount) {
              serverDiscount = coupon.maxDiscount;
            }
          } else {
            serverDiscount = Math.min(coupon.value, serverSubtotal);
          }
        }
      }
    }

    const discountedSubtotal = Math.max(0, serverSubtotal - serverDiscount);
    const shippingFee = serverSubtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
    const tax = Math.round((discountedSubtotal * settings.taxRate) / 100);
    const total = discountedSubtotal + shippingFee + tax;

    const validPaymentMethod: PaymentMethod =
      paymentMethod === 'ONLINE_RAZORPAY' ? 'ONLINE_RAZORPAY' : 'COD';

    // Verify COD eligibility
    if (validPaymentMethod === 'COD' && !settings.codEnabled) {
      return NextResponse.json({ error: 'Cash on Delivery is currently disabled' }, { status: 400 });
    }

    // Check if customer is authenticated
    const authUser = getUserFromRequest(req);

    const orderNumber = generateOrderNumber();

    const newOrder = await createOrder({
      orderNumber,
      customerId: authUser?.userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      items: validatedItems,
      subtotal: serverSubtotal,
      discount: serverDiscount,
      discountCode: discountCode || undefined,
      shippingFee,
      tax,
      total,
      paymentMethod: validPaymentMethod,
      paymentStatus: validPaymentMethod === 'COD' ? 'PENDING' : 'PAID', // In production, Razorpay webhook marks PAID; here online payment simulation succeeds
      orderStatus: 'CONFIRMED',
      notes
    });

    await createAuditLog({
      userId: authUser?.userId || 'GUEST',
      userName: customerName,
      userRole: authUser?.role || 'CUSTOMER',
      action: 'PLACE_ORDER',
      entity: 'ORDER',
      entityId: newOrder.id,
      details: {
        orderNumber: newOrder.orderNumber,
        total: newOrder.total,
        paymentMethod: validPaymentMethod
      }
    });

    return NextResponse.json({
      success: true,
      order: newOrder
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}

