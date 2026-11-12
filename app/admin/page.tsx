'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Plus,
  Palette,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Order } from '@/types';

interface DashboardStats {
  totalOrders: number;
  grossRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  recentOrders: Order[];
  statusBreakdown: Record<string, number>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data?.stats) setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="py-20 text-center text-xs text-stone-400 uppercase tracking-widest animate-pulse font-mono">
        Aggregating Recorded Financial & Catalogue Data...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Operations Hub</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome to Virasat Store Management
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
            Manage your master handloom catalogue, track customer orders, curate homepage showcases, and monitor verified revenue metrics in real-time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/homepage-editor"
            className="px-4 py-2.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-medium uppercase tracking-wider transition flex items-center gap-2"
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Visual Homepage Editor</span>
          </Link>
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Paid Revenue */}
        <div className="p-5 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase tracking-wider font-medium">Verified Paid Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-300">
            {formatCurrency(stats?.paidRevenue || 0)}
          </div>
          <p className="text-[11px] text-stone-500">
            From settled online & delivered orders
          </p>
        </div>

        {/* Pending Revenue */}
        <div className="p-5 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase tracking-wider font-medium">Pending / COD Revenue</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">
            {formatCurrency(stats?.pendingRevenue || 0)}
          </div>
          <p className="text-[11px] text-stone-500">
            In-transit and COD settlements
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase tracking-wider font-medium">Total Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {stats?.totalOrders || 0}
          </div>
          <p className="text-[11px] text-stone-500">
            Across online gateway & COD
          </p>
        </div>

        {/* Catalogue Status */}
        <div className="p-5 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase tracking-wider font-medium">Active Catalogue</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {stats?.totalProducts || 0}
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            {stats?.lowStock ? (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {stats.lowStock} Low Stock
              </span>
            ) : (
              <span className="text-emerald-400">Stock Healthy</span>
            )}
            {stats?.outOfStock ? (
              <span className="text-red-400">• {stats.outOfStock} Out of Stock</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Orders Breakdown & Recent Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-100">Recent Customer Orders</h3>
              <p className="text-xs text-stone-400">Live feed of orders placed through storefront</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold uppercase tracking-wider"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              No recent orders recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {stats.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-stone-900/50 transition">
                      <td className="py-3 font-mono font-medium text-amber-300">
                        {order.orderNumber}
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-stone-100 block">{order.customerName}</span>
                        <span className="text-[10px] text-stone-500">{order.customerEmail}</span>
                      </td>
                      <td className="py-3 text-stone-400">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="py-3 font-semibold text-white">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders`}
                          className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Distribution & Inventory Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Status Breakdown */}
          <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-amber-100 border-b border-stone-800 pb-3">
              Fulfillment Pipeline
            </h3>
            <div className="space-y-2.5">
              {Object.entries(stats?.statusBreakdown || {}).map(([st, count]) => (
                <div key={st} className="flex items-center justify-between">
                  <span className="text-stone-400 uppercase tracking-wider text-[11px] font-medium">{st}</span>
                  <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 font-bold text-amber-300">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help Guide for Client */}
          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-3 text-xs">
            <h3 className="font-serif text-base font-bold text-amber-200">
              Client Guidance
            </h3>
            <p className="text-stone-300 font-light leading-relaxed">
              To update your homepage banner or rearrange collections, open the <strong>Visual Homepage Editor</strong>. To upload new weaves with variants, go to <strong>Products → Add Product</strong>. Changes reflect instantly on your live storefront.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

