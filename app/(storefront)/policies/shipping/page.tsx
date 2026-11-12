import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Virasat Online Shopping',
  description: 'Detailed information regarding shipping charges, delivery timeframes, tracking, and Cash on Delivery.'
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 px-1">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">Shipping Policy</span>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xs text-gray-500 mt-1">Last updated: November 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">1. Domestic Delivery (Pan-India)</h2>
              <p>
                All domestic orders qualify for <strong>FREE Delivery</strong> when the order value exceeds ₹499. For smaller orders, a nominal standard fee of ₹40 applies.
              </p>
              <p>
                Orders are dispatched within 24-48 business hours via insured courier partners including BlueDart, Delhivery, and DTDC. Metro city deliveries take 2 to 3 days; other regions take 4 to 5 days.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">2. Cash on Delivery (COD)</h2>
              <p>
                Cash on Delivery is supported across 19,000+ Indian pincodes. You can pay cash or scan the courier agent&apos;s UPI QR code upon arrival.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">3. Live AWB Tracking</h2>
              <p>
                Once your order is handed over to the courier partner, an automated SMS and email containing the AWB Tracking Number is dispatched. You can track real-time parcel status directly from your account.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
