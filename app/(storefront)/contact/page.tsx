'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContext';

export default function ContactPage() {
  const { success } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    success('Your inquiry has been received. Our team will contact you within 24 hours.');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4">
        
        {/* Header */}
        <div className="bg-white rounded-md shadow-xs border border-slate-200 p-6 sm:p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <span className="text-xs font-bold text-[#13293D] uppercase tracking-wider">
              HELP & SUPPORT
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Contact Customer Support
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Have questions about your order, delivery, or returns? We&apos;re here to help you 24x7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#13293D] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Phone Support</h4>
                    <p className="text-slate-600">1800 208 9898 (Toll Free)</p>
                    <p className="text-slate-400 text-[11px]">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#13293D] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Email Support</h4>
                    <p className="text-slate-600">care@virasat.com</p>
                    <p className="text-slate-400 text-[11px]">Responses within 4-6 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#13293D] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Registered Office</h4>
                    <p className="text-slate-600">44 Palace Road, Vasanth Nagar, Bengaluru, Karnataka - 560001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry form */}
            <div>
              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-sm text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-bold text-emerald-900">Message Sent!</h3>
                  <p className="text-xs text-emerald-700">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#13293D] text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-2.5 rounded-sm uppercase tracking-wider text-xs shadow-sm transition"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
