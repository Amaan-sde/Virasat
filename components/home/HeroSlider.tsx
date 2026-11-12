'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface Slide {
  badge?: string;
  heading: string;
  subheading?: string;
  primaryBtnText?: string;
  primaryBtnUrl?: string;
  secondaryBtnText?: string;
  secondaryBtnUrl?: string;
  imageUrl: string;
  overlayOpacity?: number;
}

interface HeroSliderProps {
  content: {
    slides?: Slide[];
  };
}

export default function HeroSlider({ content }: HeroSliderProps) {
  const slides = content.slides || [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 pt-3 pb-2">
      {/* Editorial Luxury Hero Carousel */}
      <div className="relative w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-xl bg-slate-900 shadow-md border border-slate-200">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={s.imageUrl}
              alt={s.heading}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

            {/* Banner Text Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-xl text-white">
              {s.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-extrabold uppercase tracking-widest mb-2.5 w-max shadow-sm backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{s.badge}</span>
                </div>
              )}

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                {s.heading}
              </h2>

              {s.subheading && (
                <p className="text-slate-200 text-xs sm:text-sm md:text-base mt-2 line-clamp-2 drop-shadow">
                  {s.subheading}
                </p>
              )}

              <div className="flex items-center gap-3 mt-5">
                {s.primaryBtnText && s.primaryBtnUrl && (
                  <Link
                    href={s.primaryBtnUrl}
                    className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
                  >
                    <span>{s.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {s.secondaryBtnText && s.secondaryBtnUrl && (
                  <Link
                    href={s.secondaryBtnUrl}
                    className="bg-white/90 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow transition-all uppercase tracking-wider"
                  >
                    {s.secondaryBtnText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
              className="absolute z-30 left-3 top-1/2 -translate-y-1/2 w-9 h-14 bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center rounded-lg transition cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrent((current + 1) % slides.length)}
              className="absolute z-30 right-3 top-1/2 -translate-y-1/2 w-9 h-14 bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center rounded-lg transition cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute z-30 bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Trust & Bank Offer Strip */}
      <div className="mt-2.5 bg-white border border-slate-200/90 rounded-lg px-4 py-3 shadow-card flex items-center justify-between text-xs sm:text-sm text-slate-700 font-medium overflow-x-auto gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
            BANK BENEFIT
          </span>
          <span className="font-semibold text-slate-800">10% Instant Discount on HDFC & SBI Bank Cards</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-amber-700 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Certified Silk Mark Handlooms</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-slate-500 font-normal">
          <span>Free Express Shipping Across India</span>
        </div>
      </div>
    </div>
  );
}
