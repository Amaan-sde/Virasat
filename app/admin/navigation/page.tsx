'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu as MenuIcon,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Save,
  Check,
  ExternalLink
} from 'lucide-react';
import { NavigationMenuItem, StoreSettings } from '@/types';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminNavigationPage() {
  const { success, error } = useToast();

  const [headerNav, setHeaderNav] = useState<NavigationMenuItem[]>([]);
  const [footerNav, setFooterNav] = useState<NavigationMenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New item form
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newBadge, setNewBadge] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.settings) {
          setHeaderNav(data.settings.headerNav || []);
          setFooterNav(data.settings.footerNav || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentNav = activeTab === 'header' ? headerNav : footerNav;
  const setNav = activeTab === 'header' ? setHeaderNav : setFooterNav;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newUrl.trim()) return;

    const newItem: NavigationMenuItem = {
      id: `nav-${Date.now()}`,
      label: newLabel.trim(),
      url: newUrl.trim(),
      badge: newBadge.trim() || undefined
    };

    setNav([...currentNav, newItem]);
    setNewLabel('');
    setNewUrl('');
    setNewBadge('');
  };

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const target = direction === 'UP' ? index - 1 : index + 1;
    if (target < 0 || target >= currentNav.length) return;

    const updated = [...currentNav];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setNav(updated);
  };

  const handleRemove = (id: string) => {
    setNav(currentNav.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerNav,
          footerNav
        })
      });

      if (res.ok) {
        success('Navigation structure updated and live!');
      } else {
        error('Failed to save navigation menus');
      }
    } catch {
      error('Server connection error');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Navigation Menu Editor
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure links, labels, and promotional badges across header and footer.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing...' : 'Save & Publish Menu'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-800 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('header')}
          className={`pb-3 px-4 border-b-2 transition ${
            activeTab === 'header'
              ? 'border-amber-400 text-amber-200'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Header Navigation Links ({headerNav.length})
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`pb-3 px-4 border-b-2 transition ${
            activeTab === 'footer'
              ? 'border-amber-400 text-amber-200'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Footer Directory Links ({footerNav.length})
        </button>
      </div>

      {/* Add New Link Card */}
      <form onSubmit={handleAddItem} className="p-5 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-4 text-xs">
        <h3 className="font-serif text-base font-bold text-amber-200">
          Add Navigation Link
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-stone-400 mb-1">Display Label *</label>
            <input
              type="text"
              required
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="e.g. Royal Silk Sarees"
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100"
            />
          </div>
          <div>
            <label className="block text-stone-400 mb-1">Destination URL *</label>
            <input
              type="text"
              required
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="/categories/sarees"
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100 font-mono"
            />
          </div>
          <div>
            <label className="block text-stone-400 mb-1">Highlight Badge (Optional)</label>
            <input
              type="text"
              value={newBadge}
              onChange={e => setNewBadge(e.target.value)}
              placeholder="New, Hot, Festive"
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold uppercase tracking-wider text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>
      </form>

      {/* Reorderable List */}
      <div className="rounded-2xl bg-stone-900/30 border border-stone-800 divide-y divide-stone-800 text-xs">
        {currentNav.map((item, idx) => (
          <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-stone-900/50 transition">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-[10px] text-amber-400 font-mono">
                {idx + 1}
              </span>
              <div>
                <span className="font-serif text-sm font-semibold text-stone-100">{item.label}</span>
                <span className="font-mono text-stone-500 text-[11px] ml-2">{item.url}</span>
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-600/30 text-amber-300 border border-amber-700/50 text-[9px] font-bold uppercase">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => handleMove(idx, 'UP')}
                className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-20"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === currentNav.length - 1}
                onClick={() => handleMove(idx, 'DOWN')}
                className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-20"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="p-1.5 rounded hover:bg-red-950/40 text-stone-500 hover:text-red-400"
                title="Remove Link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

