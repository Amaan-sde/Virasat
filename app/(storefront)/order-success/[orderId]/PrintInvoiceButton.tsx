'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { Order } from '@/types';

interface PrintInvoiceButtonProps {
  order?: Order;
}

export default function PrintInvoiceButton({ order }: PrintInvoiceButtonProps) {
  return (
    <button
      onClick={() => window.print()}
      className="px-3.5 py-1.5 rounded-xs bg-white hover:bg-gray-50 border border-gray-300 text-xs font-bold text-gray-800 transition flex items-center gap-1.5 shadow-xs print:hidden cursor-pointer"
    >
      <Printer className="w-3.5 h-3.5 text-[#13293D]" />
      <span>Print Invoice</span>
    </button>
  );
}
