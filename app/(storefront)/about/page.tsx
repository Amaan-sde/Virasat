import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Sparkles, HeartHandshake, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Virasat Online Shopping India',
  description: 'Learn how Virasat partners directly with 300+ hereditary master weavers and jewellery artisans across India.'
};

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4">
        {/* About Card */}
        <div className="bg-white rounded-md shadow-xs border border-slate-200 p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#13293D] uppercase tracking-wider">
              OUR MISSION & VALUES
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              About Virasat
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Virasat is India&apos;s leading online destination for authentic cultural fashion, heritage handlooms, pure silk sarees, and traditional ethnic collections. We connect customers directly with certified weaving clusters across Kanchipuram, Varanasi, Chanderi, and Kashmir.
            </p>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden bg-slate-100 border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1596783049557-414df9cf6c4d?auto=format&fit=crop&w=1200&q=85"
              alt="Artisan Weaving"
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#13293D]" />
              <h3 className="text-sm font-bold text-slate-900">100% Genuine Silk</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tested and certified pure mulberry silk with zero synthetic blending.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 space-y-2">
              <HeartHandshake className="w-6 h-6 text-[#D97706]" />
              <h3 className="text-sm font-bold text-slate-900">Direct From Weavers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fair trade compensation supporting 300+ hereditary artisan families.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 space-y-2">
              <Award className="w-6 h-6 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">Pan-India Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fast doorstep courier delivery with Cash on Delivery and easy returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
