import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getCategories } from '@/lib/db';

export const metadata: Metadata = {
  title: 'All Product Categories - Sarees, Lehengas, Kurtas & Jewellery',
  description: 'Shop by category: pure Kanjeevaram silk sarees, Banarasi weaves, bridal lehengas, and temple jewellery.'
};

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await getCategories(true);

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2.5 px-1">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">All Categories</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-4 mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Explore All Categories
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Browse top ethnic wear and luxury handloom categories
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs text-[#13293D] font-bold hover:underline"
          >
            View All Offers &rarr;
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-md border border-slate-200 p-3.5 flex flex-col items-center text-center hover:border-[#13293D] hover:shadow-sm transition"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 bg-slate-100 border border-slate-200 group-hover:scale-105 transition-transform">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                  alt={cat.name}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
              </div>

              <h2 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#13293D] transition line-clamp-1">
                {cat.name}
              </h2>

              <span className="text-[11px] font-bold text-emerald-700 mt-1">
                Min. 50% Off
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
