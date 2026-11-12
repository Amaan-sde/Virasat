'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { error, success } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      success(`Welcome to Virasat, ${data.user.name}!`);
      router.push('/account');
      router.refresh();
    } catch {
      error('Server connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[85vh] flex items-center justify-center py-10 px-4">
      {/* Bespoke Split Register Card */}
      <div className="max-w-3xl w-full bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-5">
        
        {/* Left Navy Info Column */}
        <div className="md:col-span-2 bg-[#13293D] text-white p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Looks like you&apos;re new here!</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sign up with your details to start shopping handcrafted luxury on Virasat with fast delivery and authentic guarantees.
            </p>
          </div>

          <div className="hidden md:block pt-12">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto text-amber-400 font-extrabold text-3xl">
              🎁
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-3 p-6 sm:p-10 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aradhya Sharma"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mobile Phone (Optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="10-digit mobile number"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Set Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                className="w-full p-2.5 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900 text-xs"
              />
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
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
              {loading ? 'Creating Account...' : 'Continue'}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs">
            <Link
              href="/login"
              className="text-[#13293D] font-bold hover:underline"
            >
              Existing User? Log in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
