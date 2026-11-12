'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Tag,
  ArrowRight,
  Check
} from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    discountCode,
    shippingFee,
    total,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput);
    setIsApplying(false);
    setCouponInput('');
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="bg-[#f1f3f6] min-h-[70vh] py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xs shadow-xs border border-gray-200 p-8 sm:p-12 text-center space-y-4">
          <div className="w-32 h-32 mx-auto relative opacity-90">
            <Image
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=300&q=80"
              alt="Empty Cart"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Explore our curated collection of pure Kanjeevarams, festive suits, and heritage jewellery.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-[#13293D] hover:bg-[#0B1522] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-sm uppercase tracking-wider shadow-sm transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Savings calculation
  const totalOriginalMRP = items.reduce((acc, it) => {
    const orig = it.compareAtPrice || it.price;
    return acc + orig * it.quantity;
  }, 0);
  const totalSavings = (totalOriginalMRP - subtotal) + discount;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Responsive 2-Column Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* LEFT COLUMN: Cart Items & Deliver To Header (8 Columns) */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* Deliver To Pincode Bar */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200 p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500">Deliver to: </span>
                <span className="font-bold text-gray-900">Bengaluru - 560001</span>
              </div>
              <button className="text-[#13293D] font-bold border border-slate-300 px-3 py-1 rounded-sm hover:bg-slate-100 uppercase text-[11px] transition">
                Change
              </button>
            </div>

            {/* Cart Items List */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200 divide-y divide-slate-100">
              {items.map(item => {
                const itemPrice = item.price;
                const comparePrice = item.compareAtPrice;
                const discountPct = calculateDiscountPercentage(itemPrice, comparePrice);

                return (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail & Quantity Selector */}
                    <div className="flex sm:flex-col items-center gap-3 shrink-0">
                      <div className="relative w-20 h-24 sm:w-24 sm:h-30 rounded-sm overflow-hidden border border-slate-200 bg-slate-50">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 font-bold text-gray-700 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold border border-slate-200 py-1 rounded-sm bg-slate-50">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 font-bold text-gray-700 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="text-sm sm:text-base font-semibold text-gray-900 hover:text-[#13293D] line-clamp-2 leading-snug transition"
                      >
                        {item.productName}
                      </Link>

                      {item.variantTitle && (
                        <p className="text-xs text-gray-500 font-medium">
                          Variant: <span className="font-bold text-gray-800">{item.variantTitle}</span>
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Seller: Virasat Heritage</span>
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-sm">
                          Silk Mark Certified ✓
                        </span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatCurrency(itemPrice)}
                        </span>
                        {comparePrice && comparePrice > itemPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(comparePrice)}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span className="text-xs font-bold text-emerald-600">
                            {discountPct}% Off
                          </span>
                        )}
                      </div>

                      {/* Delivery estimate */}
                      <p className="text-xs text-gray-500">
                        Delivery in 3 - 4 days | <span className="text-emerald-700 font-semibold">Free</span>
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center gap-6 pt-3 text-xs font-bold text-gray-700">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="hover:text-red-600 uppercase flex items-center gap-1 cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="hover:text-[#13293D] uppercase cursor-pointer transition"
                        >
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Sticky Place Order Strip */}
              <div className="p-4 bg-white flex items-center justify-end border-t border-slate-100 sticky bottom-0 z-20 shadow-lg">
                <Link
                  href="/checkout"
                  className="bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold py-3 px-8 rounded-sm uppercase tracking-wider text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Price Details Card (4 Columns) */}
          <div className="lg:col-span-4 space-y-3">
            
            <div className="bg-white rounded-md shadow-xs border border-slate-200">
              <div className="p-3.5 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Price Details
                </h3>
              </div>

              <div className="p-4 space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Coupon Discount ({discountCode})</span>
                    <span className="font-semibold">− {formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-700 font-bold">
                    {shippingFee === 0 ? (
                      <>
                        <span className="line-through text-slate-400 mr-1">₹40</span> FREE
                      </>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-sm sm:text-base font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="p-2.5 bg-emerald-50 rounded-sm text-emerald-800 text-xs font-bold text-center border border-emerald-200">
                    You will save {formatCurrency(totalSavings)} on this order!
                  </div>
                )}
              </div>
            </div>

            {/* Promo Coupon Box */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200 p-3.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#13293D]" />
                <span>Apply Coupon Code</span>
              </h4>

              {discountCode ? (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-sm text-xs">
                  <div>
                    <span className="font-bold text-[#13293D]">{discountCode}</span>
                    <span className="text-emerald-700 font-bold ml-2">Applied!</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. VIRASAT10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs border border-slate-300 rounded-sm p-2 uppercase focus:outline-none focus:border-[#13293D] font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="bg-[#13293D] text-white text-xs font-bold px-4 py-2 rounded-sm uppercase tracking-wider hover:bg-[#0B1522] transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              <p className="text-[11px] text-slate-400 mt-2">
                Try codes: <strong>VIRASAT10</strong> or <strong>FESTIVE15</strong>
              </p>
            </div>

            {/* Safe & Secure Trust Note */}
            <div className="p-3 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-slate-400 shrink-0" />
              <span>Safe and Secure Payments. 100% Authentic products. Easy returns.</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
