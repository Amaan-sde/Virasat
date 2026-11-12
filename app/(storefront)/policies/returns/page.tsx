import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & Exchange Policy | Virasat Online Shopping',
  description: 'Detailed information regarding our 7-day easy returns and replacement policy.'
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 px-1">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">Returns Policy</span>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              7-Day Easy Returns & Exchange Policy
            </h1>
            <p className="text-xs text-gray-500 mt-1">Last updated: November 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">1. Return Window</h2>
              <p>
                We offer a hassle-free <strong>7-day replacement or refund</strong> policy from the date your package is delivered.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">2. Conditions for Return</h2>
              <p>
                The item must be in its original unworn, unwashed, and unstitched condition with all security tags, Silk Mark tags, and packaging intact.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">3. Free Doorstep Pickup</h2>
              <p>
                Our courier executive will pick up the package from your doorstep at zero cost. Once inspected at our fulfillment hub, refunds are credited back to your original payment method or bank account within 3-5 business days.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
