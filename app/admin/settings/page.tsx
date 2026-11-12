'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Shield,
  Truck,
  CreditCard,
  Building,
  Bell,
  Lock,
  Sparkles
} from 'lucide-react';
import { StoreSettings, UserRole } from '@/types';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminSettingsPage() {
  const { success, error } = useToast();

  const [role, setRole] = useState<UserRole>('CLIENT');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [storeName, setStoreName] = useState('VIRASAT');
  const [tagline, setTagline] = useState('Imperial Handlooms & Heritage Jewels');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementLink, setAnnouncementLink] = useState('');
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [taxRate, setTaxRate] = useState('5');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('1999');
  const [standardShippingFee, setStandardShippingFee] = useState('99');
  const [codEnabled, setCodEnabled] = useState(true);
  const [contactEmail, setContactEmail] = useState('care@virasatheritage.com');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [storeAddress, setStoreAddress] = useState('Heritage Manor, 44 Palace Road, Bengaluru, India');

  // Developer sensitive
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [paymentGatewayConfigured, setPaymentGatewayConfigured] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.settings) {
          const s: StoreSettings = data.settings;
          setStoreName(s.storeName);
          setTagline(s.tagline);
          setAnnouncementText(s.announcementText);
          setAnnouncementLink(s.announcementLink || '');
          setIsAnnouncementVisible(s.isAnnouncementVisible);
          setTaxRate(String(s.taxRate));
          setFreeShippingThreshold(String(s.freeShippingThreshold));
          setStandardShippingFee(String(s.standardShippingFee));
          setCodEnabled(s.codEnabled);
          setContactEmail(s.contactEmail);
          setContactPhone(s.contactPhone);
          setStoreAddress(s.storeAddress);
          setPaymentGatewayConfigured(s.paymentGatewayConfigured);
          setRazorpayKeyId(s.razorpayKeyId || '');
          setRole(data.role || 'CLIENT');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: any = {
        storeName: storeName.trim(),
        tagline: tagline.trim(),
        announcementText: announcementText.trim(),
        announcementLink: announcementLink.trim(),
        isAnnouncementVisible,
        taxRate: Number(taxRate),
        freeShippingThreshold: Number(freeShippingThreshold),
        standardShippingFee: Number(standardShippingFee),
        codEnabled,
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        storeAddress: storeAddress.trim()
      };

      if (role === 'DEVELOPER') {
        payload.paymentGatewayConfigured = paymentGatewayConfigured;
        payload.razorpayKeyId = razorpayKeyId.trim();
      }

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        success('Store settings saved and applied to storefront!');
      } else {
        error('Failed to save settings');
      }
    } catch {
      error('Server connection error');
    }
    setSaving(false);
  };

  const isDeveloper = role === 'DEVELOPER';

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Business & Store Configuration
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure business identity, shipping rules, taxation, and announcement bar.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* Announcement Bar Settings */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Announcement Bar Strip</span>
            </h3>
            <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnnouncementVisible}
                onChange={e => setIsAnnouncementVisible(e.target.checked)}
                className="rounded bg-stone-950 border-stone-800 text-amber-600 focus:ring-0"
              />
              <span className="font-medium">Show Announcement Bar</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
                placeholder="e.g. Complimentary Silk Potli with orders above ₹4,999"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                Click Destination Link
              </label>
              <input
                type="text"
                value={announcementLink}
                onChange={e => setAnnouncementLink(e.target.value)}
                placeholder="/shop or /collections/festive-edit"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Business Identity */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-base font-bold text-amber-200 border-b border-stone-800 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span>Store Identity & Legal Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                Store Brand Name
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                Concierge Contact Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                Customer Care Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                Official Atelier / Registered Address
              </label>
              <input
                type="text"
                value={storeAddress}
                onChange={e => setStoreAddress(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Commerce Rules */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-base font-bold text-amber-200 border-b border-stone-800 pb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Shipping & Checkout Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={e => setFreeShippingThreshold(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 font-mono"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">Orders equal or above this get free delivery</span>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={standardShippingFee}
                onChange={e => setStandardShippingFee(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 font-mono"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">Applied to orders below threshold</span>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                GST Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 font-mono"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">Standard Indian handloom GST (5%)</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={e => setCodEnabled(e.target.checked)}
                className="rounded bg-stone-950 border-stone-800 text-amber-600 focus:ring-0"
              />
              <span className="font-medium">Enable Cash on Delivery (COD) on Checkout</span>
            </label>
          </div>
        </div>

        {/* Developer Sensitive Infrastructure */}
        {isDeveloper ? (
          <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
              <h3 className="font-serif text-base font-bold text-purple-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>Super Admin / Developer Security & Gateways</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-900 text-purple-200">
                Authorized Developer Only
              </span>
            </div>

            <p className="text-stone-300 font-light">
              Configure production Indian payment gateway integration. Client store admins cannot see or modify these keys.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={e => setRazorpayKeyId(e.target.value)}
                  placeholder="rzp_live_••••••••"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentGatewayConfigured}
                    onChange={e => setPaymentGatewayConfigured(e.target.checked)}
                    className="rounded bg-stone-950 border-stone-800 text-purple-600 focus:ring-0"
                  />
                  <span>Mark Gateway as Live & Active</span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 text-xs text-stone-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Infrastructure secrets & private payment credentials are managed securely by the platform developer.</span>
          </div>
        )}
      </form>
    </div>
  );
}

