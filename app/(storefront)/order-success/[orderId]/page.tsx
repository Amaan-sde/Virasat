import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin
} from 'lucide-react';
import { getOrderById, getOrderByNumber } from '@/lib/db';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import PrintInvoiceButton from './PrintInvoiceButton';

export const metadata: Metadata = {
  title: 'Order Confirmation | Virasat Online Shopping',
  description: 'Thank you for your order. Your items are confirmed and being prepared for shipment.'
};

export const revalidate = 0;

interface OrderSuccessProps {
  params: {
    orderId: string;
  };
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  let order = await getOrderById(params.orderId);
  if (!order) {
    order = await getOrderByNumber(params.orderId);
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4">
        
        {/* Flipkart-Style Order Placed Confirmation Card */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-6 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Thank you for shopping with us, <strong>{order.customerName}</strong>! Confirmation email has been sent to <strong>{order.customerEmail}</strong>.
          </p>

          <div className="inline-flex items-center gap-2 bg-slate-100 text-[#13293D] font-bold text-xs px-3 py-1 rounded-sm">
            <span>Order ID: {order.orderNumber}</span>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-md shadow-xs border border-slate-200 divide-y divide-slate-100">
          
          {/* Header row with Print Invoice button */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Delivery Address</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-xs text-slate-500">Phone: +91 {order.customerPhone}</p>
            </div>

            <PrintInvoiceButton order={order} />
          </div>

          {/* Items breakdown */}
          <div className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ordered Items ({order.items.length})
            </h3>
            <div className="divide-y divide-slate-100">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-slate-100 rounded-sm overflow-hidden shrink-0">
                      <Image
                        src={it.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                        alt={it.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{it.productName}</p>
                      <p className="text-slate-500">Qty: {it.quantity} | SKU: {it.sku}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatCurrency(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing summary */}
          <div className="p-4 bg-slate-50 space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount:</span>
                <span>− {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

        </div>

        {/* Return to shop button */}
        <div className="text-center pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#13293D] text-white font-bold text-xs px-6 py-2.5 rounded-sm uppercase tracking-wider hover:bg-[#0B1522] shadow-xs transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
