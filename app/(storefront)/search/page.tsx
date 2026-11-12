import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Search as SearchIcon, ChevronRight } from 'lucide-react';
import { getProducts } from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';

export const metadata: Metadata = {
  title: 'Search Products Online | Virasat',
  description: 'Search authentic pure silk sarees, bridal lehengas, and handcrafted temple jewellery.'
};

export const revalidate = 0;

interface SearchPageProps {
  searchParams: {
    q?: string;
    sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || '';

  const { products, total } = await getProducts({
    search: query,
    sort: searchParams.sort || 'popular',
    limit: 50,
    isPublished: true
  });

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2.5 px-1">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">Search Results</span>
          {query && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-900 font-semibold">&quot;{query}&quot;</span>
            </>
          )}
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-4 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900">
                {query ? `Showing results for "${query}"` : 'All Products'}
              </h1>
              <p className="text-xs text-gray-500">
                (Showing 1 – {products.length} of {total} products)
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs text-[#13293D] font-bold hover:underline self-start sm:self-auto"
            >
              Browse All Categories &rarr;
            </Link>
          </div>
        </div>

        {/* Results Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-md shadow-xs border border-slate-200 py-20 text-center max-w-xl mx-auto space-y-3 p-8">
            <div className="w-16 h-16 bg-slate-100 text-[#13293D] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              🔍
            </div>
            <h2 className="text-base font-bold text-slate-900">Sorry, no results found!</h2>
            <p className="text-xs text-slate-500">
              Please check the spelling or try searching for something else like &quot;Saree&quot;, &quot;Kurta&quot;, or &quot;Lehenga&quot;.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block bg-[#13293D] text-white text-xs font-bold px-6 py-2.5 rounded-sm uppercase tracking-wider hover:bg-[#0B1522] transition"
              >
                Explore Catalogue
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {products.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
