'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Menu as MenuIcon,
  Ticket,
  Search,
  Settings,
  Users,
  FileText,
  Activity,
  LogOut,
  ExternalLink,
  Shield,
  ChevronRight,
  X,
  Sparkles,
  Palette
} from 'lucide-react';
import { UserRole } from '@/types';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        if (!data?.user || (data.user.role !== 'DEVELOPER' && data.user.role !== 'CLIENT')) {
          router.push('/login');
          return;
        }
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-xs text-amber-300 uppercase tracking-widest animate-pulse font-mono">
        Authenticating Administrative Credentials...
      </div>
    );
  }

  const isDeveloper = user?.role === 'DEVELOPER';

  // Navigation Links
  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories & Curations', href: '/admin/categories', icon: Layers },
    { label: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Visual Homepage Editor', href: '/admin/homepage-editor', icon: Palette, badge: 'Live Builder' },
    { label: 'Navigation Menus', href: '/admin/navigation', icon: MenuIcon },
    { label: 'Discount Coupons', href: '/admin/discounts', icon: Ticket },
    { label: 'Storefront SEO', href: '/admin/seo', icon: Search },
    { label: 'Business Settings', href: '/admin/settings', icon: Settings },
  ];

  // Developer-Only Technical Items
  const devItems = [
    { label: 'Admin Accounts', href: '/admin/users', icon: Users },
    { label: 'Audit Trail Logs', href: '/admin/audit-logs', icon: FileText },
    { label: 'System Diagnostics', href: '/admin/diagnostics', icon: Activity },
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full bg-stone-950 border-r border-stone-800 text-stone-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-stone-950 font-serif font-bold text-lg shadow-md">
            V
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-widest text-amber-100 block leading-none">
              VIRASAT
            </span>
            <span className="text-[9px] uppercase tracking-wider text-amber-400/80 font-mono block mt-0.5">
              Control Panel
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden text-stone-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Badge */}
      <div className="px-5 py-3 bg-stone-900/60 border-b border-stone-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-stone-300 font-medium">{user?.name.split(' ')[0]}</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            isDeveloper
              ? 'bg-purple-950 text-purple-300 border border-purple-800'
              : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}
        >
          {isDeveloper ? 'Super Admin' : 'Store Owner'}
        </span>
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-2">
            Store Management
          </p>
          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-amber-950/60 text-amber-300 font-semibold border border-amber-800/60 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 text-amber-400/80" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-600/30 text-amber-300 border border-amber-700/50 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Developer Only Section */}
        {isDeveloper && (
          <div>
            <p className="px-3 text-[10px] uppercase tracking-widest text-purple-400 font-semibold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Developer & System</span>
            </p>
            <div className="space-y-1">
              {devItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-purple-950/60 text-purple-300 font-semibold border border-purple-800/60 shadow-sm'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-purple-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-stone-800 bg-stone-950 space-y-2 text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-200 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>View Live Storefront</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-950/20 transition text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-xs h-full z-10">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-stone-950/80 backdrop-blur border-b border-stone-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded text-stone-400 hover:text-white hover:bg-stone-900"
              aria-label="Open sidebar"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-200 truncate">
              {pathname === '/admin' ? 'Business Overview' : pathname.replace('/admin/', '').replace(/-/g, ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium px-3 py-1.5 rounded-lg border border-amber-800/40 hover:border-amber-700 bg-amber-950/20 transition"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-xs font-bold text-amber-300">
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

