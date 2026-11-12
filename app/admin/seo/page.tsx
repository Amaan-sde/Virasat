'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Save,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  FileCode,
  Globe
} from 'lucide-react';
import { StoreSettings } from '@/types';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminSEOPage() {
  const { success, error } = useToast();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [seoMetaTitle, setSeoMetaTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.settings) {
          setSettings(data.settings);
          setSeoMetaTitle(data.settings.seoMetaTitle || '');
          setSeoMetaDescription(data.settings.seoMetaDescription || '');
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seoMetaTitle,
          seoMetaDescription
        })
      });

      if (res.ok) {
        success('SEO Meta tags saved! Search engine robots will index updated tags.');
      } else {
        error('Failed to save SEO settings');
      }
    } catch {
      error('Server connection error');
    }
    setSaving(false);
  };

  const titleLength = seoMetaTitle.length;
  const descLength = seoMetaDescription.length;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Search Engine Optimization (SEO)
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Optimize organic discovery across Google, Bing, and social sharing OpenGraph crawlers.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Meta Settings'}</span>
        </button>
      </div>

      {/* Google SERP Snippet Preview */}
      <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
        <h3 className="font-serif text-sm font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Live Google Search Result Preview</span>
        </h3>

        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1 max-w-xl">
          <p className="text-[11px] text-stone-400 font-mono">
            https://virasatheritage.com
          </p>
          <h4 className="text-sm font-medium text-blue-400 hover:underline cursor-pointer line-clamp-1">
            {seoMetaTitle || 'VIRASAT | Imperial Handlooms & Heritage Jewels'}
          </h4>
          <p className="text-xs text-stone-300 font-light line-clamp-2">
            {seoMetaDescription || 'Discover authentic Kanjeevaram silks, Banarasi brocades, royal bridal lehengas, and handcrafted temple jewellery.'}
          </p>
        </div>
      </div>

      {/* Meta Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-6 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="uppercase tracking-wider text-stone-300 font-medium">
              Global Homepage Title
            </label>
            <span
              className={`font-mono text-[11px] ${
                titleLength > 60 ? 'text-amber-400 font-semibold' : 'text-stone-500'
              }`}
            >
              {titleLength} / 60 Recommended Characters
            </span>
          </div>
          <input
            type="text"
            required
            value={seoMetaTitle}
            onChange={e => setSeoMetaTitle(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="uppercase tracking-wider text-stone-300 font-medium">
              Global Meta Description
            </label>
            <span
              className={`font-mono text-[11px] ${
                descLength > 160 ? 'text-amber-400 font-semibold' : 'text-stone-500'
              }`}
            >
              {descLength} / 160 Recommended Characters
            </span>
          </div>
          <textarea
            rows={4}
            required
            value={seoMetaDescription}
            onChange={e => setSeoMetaDescription(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </form>

      {/* Technical SEO Status Indicators */}
      <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4 text-xs">
        <h3 className="font-serif text-base font-bold text-amber-200 border-b border-stone-800 pb-2">
          Technical Crawlability & Structured Data Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-100">XML Sitemap</p>
              <p className="text-[11px] text-stone-400">Dynamic sitemap with all published pieces</p>
            </div>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-medium flex items-center gap-1"
            >
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-100">Robots.txt Directive</p>
              <p className="text-[11px] text-stone-400">Configured to protect admin & index public routes</p>
            </div>
            <Link
              href="/robots.txt"
              target="_blank"
              className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-medium flex items-center gap-1"
            >
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-stone-100">Schema JSON-LD Markup</p>
              <p className="text-[11px] text-stone-400">Organization, WebSite, Product & BreadcrumbList schemas active</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-stone-100">OpenGraph & Twitter Cards</p>
              <p className="text-[11px] text-stone-400">Rich snippet sharing preview enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

