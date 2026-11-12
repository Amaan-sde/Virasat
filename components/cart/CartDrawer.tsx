'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingCart, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from './CartContext';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
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

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput);
    setIsApplying(false);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white text-gray-900 flex flex-col shadow-2xl animate-fade-in">
          
          {/* Prussian Navy Header */}
          <div className="p-4 bg-[#13293D] text-white flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-base">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span>My Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            </div>
            <button
              onClick={closeCart}
              className="text-white hover:bg-[#0B1522] p-1 rounded transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery location banner */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Deliver to: <strong className="text-gray-900">560001 (Bengaluru)</strong></span>
            <span className="text-emerald-700 font-bold">Free Delivery</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-gray-800">Your Cart is empty!</p>
                <p className="text-xs text-gray-500">Explore our sarees and festive suits to add items.</p>
                <button
                  onClick={closeCart}
                  className="bg-[#13293D] hover:bg-[#0B1522] text-white text-xs font-bold px-6 py-2 rounded-sm uppercase tracking-wider transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(item => {
                const itemPrice = item.price;
                const comparePrice = item.compareAtPrice;
                const discountPct = calculateDiscountPercentage(itemPrice, comparePrice);

                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <div className="relative w-16 h-20 rounded-xs overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-gray-900 hover:text-[#13293D] line-clamp-1 transition"
                      >
                        {item.productName}
                      </Link>

                      {item.variantTitle && (
                        <p className="text-[11px] text-gray-500">
                          Variant: <strong className="text-gray-800">{item.variantTitle}</strong>
                        </p>
                      )}

                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(itemPrice)}
                        </span>
                        {comparePrice && comparePrice > itemPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {formatCurrency(comparePrice)}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span className="text-[11px] font-bold text-emerald-600">
                            {discountPct}% Off
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2 py-0.5 border border-gray-200 rounded-xs bg-gray-50">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              {/* Price summary row */}
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({discountCode}):</span>
                    <span>− {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-200">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="bg-white border border-gray-300 text-gray-800 text-center font-bold py-2.5 rounded-sm text-xs uppercase tracking-wider hover:bg-gray-50 transition"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="bg-[#D97706] hover:bg-[#B45309] text-white text-center font-bold py-2.5 rounded-sm text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1 transition"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
