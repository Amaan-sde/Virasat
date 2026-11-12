'use client';

import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Calendar,
  Percent,
  X
} from 'lucide-react';
import { DiscountCoupon } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminDiscountsPage() {
  const { success, error } = useToast();

  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = () => {
    setLoading(true);
    fetch('/api/admin/discounts')
      .then(res => res.json())
      .then(data => {
        if (data?.discounts) setCoupons(data.discounts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setCode('');
    setType('PERCENTAGE');
    setValue('10');
    setMinOrderValue('2999');
    setMaxDiscount('2000');
    setUsageLimit('500');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (c: DiscountCoupon) => {
    setEditingId(c.id);
    setCode(c.code);
    setType(c.type);
    setValue(String(c.value));
    setMinOrderValue(c.minOrderValue ? String(c.minOrderValue) : '');
    setMaxDiscount(c.maxDiscount ? String(c.maxDiscount) : '');
    setUsageLimit(c.usageLimit ? String(c.usageLimit) : '');
    setIsActive(c.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value) return;
    setSaving(true);

    const endpoint = editingId ? `/api/admin/discounts/${editingId}` : '/api/admin/discounts';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          type,
          value: Number(value),
          minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
          maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
          usageLimit: usageLimit ? Number(usageLimit) : undefined,
          isActive
        })
      });

      const data = await res.json();
      if (res.ok) {
        success(`Coupon ${code.toUpperCase()} saved!`);
        setModalOpen(false);
        fetchCoupons();
      } else {
        error(data.error || 'Failed to save coupon');
      }
    } catch {
      error('Server connection error');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Delete coupon "${couponCode}"?`)) return;
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        success(`Deleted coupon "${couponCode}".`);
        fetchCoupons();
      } else {
        error('Failed to delete coupon');
      }
    } catch {
      error('Server connection error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Promotional Coupons & Discounts
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure seasonal percentage codes, flat festive credits, and order thresholds.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl bg-stone-900/40 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min Order Value</th>
                <th className="p-4">Max Cap</th>
                <th className="p-4">Usage Recorded</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-stone-900/60 transition">
                  <td className="p-4 font-mono font-bold text-amber-300 text-sm">
                    {c.code}
                  </td>
                  <td className="p-4 font-semibold text-white">
                    {c.type === 'PERCENTAGE' ? `${c.value}% Off` : formatCurrency(c.value)}
                  </td>
                  <td className="p-4 text-stone-400">
                    {c.minOrderValue ? formatCurrency(c.minOrderValue) : 'No Minimum'}
                  </td>
                  <td className="p-4 text-stone-400">
                    {c.maxDiscount ? formatCurrency(c.maxDiscount) : 'No Cap'}
                  </td>
                  <td className="p-4 text-stone-300">
                    {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : 'uses'}
                  </td>
                  <td className="p-4">
                    {c.isActive ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-950 text-stone-500 border border-stone-800 uppercase">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="p-1.5 rounded hover:bg-red-950/40 text-stone-500 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-stone-950 border border-stone-800 rounded-2xl p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-xl font-bold text-amber-100">
                {editingId ? 'Edit' : 'Create'} Promotional Coupon
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE2026"
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                    Discount Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Rupee (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="10"
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={e => setMinOrderValue(e.target.value)}
                    placeholder="2999"
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                    Max Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={e => setMaxDiscount(e.target.value)}
                    placeholder="2000"
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                  Usage Limit (Total redemptions)
                </label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={e => setUsageLimit(e.target.value)}
                  placeholder="500"
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded bg-stone-900 border-stone-800 text-amber-600 focus:ring-0"
                  />
                  <span>Active & Redeemable on Checkout</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-800 text-stone-400 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

