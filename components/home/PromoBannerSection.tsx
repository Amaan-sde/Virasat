'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PromoBannerContent {
  tag?: string;
  heading: string;
  description?: string;
  btnText?: string;
  btnUrl?: string;
  imageUrl: string;
}

interface PromoBannerSectionProps {
  content: PromoBannerContent;
}

export default function PromoBannerSection({ content }: PromoBannerSectionProps) {
  if (!content || !content.heading) return null;

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 my-3.5">
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-[200px] sm:h-[260px] md:h-[300px] flex items-center shadow-md">
        {/* Banner Image */}
        <div className="absolute inset-0">
          <Image
            src={content.imageUrl || 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1600&q=85'}
            alt={content.heading}
            fill
            sizes="1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg p-6 sm:p-12 space-y-2.5 text-white">
          {content.tag && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[11px] font-black uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span>{content.tag}</span>
            </span>
          )}

          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
            {content.heading}
          </h2>

          {content.description && (
            <p className="text-slate-200 text-xs sm:text-sm line-clamp-2 drop-shadow">
              {content.description}
            </p>
          )}

          {content.btnText && content.btnUrl && (
            <div className="pt-2">
              <Link
                href={content.btnUrl}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-md uppercase tracking-wider transition"
              >
                <span>{content.btnText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
