'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  title?: string;
  subtitle?: string;
  categories: Category[];
}

export default function CategoryGrid({
  title = 'Shop Handloom Categories',
  subtitle = 'Discover ancient Indian weaving traditions from heritage clusters',
  categories
}: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;

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
            href="/categories"
            className="bg-[#13293D] hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs uppercase tracking-wider shrink-0 transition"
          >
            View All
          </Link>
        </div>

        {/* Distinctive Category Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.slice(0, 6).map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center p-3.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:shadow-card-hover transition-all text-center bg-slate-50/60 hover:bg-white"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-2.5 bg-slate-200 border-2 border-slate-200 group-hover:border-amber-500 group-hover:scale-105 transition-all">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                  alt={cat.name}
                  fill
                  sizes="120px"
                  className="object-cover object-center"
                />
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-800 transition line-clamp-1">
                {cat.name}
              </h3>
              
              <span className="text-[11px] font-semibold text-emerald-700 mt-1">
                {idx % 2 === 0 ? 'Silk Mark Certified' : 'Handloom Weave'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
