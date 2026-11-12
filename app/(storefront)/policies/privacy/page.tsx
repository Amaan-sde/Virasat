import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Virasat Online Shopping',
  description: 'Learn how Virasat protects and respects your personal information and transaction security.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 px-1">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">Privacy Policy</span>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Privacy & Security Policy
            </h1>
            <p className="text-xs text-gray-500 mt-1">Last updated: November 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">1. Information We Collect</h2>
              <p>
                We only collect information required to fulfill your order and provide an optimal shopping experience: name, shipping address, telephone number, and email.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">2. Payment Security</h2>
              <p>
                All financial transactions are encrypted using 256-bit SSL technology. Card details and banking credentials are never stored on our servers.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">3. Zero Data Sharing</h2>
              <p>
                We never sell, rent, or trade your personal data with third-party advertising companies. Your details are strictly used for order fulfillment and courier tracking.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
