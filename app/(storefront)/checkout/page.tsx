'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronRight,
  Check
} from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, discountCode, shippingFee, total, clearCart } = useCart();
  const { error, success } = useToast();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(2); // 1: Login, 2: Address, 3: Summary, 4: Payment
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: 'Aradhya Sharma',
    email: 'aradhya@example.com',
    phone: '9876543210',
    addressLine1: 'Flat 402, Royal Palms Apartments',
    addressLine2: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    paymentMethod: 'COD', // or 'ONLINE_RAZORPAY'
    notes: ''
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.user) {
          const defaultAddr = data.user.addresses?.[0];
          setFormData(prev => ({
            ...prev,
            name: data.user.name || prev.name,
            email: data.user.email || prev.email,
            phone: data.user.phone || defaultAddr?.phone || prev.phone,
            addressLine1: defaultAddr?.addressLine1 || prev.addressLine1,
            addressLine2: defaultAddr?.addressLine2 || prev.addressLine2,
            city: defaultAddr?.city || prev.city,
            state: defaultAddr?.state || prev.state,
            pincode: defaultAddr?.pincode || prev.pincode
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      error('Your cart is empty');
      router.push('/shop');
      return;
    }

    if (!formData.name || !formData.phone || !formData.addressLine1 || !formData.city || !formData.pincode) {
      error('Please complete all mandatory delivery address fields');
      setActiveStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          price: i.price,
          name: i.productName,
          sku: i.variantTitle || 'DEFAULT',
          image: i.image
        })),
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India'
        },
        paymentMethod: formData.paymentMethod,
        discountCode: discountCode || undefined,
        notes: formData.notes
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Order created successfully
      clearCart();
      success('Order placed successfully! Redirecting...');
      router.push(`/order-success/${data.order.id}`);
    } catch (err: any) {
      error(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#F8FAFC] min-h-[60vh] py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">No items to checkout</h2>
        <Link href="/shop" className="text-[#13293D] font-bold underline text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Checkout 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* LEFT COLUMN: 4-Step Accordion (8 Columns) */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* STEP 1: LOGIN */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200 p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-slate-200 text-slate-700 font-bold rounded-sm flex items-center justify-center text-[11px]">
                  1
                </span>
                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider block">
                    LOGIN
                  </span>
                  <span className="text-slate-900 font-bold">
                    {formData.name} <span className="font-normal text-slate-600">+91 {formData.phone}</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="text-[#13293D] font-bold border border-slate-300 px-3 py-1 rounded-sm uppercase text-[11px] hover:bg-slate-50 transition"
              >
                Change
              </button>
            </div>

            {/* STEP 2: DELIVERY ADDRESS */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200 overflow-hidden">
              <div className="p-3.5 bg-[#13293D] text-white flex items-center gap-3">
                <span className="w-5 h-5 bg-white text-[#13293D] font-bold rounded-sm flex items-center justify-center text-[11px]">
                  2
                </span>
                <span className="font-bold text-xs uppercase tracking-wider">
                  DELIVERY ADDRESS
                </span>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">10-Digit Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">Flat, House no., Building, Company, Apartment *</label>
                    <input
                      type="text"
                      required
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">Area, Street, Sector, Village</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-2.5 px-6 rounded-sm uppercase tracking-wider text-xs shadow-sm transition"
                  >
                    Deliver Here
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 3: ORDER SUMMARY */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200 p-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <span className="w-5 h-5 bg-slate-200 text-slate-700 font-bold rounded-sm flex items-center justify-center text-[11px]">
                  3
                </span>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  ORDER SUMMARY ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
              </div>

              <div className="divide-y divide-slate-100 pt-2">
                {items.map(it => (
                  <div key={it.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
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
                        <p className="text-slate-500">Qty: {it.quantity} {it.variantTitle && `| ${it.variantTitle}`}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatCurrency(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 4: PAYMENT OPTIONS */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200 overflow-hidden">
              <div className="p-3.5 bg-[#13293D] text-white flex items-center gap-3">
                <span className="w-5 h-5 bg-white text-[#13293D] font-bold rounded-sm flex items-center justify-center text-[11px]">
                  4
                </span>
                <span className="font-bold text-xs uppercase tracking-wider">
                  PAYMENT OPTIONS
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* Cash on Delivery Option */}
                <label
                  className={`p-3.5 rounded-sm border flex items-center justify-between cursor-pointer transition ${
                    formData.paymentMethod === 'COD'
                      ? 'border-[#13293D] bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleInputChange}
                      className="text-[#13293D] focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Pay with cash or UPI scan at your doorstep upon delivery
                      </span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-emerald-700" />
                </label>

                {/* Online Payment / Razorpay Option */}
                <label
                  className={`p-3.5 rounded-sm border flex items-center justify-between cursor-pointer transition ${
                    formData.paymentMethod === 'ONLINE_RAZORPAY'
                      ? 'border-[#13293D] bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE_RAZORPAY"
                      checked={formData.paymentMethod === 'ONLINE_RAZORPAY'}
                      onChange={handleInputChange}
                      className="text-[#13293D] focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        UPI / Credit Card / Debit Card / Netbanking
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Instant payment via Razorpay / Paytm / PhonePe (Fast & 100% Secure)
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#13293D]" />
                </label>

                {/* Confirm Order Button */}
                <div className="pt-3">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold py-3.5 px-12 rounded-sm uppercase tracking-wider text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing Order...</span>
                    ) : (
                      <>
                        <span>Confirm & Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Flipkart Price Details Card (4 Columns) */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="bg-white rounded-xs shadow-xs border border-gray-200">
              <div className="p-3.5 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price Details
                </h3>
              </div>

              <div className="p-4 space-y-3 text-xs text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Price ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-700">
                    <span>Discount ({discountCode})</span>
                    <span className="font-semibold">− {formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-700 font-bold">
                    <span className="line-through text-gray-400 mr-1">₹40</span> FREE
                  </span>
                </div>

                <div className="pt-3 border-t border-dashed border-gray-200 flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="p-3 text-xs text-gray-500 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-gray-400 shrink-0" />
              <span>Safe and Secure Payments. 100% Authentic products.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
