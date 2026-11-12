'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '../product/ProductCard';

interface FeaturedCollectionSectionProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  viewAllUrl?: string;
}

export default function FeaturedCollectionSection({
  title = 'Royal Bridal & Festive Silk Curation',
  subtitle = 'Authentic Banarasi, Kanjeevaram and bridal trousseau masterpieces',
  products = [],
  viewAllUrl = '/collections/royal-bridal'
}: FeaturedCollectionSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 my-3.5">
      <div className="bg-white rounded-xl shadow-card border border-slate-200/90 p-4 sm:p-5">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={viewAllUrl || '/shop'}
            className="bg-[#13293D] hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs uppercase tracking-wider shrink-0 transition"
          >
            View All
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {products.slice(0, 8).map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
