import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use | Virasat Online Shopping',
  description: 'Understand the terms and conditions governing shopping and orders on Virasat.'
};

export default function TermsPolicyPage() {
  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 px-1">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">Terms of Use</span>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Terms of Use & Service
            </h1>
            <p className="text-xs text-gray-500 mt-1">Last updated: November 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or shopping on Virasat, you agree to comply with and be bound by these Terms of Use and all applicable laws and regulations in India.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">2. Pricing and Availability</h2>
              <p>
                All prices are listed in Indian Rupees (₹ INR) inclusive of applicable Goods and Services Tax (GST). Product availability and promotional discounts are subject to change without prior notice.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="text-sm font-bold text-gray-900">3. Authentic Handloom Notice</h2>
              <p>
                Due to the artisanal hand-weaving process, minor nuances in zari shading, selvedge thread, or motif alignment are genuine hallmarks of authentic handcraftsmanship.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
