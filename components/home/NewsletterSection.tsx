'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

interface NewsletterContent {
  buttonText?: string;
  placeholder?: string;
  disclaimer?: string;
}

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  content: NewsletterContent;
}

export default function NewsletterSection({
  title = 'Join The Virasat Connoisseurs Club',
  subtitle = 'Subscribe for secret festive discount codes, private bridal previews, and rare artisan loom drops.',
  content
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 my-3.5">
      <div className="bg-[#13293D] rounded-xl text-white p-6 sm:p-10 text-center shadow-md border border-slate-700/60">
        <div className="max-w-xl mx-auto space-y-3.5">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-amber-400">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {subtitle}
            </p>
          )}

          {submitted ? (
            <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs sm:text-sm font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Thank you! Your 15% discount coupon code has been sent.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={content.placeholder || 'Enter your email address'}
                className="flex-1 px-4 py-2.5 text-sm text-slate-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-lg text-xs sm:text-sm uppercase tracking-wider transition shrink-0 cursor-pointer shadow-md"
              >
                {content.buttonText || 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
