'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { error, success } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      success(`Welcome back, ${data.user.name}!`);

      // Redirect based on role
      if (data.user.role === 'DEVELOPER' || data.user.role === 'CLIENT') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
      router.refresh();
    } catch {
      error('Server connection error. Please try again.');
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: 'client' | 'developer' | 'customer') => {
    if (role === 'client') {
      setEmail('client@virasat.com');
      setPassword('Client@12345');
    } else if (role === 'developer') {
      setEmail('developer@virasat.com');
      setPassword('Developer@12345');
    } else {
      setEmail('aradhya@example.com');
      setPassword('Customer@12345');
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[85vh] flex items-center justify-center py-10 px-4">
      {/* Bespoke Split Login Card */}
      <div className="max-w-3xl w-full bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-5">
        
        {/* Left Navy Info Column (2 Columns) */}
        <div className="md:col-span-2 bg-[#13293D] text-white p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Access your Orders, Wishlist, Tailored Recommendations and Weaver Community Perks.
            </p>
          </div>

          <div className="hidden md:block pt-12">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto text-amber-400 font-extrabold text-3xl">
              ✨
            </div>
          </div>
        </div>

        {/* Right Form Column (3 Columns) */}
        <div className="md:col-span-3 p-6 sm:p-10 space-y-5">
          {/* Quick Demo Login Shortcuts */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1.5">
            <p className="text-[11px] font-bold text-[#13293D] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>One-Click Test Login:</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAccount('client')}
                className="py-1 px-2 bg-white text-slate-800 hover:text-[#13293D] hover:border-[#13293D] border border-slate-300 rounded-sm font-semibold text-[11px] text-center transition"
              >
                Store Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('developer')}
                className="py-1 px-2 bg-white text-slate-800 hover:text-[#13293D] hover:border-[#13293D] border border-slate-300 rounded-sm font-semibold text-[11px] text-center transition"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('customer')}
                className="py-1 px-2 bg-white text-slate-800 hover:text-[#13293D] hover:border-[#13293D] border border-slate-300 rounded-sm font-semibold text-[11px] text-center transition"
              >
                Customer
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Enter Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. client@virasat.com"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Enter Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900 text-xs"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              By continuing, you agree to Virasat&apos;s{' '}
              <Link href="/policies/terms" className="text-[#D97706] hover:underline">
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link href="/policies/privacy" className="text-[#D97706] hover:underline">
                Privacy Policy
              </Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-3 rounded-sm uppercase tracking-wider text-xs shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs">
            <Link
              href="/register"
              className="text-[#13293D] font-bold hover:underline"
            >
              New to Virasat? Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
