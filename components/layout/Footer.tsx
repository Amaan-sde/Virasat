'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  HelpCircle,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Sparkles
} from 'lucide-react';
import { StoreSettings } from '@/types';

interface FooterProps {
  settings?: StoreSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#0B1522] text-slate-300 text-xs mt-10 border-t border-slate-800">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-10 border-b border-slate-800">
          
          {/* Column 1: ABOUT */}
          <div>
            <h4 className="text-amber-400 font-bold tracking-wider uppercase mb-3 text-[11px]">
              ABOUT VIRASAT
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Our Artisan Mission
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Silk Mark Guarantee
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  Weaver Clusters
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition text-amber-400 font-semibold">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: HERITAGE COLLECTIONS */}
          <div>
            <h4 className="text-amber-400 font-bold tracking-wider uppercase mb-3 text-[11px]">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/categories/sarees" className="hover:text-white transition">
                  Kanjeevaram Silk
                </Link>
              </li>
              <li>
                <Link href="/categories/sarees" className="hover:text-white transition">
                  Kadwa Banarasi
                </Link>
              </li>
              <li>
                <Link href="/categories/lehengas" className="hover:text-white transition">
                  Royal Bridal Lehengas
                </Link>
              </li>
              <li>
                <Link href="/categories/kurtas" className="hover:text-white transition">
                  Chanderi & Bagru Suits
                </Link>
              </li>
              <li>
                <Link href="/categories/jewellery" className="hover:text-white transition">
                  22K Temple Jewellery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: HELP & SUPPORT */}
          <div>
            <h4 className="text-amber-400 font-bold tracking-wider uppercase mb-3 text-[11px]">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Payments & COD Options
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition">
                  Insured Air Shipping
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-white transition">
                  7-Day Easy Exchange
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Size Guide & FAQs
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: POLICIES */}
          <div>
            <h4 className="text-amber-400 font-bold tracking-wider uppercase mb-3 text-[11px]">
              POLICIES
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/policies/returns" className="hover:text-white transition">
                  Exchange & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-white transition">
                  Privacy & Data Protection
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white transition">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Mail Us */}
          <div className="border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-6 col-span-2 md:col-span-1">
            <h4 className="text-amber-400 font-bold tracking-wider uppercase mb-3 text-[11px]">
              Customer Care:
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {settings?.storeName || 'Virasat Heritage Ltd.'},<br />
              {settings?.storeAddress || '44 Palace Road, Vasanth Nagar'},<br />
              Bengaluru, 560001, Karnataka, India.<br />
              <span className="text-amber-400 font-semibold block mt-2">
                {settings?.contactEmail || 'care@virasat.com'}
              </span>
            </p>
          </div>

          {/* Column 6: Registered Office */}
          <div className="border-t lg:border-t-0 border-slate-800 pt-6 lg:pt-0 col-span-2 md:col-span-1">
            <h4 className="text-amber-400 font-bold tracking-wider uppercase mb-3 text-[11px]">
              Registered Office:
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              CIN: U51109KA2026PTC066107<br />
              Telephone: <span className="text-white font-semibold">{settings?.contactPhone || '1800 208 9898'}</span><br />
              GSTIN: 29AABCU9603R1ZM
            </p>
          </div>

        </div>

        {/* Bottom Bar: Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/admin" className="flex items-center gap-1.5 hover:text-white transition">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Management</span>
            </Link>
            <Link href="/faq" className="flex items-center gap-1.5 hover:text-white transition">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Help Center</span>
            </Link>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine Silk Mark Certified</span>
            </div>
          </div>

          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} {settings?.storeName || 'Virasat'}. Handcrafted in India.
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800/80 rounded text-[10px] text-slate-300 font-semibold border border-slate-700">VISA</span>
            <span className="px-2 py-0.5 bg-slate-800/80 rounded text-[10px] text-slate-300 font-semibold border border-slate-700">MasterCard</span>
            <span className="px-2 py-0.5 bg-slate-800/80 rounded text-[10px] text-slate-300 font-semibold border border-slate-700">RuPay</span>
            <span className="px-2 py-0.5 bg-slate-800/80 rounded text-[10px] text-slate-300 font-semibold border border-slate-700">UPI</span>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[10px] font-bold border border-emerald-800">COD Available</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
