'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  User as UserIcon,
  Package,
  Truck,
  LogOut,
  Shield,
  MapPin,
  Calendar,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Order, User } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function AccountPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          return fetch(`/api/orders?email=${encodeURIComponent(data.user.email)}`);
        }
      })
      .then(res => (res && res.ok ? res.json() : null))
      .then(data => {
        if (data?.orders) {
          setOrders(data.orders);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      success('Logged out successfully.');
      router.push('/login');
      router.refresh();
    } catch {
      error('Failed to log out.');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f1f3f6] min-h-[70vh] flex items-center justify-center">
        <p className="text-xs font-bold text-gray-500 animate-pulse">
          Loading Your Account...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* 2-Column Account Page */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Left Sidebar (4 Columns) */}
          <div className="lg:col-span-4 space-y-3">
            
            {/* User Mini Card */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200 p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#13293D] text-white flex items-center justify-center font-bold text-lg shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400">Hello,</span>
                <h2 className="text-sm font-bold text-slate-900 truncate">{user.name}</h2>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200 divide-y divide-slate-100 text-xs">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left p-3.5 flex items-center justify-between font-bold transition ${
                  activeTab === 'orders' ? 'text-[#13293D] bg-slate-100' : 'text-slate-700 hover:text-[#13293D]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#13293D]" />
                  <span>MY ORDERS</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left p-3.5 flex items-center justify-between font-bold transition ${
                  activeTab === 'profile' ? 'text-[#13293D] bg-slate-100' : 'text-slate-700 hover:text-[#13293D]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserIcon className="w-4 h-4 text-[#13293D]" />
                  <span>Profile Information</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left p-3.5 flex items-center justify-between font-bold transition ${
                  activeTab === 'addresses' ? 'text-[#13293D] bg-slate-100' : 'text-slate-700 hover:text-[#13293D]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#13293D]" />
                  <span>Manage Addresses</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {(user.role === 'CLIENT' || user.role === 'DEVELOPER') && (
                <Link
                  href="/admin"
                  className="w-full text-left p-3.5 flex items-center justify-between font-bold text-amber-700 hover:bg-amber-50 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Admin Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left p-3.5 flex items-center justify-between font-bold text-red-600 hover:bg-red-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </div>
              </button>
            </div>

          </div>

          {/* Right Main Content Card (8 Columns) */}
          <div className="lg:col-span-8 bg-white rounded-md shadow-xs border border-slate-200 p-4 sm:p-6 min-h-[480px]">
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  My Orders ({orders.length})
                </h3>

                {orders.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <p className="text-sm font-bold text-slate-700">No orders placed yet.</p>
                    <Link
                      href="/shop"
                      className="inline-block bg-[#13293D] text-white text-xs font-bold px-6 py-2 rounded-sm uppercase tracking-wider hover:bg-[#0B1522] transition"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 divide-y divide-slate-100">
                    {orders.map(order => (
                      <div key={order.id} className="pt-3 first:pt-0 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-sm">
                          <div>
                            <span className="font-bold text-slate-900">Order #{order.orderNumber}</span>
                            <span className="text-slate-500 ml-2">Placed on {formatDateTime(order.createdAt)}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {order.orderStatus}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3 py-1">
                              <div className="flex items-center gap-2.5">
                                <div className="relative w-12 h-14 bg-slate-100 rounded-sm overflow-hidden shrink-0">
                                  <Image
                                    src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 line-clamp-1">{item.productName}</p>
                                  <p className="text-slate-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-bold text-slate-900 shrink-0">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-500">Total: </span>
                            <span className="font-bold text-slate-900">{formatCurrency(order.total)}</span>
                          </div>
                          <Link
                            href={`/order-success/${order.id}`}
                            className="text-[#13293D] font-bold hover:underline"
                          >
                            View Order & Invoice &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4 max-w-lg">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Personal Information
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={user.name}
                      className="w-full p-2 border border-gray-200 rounded-xs bg-gray-50 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full p-2 border border-gray-200 rounded-xs bg-gray-50 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Mobile Number</label>
                    <input
                      type="text"
                      disabled
                      value={user.phone || '+91 9876543210'}
                      className="w-full p-2 border border-gray-200 rounded-xs bg-gray-50 text-gray-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Manage Addresses
                </h3>
                <div className="p-3.5 border border-gray-200 rounded-xs bg-gray-50/50 text-xs space-y-1">
                  <span className="font-bold text-gray-900">{user.name}</span>
                  <p className="text-gray-600">
                    Flat 402, Royal Palms Apartments, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038
                  </p>
                  <p className="text-gray-500">Phone: +91 {user.phone || '9876543210'}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
