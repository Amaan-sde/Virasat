'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '@/types';

interface AnnouncementBarProps {
  settings?: StoreSettings | null;
}

export default function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (settings && !settings.isAnnouncementVisible) return null;

  const text = settings?.announcementText || '✨ Festive Celebration: Extra 10% Off with Bank Cards | Silk Mark Certified Handlooms | Free Delivery on Orders Over ₹499';
  const link = settings?.announcementLink || '/shop';

  return (
    <div className="bg-[#0B1522] text-slate-200 text-xs py-2 px-4 transition-all border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
          {link ? (
            <Link href={link} className="hover:text-amber-300 transition font-medium flex items-center gap-1.5">
              <span>{text}</span>
              <span className="font-bold underline text-amber-400 ml-1">Explore Offers</span>
            </Link>
          ) : (
            <span>{text}</span>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-0.5 rounded transition shrink-0 ml-2"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
