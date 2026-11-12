'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Clock } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '../product/ProductCard';

interface BestSellersSectionProps {
  title?: string;
  subtitle?: string;
  products: Product[];
}

export default function BestSellersSection({
  title = 'Most Coveted Heritage Sarees & Weaves',
  subtitle = 'Customer-favorite pure silk handlooms and bridal editions',
  products = []
}: BestSellersSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 my-3.5">
      <div className="bg-white rounded-xl shadow-card border border-slate-200/90 p-4 sm:p-5">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200/70">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Festive Edition • Limited Pieces</span>
            </div>
          </div>

          <Link
            href="/shop?sort=popular"
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
