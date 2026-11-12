'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface BrandStoryContent {
  leadText?: string;
  bodyText?: string;
  stat1Number?: string;
  stat1Label?: string;
  stat2Number?: string;
  stat2Label?: string;
  stat3Number?: string;
  stat3Label?: string;
  imageUrl?: string;
}

interface BrandStorySectionProps {
  title?: string;
  subtitle?: string;
  content: BrandStoryContent;
}

export default function BrandStorySection({
  title = 'Direct from Master Weaving Clusters to Your Wardrobe',
  subtitle = 'Artisanal Integrity & Hereditary Craft',
  content
}: BrandStorySectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 my-3.5">
      <div className="bg-white rounded-xl shadow-card border border-slate-200/90 p-5 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Visual Column */}
          <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
            <Image
              src={content.imageUrl || 'https://images.unsplash.com/photo-1596783049557-414df9cf6c4d?auto=format&fit=crop&w=1200&q=85'}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-center"
            />
          </div>

          {/* Narrative Column */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {subtitle}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mt-1">
                {title}
              </h2>
            </div>

            {content.leadText && (
              <p className="text-sm sm:text-base font-semibold text-slate-700 italic border-l-4 border-amber-500 pl-3">
                &ldquo;{content.leadText}&rdquo;
              </p>
            )}

            {content.bodyText && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {content.bodyText}
              </p>
            )}

            {/* Impact Statistics */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              {content.stat1Number && (
                <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                  <span className="text-lg sm:text-xl font-black text-[#13293D] block">
                    {content.stat1Number}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    {content.stat1Label || 'Weavers Supported'}
                  </span>
                </div>
              )}
              {content.stat2Number && (
                <div className="bg-amber-50/70 p-3 rounded-lg text-center border border-amber-100">
                  <span className="text-lg sm:text-xl font-black text-amber-700 block">
                    {content.stat2Number}
                  </span>
                  <span className="text-[11px] text-amber-800 font-medium block">
                    {content.stat2Label || 'Silk Mark Weaves'}
                  </span>
                </div>
              )}
              {content.stat3Number && (
                <div className="bg-emerald-50/70 p-3 rounded-lg text-center border border-emerald-100">
                  <span className="text-lg sm:text-xl font-black text-emerald-700 block">
                    {content.stat3Number}
                  </span>
                  <span className="text-[11px] text-emerald-800 font-medium block">
                    {content.stat3Label || 'Parcels Delivered'}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#13293D] hover:text-amber-600 uppercase tracking-wider"
              >
                <span>Read Full Artisan Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
