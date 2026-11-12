'use client';

import React from 'react';
import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

interface Feature {
  icon?: string;
  title: string;
  description: string;
}

interface TrustFeaturesSectionProps {
  title?: string;
  subtitle?: string;
  content: {
    features?: Feature[];
  };
}

export default function TrustFeaturesSection({
  title = 'The Virasat Hallmark',
  subtitle = 'Authenticity, artisan dignity, and customer delight in every parcel',
  content
}: TrustFeaturesSectionProps) {
  const defaultFeatures = [
    {
      icon: 'ShieldCheck',
      title: 'Silk Mark Certified',
      description: 'Tested and certified pure mulberry silk with zero synthetic blending'
    },
    {
      icon: 'RotateCcw',
      title: '7-Day Easy Exchange',
      description: 'Hassle-free doorstep exchange or return across all collections'
    },
    {
      icon: 'Truck',
      title: 'Express Insured Delivery',
      description: 'Air express shipping across 19,000+ Indian pincodes with live AWB tracking'
    },
    {
      icon: 'CreditCard',
      title: 'COD & Secure Payments',
      description: 'Pay via UPI, Cards, Netbanking or Cash on Delivery at your doorstep'
    }
  ];

  const features = content?.features && content.features.length > 0 ? content.features : defaultFeatures;

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Truck':
        return <Truck className="w-7 h-7 text-amber-600" />;
      case 'RotateCcw':
      case 'RefreshCw':
        return <RotateCcw className="w-7 h-7 text-amber-600" />;
      case 'CreditCard':
        return <CreditCard className="w-7 h-7 text-emerald-600" />;
      default:
        return <ShieldCheck className="w-7 h-7 text-[#13293D]" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 my-3.5">
      <div className="bg-white rounded-xl shadow-card border border-slate-200/90 p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {features.map((f, idx) => (
            <div key={idx} className={`flex items-center gap-4 ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}>
              <div className="p-3 rounded-full bg-slate-50 border border-slate-100 shrink-0">
                {renderIcon(f.icon)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {f.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
