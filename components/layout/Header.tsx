'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  LogOut,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { Category, Product, StoreSettings } from '@/types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';

interface HeaderProps {
  categories?: Category[];
  settings?: StoreSettings | null;
}

export default function Header({ categories = [], settings }: HeaderProps) {
  const router = useRouter();
  const { itemCount, openCart, wishlist } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check auth
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data.products || []);
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setSearchResults([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchResults([]);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setUserDropdownOpen(false);
      router.refresh();
      window.location.href = '/';
    } catch (e) {
      console.error(e);
    }
  };

  const ribbonCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Kanjeevaram Sarees', slug: 'sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80' },
    { id: '2', name: 'Kurtas & Suits', slug: 'kurtas', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=150&q=80' },
    { id: '3', name: 'Bridal Lehengas', slug: 'lehengas', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=150&q=80' },
    { id: '4', name: 'Temple Jewellery', slug: 'jewellery', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80' },
    { id: '5', name: 'Kashmiri Shawls', slug: 'dupattas', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=150&q=80' },
    { id: '6', name: 'Men Ethnic', slug: 'men-ethnic', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-[#13293D]">
      {/* 1. Main Navigation Bar */}
      <div className="border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 md:gap-8">
          
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 text-slate-200 hover:text-white rounded-lg focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Bespoke Logo */}
          <div className="flex flex-col items-start leading-none shrink-0">
            <Link href="/" className="group flex flex-col">
              <span className="font-extrabold text-2xl sm:text-2xl tracking-wider text-white drop-shadow-sm font-sans flex items-center gap-1.5">
                <span>{settings?.storeName || 'VIRASAT'}</span>
                <span className="text-amber-400 font-normal text-xs uppercase tracking-widest hidden sm:inline">• LUXE</span>
              </span>
              <span className="text-[11px] font-medium text-slate-300 mt-0.5 tracking-wide">
                Handcrafted Heritage
              </span>
            </Link>
          </div>

          {/* Central Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pure silk sarees, bridal lehengas, jewellery..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 text-sm placeholder:text-slate-400 py-2.5 pl-4 pr-11 rounded-lg shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3.5 text-[#13293D] hover:text-amber-600 flex items-center justify-center transition"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Search Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div
                ref={searchDropdownRef}
                className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 shadow-2xl rounded-lg overflow-hidden z-50 text-slate-900"
              >
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>DISCOVERED WEAVES ({searchResults.length})</span>
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setSearchResults([])}
                    className="text-amber-600 hover:underline font-bold"
                  >
                    View all results &rarr;
                  </Link>
                </div>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {searchResults.map(product => {
                    const discount = calculateDiscountPercentage(product.price, product.compareAtPrice);
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => setSearchResults([])}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 transition"
                      >
                        <div className="relative w-12 h-14 bg-slate-100 rounded-md overflow-hidden shrink-0">
                          <Image
                            src={product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate hover:text-amber-600">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-slate-900">
                              {formatCurrency(product.price)}
                            </span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatCurrency(product.compareAtPrice)}
                              </span>
                            )}
                            {discount > 0 && (
                              <span className="text-xs font-bold text-emerald-700">
                                {discount}% off
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-amber-600 font-bold shrink-0 flex items-center">
                          View <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-6 shrink-0 text-white text-sm font-semibold">
            
            {/* User Account / Login Button */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 py-1.5 px-3 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-amber-400" />
                  <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                {/* Account Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-lg py-1 z-50 text-slate-800 font-normal text-sm divide-y divide-slate-100">
                    <div className="px-4 py-2.5 bg-slate-50">
                      <p className="text-xs text-slate-500">Welcome back,</p>
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-amber-600"
                      >
                        <UserIcon className="w-4 h-4 text-amber-600" />
                        <span>My Account</span>
                      </Link>
                      <Link
                        href="/account#orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-amber-600"
                      >
                        <Package className="w-4 h-4 text-amber-600" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-amber-600"
                      >
                        <Heart className="w-4 h-4 text-amber-600" />
                        <span>Wishlist ({wishlist.length})</span>
                      </Link>
                    </div>
                    {(user.role === 'CLIENT' || user.role === 'DEVELOPER') && (
                      <div className="py-1">
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 text-amber-800 font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Admin Portal</span>
                        </Link>
                      </div>
                    )}
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-600 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wider shadow-sm transition"
              >
                Sign In
              </Link>
            )}

            {/* Admin Shortcut */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition text-xs font-semibold uppercase tracking-wider"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin</span>
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition relative text-xs font-semibold uppercase tracking-wider"
            >
              <Heart className="w-4 h-4 text-amber-400" />
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-amber-500 text-slate-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center -ml-0.5">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3.5 py-1.5 rounded-lg transition relative cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Cart</span>
              {itemCount > 0 && (
                <span className="bg-amber-500 text-slate-900 text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={openCart}
              className="relative p-1.5 text-white"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6 text-amber-400" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Distinctive Category Ribbon */}
      <nav className="bg-white border-b border-slate-200 shadow-xs hidden md:block overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 py-2.5">
          {ribbonCategories.map(cat => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center min-w-[90px] transition py-1"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 group-hover:border-amber-500 shadow-xs mb-1.5 relative bg-slate-50 transition-all group-hover:scale-105 group-hover:shadow-md">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-700 text-center line-clamp-1 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}

          {/* All Collections Link */}
          <Link
            href="/shop"
            className="group flex flex-col items-center min-w-[90px] transition py-1"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shadow-xs mb-1.5 transition-all group-hover:scale-105 group-hover:bg-amber-100 font-bold text-xs">
              ALL
            </div>
            <span className="text-xs font-bold text-amber-800 text-center">
              All Creations
            </span>
          </Link>
        </div>
      </nav>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="bg-[#13293D] p-5 text-white flex items-center justify-between">
              <div>
                <p className="font-bold text-base leading-snug">
                  {user ? user.name : 'Welcome to Virasat'}
                </p>
                {!user && (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-amber-400 hover:underline font-semibold"
                  >
                    Sign In or Register &rarr;
                  </Link>
                )}
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:bg-slate-800 p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-3">
              <div className="py-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  Shop Handlooms
                </p>
                {ribbonCategories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
                  >
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>

              <div className="py-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  My Profile
                </p>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/account#orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  <Package className="w-4 h-4 text-slate-400" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>Wishlist ({wishlist.length})</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-amber-700 hover:bg-amber-50 rounded-md"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>

              {user && (
                <div className="py-2 px-3">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 py-2 text-sm text-red-600 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
