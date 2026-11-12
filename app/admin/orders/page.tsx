'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  ExternalLink,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminOrdersPage() {
  const { success, error } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status Update state
  const [newStatus, setNewStatus] = useState<OrderStatus>('CONFIRMED');
  const [carrier, setCarrier] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '100' });
    if (statusFilter) params.set('status', statusFilter);
    if (search) params.set('search', search);

    fetch(`/api/orders?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data?.orders) setOrders(data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openOrderDrawer = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setCarrier(order.trackingCarrier || 'BlueDart Express');
    setTrackingNumber(order.trackingNumber || '');
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          trackingCarrier: carrier,
          trackingNumber
        })
      });

      const data = await res.json();
      if (res.ok) {
        success(`Order ${selectedOrder.orderNumber} status updated to ${newStatus}!`);
        setSelectedOrder(data.order);
        setOrders(prev =>
          prev.map(o => (o.id === selectedOrder.id ? data.order : o))
        );
      } else {
        error(data.error || 'Failed to update order');
      }
    } catch {
      error('Server connection error');
    }
    setUpdating(false);
  };

  const statuses: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'RETURNED'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Order Fulfillment & Logistics
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Process incoming orders, update shipping carriers, and manage client dispatches.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition flex items-center gap-2 text-xs uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter / Search Strip */}
      <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, or Phone..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 pr-9"
          />
          <button type="submit" className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-300 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Fulfillment Statuses</option>
            {statuses.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-stone-900/40 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Order Ref</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Customer Destination</th>
                <th className="p-4">Pieces</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-stone-900/60 transition cursor-pointer" onClick={() => openOrderDrawer(order)}>
                  <td className="p-4 font-mono font-medium text-amber-300">
                    {order.orderNumber}
                  </td>
                  <td className="p-4 text-stone-400">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-stone-100 block">{order.customerName}</span>
                    <span className="text-[11px] text-stone-500 block">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                  </td>
                  <td className="p-4 text-stone-300">
                    {order.items.length} piece{order.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="p-4 font-semibold text-white">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] block font-medium uppercase text-stone-300">
                      {order.paymentMethod}
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      order.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => openOrderDrawer(order)}
                      className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium"
                    >
                      Inspect & Fulfill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-stone-950 border-l border-stone-800 p-6 overflow-y-auto space-y-6 text-stone-200 shadow-2xl">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono">
                    Order Inspection
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {selectedOrder.orderNumber}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/order-success/${selectedOrder.id}`}
                    target="_blank"
                    className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-stone-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleStatusUpdate} className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4 text-xs">
                <h4 className="font-serif text-sm font-bold text-amber-200">
                  Update Permitted Fulfillment Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 mb-1">Status Transition</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as OrderStatus)}
                      className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100"
                    >
                      {statuses.map(st => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Insured Carrier</label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={e => setCarrier(e.target.value)}
                      placeholder="BlueDart, Delhivery, DHL"
                      className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-400 mb-1">Tracking Number / AWB Code</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={e => setTrackingNumber(e.target.value)}
                      placeholder="e.g. BD-893021948"
                      className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold uppercase tracking-wider text-xs"
                  >
                    {updating ? 'Updating...' : 'Commit Status Change'}
                  </button>
                </div>
              </form>

              {/* Recipient & Destination */}
              <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2 text-xs">
                <h4 className="font-serif text-sm font-bold text-amber-200">Delivery Address</h4>
                <p className="font-semibold text-white">{selectedOrder.customerName}</p>
                <p className="text-stone-300 font-light leading-relaxed">
                  {selectedOrder.shippingAddress.addressLine1}
                  {selectedOrder.shippingAddress.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ''}
                  <br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
                <p className="text-stone-400 pt-1">
                  Phone: {selectedOrder.customerPhone} | Email: {selectedOrder.customerEmail}
                </p>
              </div>

              {/* Line Items */}
              <div className="space-y-3 text-xs">
                <h4 className="font-serif text-sm font-bold text-amber-200">Reserved Line Items</h4>
                <div className="divide-y divide-stone-800 border border-stone-800 rounded-xl overflow-hidden bg-stone-900/30">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded overflow-hidden bg-stone-950 shrink-0 border border-stone-800">
                          {item.image && (
                            <Image src={item.image} alt={item.productName} fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-stone-100">{item.productName}</p>
                          {item.variantTitle && (
                            <p className="text-[11px] text-amber-400/80">{item.variantTitle}</p>
                          )}
                          <p className="text-stone-500 font-mono text-[10px]">SKU: {item.sku} | Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-white">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Shipping</span>
                  <span>{selectedOrder.shippingFee === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>GST (5%)</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-stone-800 text-sm font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-amber-300 text-base">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

