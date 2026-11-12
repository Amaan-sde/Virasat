import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getCategories, getCollections, getProducts } from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';
import ShopFilters from './ShopFilters';

export const metadata: Metadata = {
  title: 'Handloom Sarees, Lehengas & Ethnic Fashion - Shop Online | Virasat',
  description: 'Explore certified pure Kanjeevaram silks, Banarasi brocades, bridal lehengas, and temple jewellery directly from master artisan clusters.'
};

export const revalidate = 0;

interface ShopPageProps {
  searchParams: {
    category?: string;
    collection?: string;
    sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'featured';
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    search?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const categories = await getCategories(true);
  const collections = await getCollections(true);

  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const inStock = searchParams.inStock === 'true';

  const currentSort = searchParams.sort || 'popular';

  const { products, total } = await getProducts({
    categorySlug: searchParams.category,
    collectionSlug: searchParams.collection,
    sort: currentSort,
    minPrice,
    maxPrice,
    inStock,
    search: searchParams.search,
    limit: 40,
    isPublished: true
  });

  const activeCategoryObj = categories.find(c => c.slug === searchParams.category);

  // Helper for sort tab URLs
  const getSortUrl = (sortKey: string) => {
    const params = new URLSearchParams();
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.collection) params.set('collection', searchParams.collection);
    if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
    if (searchParams.inStock) params.set('inStock', searchParams.inStock);
    if (searchParams.search) params.set('search', searchParams.search);
    params.set('sort', sortKey);
    return `/shop?${params.toString()}`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-3.5">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 px-1">
          <Link href="/" className="hover:text-amber-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/shop" className="hover:text-amber-700">All Creations</Link>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold">{activeCategoryObj.name}</span>
            </>
          )}
        </div>

        {/* 2-Column Discovery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5 items-start">
          
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-1">
            <ShopFilters
              categories={categories}
              collections={collections}
              currentCategory={searchParams.category}
              currentCollection={searchParams.collection}
              currentSort={currentSort}
              currentMinPrice={searchParams.minPrice}
              currentMaxPrice={searchParams.maxPrice}
              currentInStock={searchParams.inStock}
              currentSearch={searchParams.search}
            />
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {/* Top Sort Header */}
            <div className="bg-white rounded-xl shadow-card border border-slate-200/90 px-4 pt-3.5 pb-0 mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
                <div>
                  <h1 className="text-base font-bold text-slate-900">
                    {activeCategoryObj ? activeCategoryObj.name : 'All Handcrafted Creations'}
                  </h1>
                  <span className="text-xs text-slate-500">
                    (Displaying 1 – {products.length} of {total} authentic pieces)
                  </span>
                </div>
              </div>

              {/* Horizontal Sort Tabs */}
              <div className="flex items-center gap-6 overflow-x-auto text-xs py-2">
                <span className="font-bold text-slate-800 shrink-0 uppercase tracking-wider text-[11px]">
                  Sort By:
                </span>
                
                <Link
                  href={getSortUrl('popular')}
                  className={`py-1.5 shrink-0 transition font-medium border-b-2 ${
                    currentSort === 'popular'
                      ? 'text-[#13293D] font-bold border-amber-600'
                      : 'text-slate-600 hover:text-slate-900 border-transparent'
                  }`}
                >
                  Popularity
                </Link>

                <Link
                  href={getSortUrl('price-asc')}
                  className={`py-1.5 shrink-0 transition font-medium border-b-2 ${
                    currentSort === 'price-asc'
                      ? 'text-[#13293D] font-bold border-amber-600'
                      : 'text-slate-600 hover:text-slate-900 border-transparent'
                  }`}
                >
                  Price: Low to High
                </Link>

                <Link
                  href={getSortUrl('price-desc')}
                  className={`py-1.5 shrink-0 transition font-medium border-b-2 ${
                    currentSort === 'price-desc'
                      ? 'text-[#13293D] font-bold border-amber-600'
                      : 'text-slate-600 hover:text-slate-900 border-transparent'
                  }`}
                >
                  Price: High to Low
                </Link>

                <Link
                  href={getSortUrl('newest')}
                  className={`py-1.5 shrink-0 transition font-medium border-b-2 ${
                    currentSort === 'newest'
                      ? 'text-[#13293D] font-bold border-amber-600'
                      : 'text-slate-600 hover:text-slate-900 border-transparent'
                  }`}
                >
                  Newest First
                </Link>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-xl shadow-card border border-slate-200/90 p-12 text-center">
                <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
                  🔍
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No matching weaves found
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Please try broadening your filter criteria or price limits.
                </p>
                <Link
                  href="/shop"
                  className="bg-[#13293D] text-white text-xs font-bold px-6 py-2 rounded-lg shadow-xs uppercase tracking-wider hover:bg-slate-900 transition"
                >
                  Reset All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                {products.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
