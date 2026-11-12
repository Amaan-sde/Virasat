'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ChevronRight } from 'lucide-react';

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: 'Shipping & Delivery',
      question: 'How long does delivery take within India?',
      answer: 'Domestic orders are dispatched within 24-48 business hours via insured BlueDart or Delhivery Air Express. Metro cities typically receive delivery in 2-3 business days; other regions within 4-5 business days.'
    },
    {
      category: 'Payments & COD',
      question: 'Is Cash on Delivery (COD) available?',
      answer: 'Yes! Cash on Delivery is available across 19,000+ Indian pincodes on all orders up to ₹25,000. You can also pay via UPI QR code scan at the doorstep.'
    },
    {
      category: 'Returns & Exchange',
      question: 'What is your return and exchange policy?',
      answer: 'We provide a hassle-free 7-day replacement or return window from the date of parcel delivery. Items must remain in their original unworn condition with intact security tags.'
    },
    {
      category: 'Authenticity & Quality',
      question: 'Are all products 100% genuine?',
      answer: 'Yes! Every pure silk saree from Virasat carries a genuine Silk Mark certification issued by the Central Silk Board of India, guaranteeing authentic handloom craftsmanship.'
    },
    {
      category: 'Discounts & Offers',
      question: 'How do I use a discount coupon?',
      answer: 'You can apply discount codes like VIRASAT10 (10% off) or FESTIVE15 directly on the Cart page or during Step 4 of the Checkout process.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 px-1">
          <Link href="/" className="hover:text-[#13293D]">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">Frequently Asked Questions</span>
        </div>

        {/* FAQ Container */}
        <div className="bg-white rounded-md shadow-xs border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#13293D] uppercase tracking-wider">
              HELP CENTER
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Frequently Asked Questions (FAQs)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Quick answers about orders, delivery, returns, and payment options.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:text-[#13293D] transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openIndex === idx ? 'rotate-180 text-[#13293D]' : ''
                    }`}
                  />
                </button>
                {openIndex === idx && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-sm border border-slate-100">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-center text-slate-500">
            Still have questions? Contact our customer support team at{' '}
            <Link href="/contact" className="text-[#13293D] font-bold hover:underline">
              care@virasat.com
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
