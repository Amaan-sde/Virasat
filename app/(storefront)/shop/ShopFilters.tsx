'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, Check } from 'lucide-react';
import { Category, Collection } from '@/types';

interface ShopFiltersProps {
  categories: Category[];
  collections: Collection[];
  currentCategory?: string;
  currentCollection?: string;
  currentSort?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentInStock?: string;
  currentSearch?: string;
}

export default function ShopFilters({
  categories,
  collections,
  currentCategory,
  currentCollection,
  currentSort = 'popular',
  currentMinPrice = '',
  currentMaxPrice = '',
  currentInStock = 'false',
  currentSearch = ''
}: ShopFiltersProps) {
  const router = useRouter();

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const applyFilter = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilter({ minPrice, maxPrice });
  };

  const clearAllFilters = () => {
    router.push('/shop');
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentCollection || currentMinPrice || currentMaxPrice || currentInStock === 'true'
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-2">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-600" />
          <span>Filters & Categories {hasActiveFilters && '(Applied)'}</span>
        </button>
      </div>

      {/* Filter Card */}
      <div
        className={`bg-white rounded-xl shadow-card border border-slate-200/90 divide-y divide-slate-100 ${
          mobileFilterOpen
            ? 'fixed inset-0 z-50 overflow-y-auto p-4 flex flex-col'
            : 'hidden lg:block'
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
            Filters
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase"
            >
              Clear All
            </button>
          )}
          {mobileFilterOpen && (
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="lg:hidden text-slate-500 font-bold text-sm"
            >
              ✕ Close
            </button>
          )}
        </div>

        {/* Categories Section */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Categories
          </h3>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            <button
              onClick={() => applyFilter({ category: undefined })}
              className={`w-full text-left text-xs py-1.5 px-2 rounded-md flex items-center justify-between transition ${
                !currentCategory
                  ? 'font-bold text-[#13293D] bg-amber-50/80 border border-amber-200/60'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>All Categories</span>
              {!currentCategory && <Check className="w-3.5 h-3.5 text-amber-600" />}
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => applyFilter({ category: cat.slug })}
                className={`w-full text-left text-xs py-1.5 px-2 rounded-md flex items-center justify-between transition ${
                  currentCategory === cat.slug
                    ? 'font-bold text-[#13293D] bg-amber-50/80 border border-amber-200/60'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {currentCategory === cat.slug && (
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Section */}
        {collections.length > 0 && (
          <div className="p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Curated Collections
            </h3>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {collections.map(col => (
                <button
                  key={col.id}
                  onClick={() =>
                    applyFilter({
                      collection: currentCollection === col.slug ? undefined : col.slug
                    })
                  }
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-md flex items-center justify-between transition ${
                    currentCollection === col.slug
                      ? 'font-bold text-[#13293D] bg-amber-50/80 border border-amber-200/60'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{col.name}</span>
                  {currentCollection === col.slug && (
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div className="p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Price Range (₹)
          </h3>
          <form onSubmit={handlePriceApply} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-md focus:outline-none focus:border-amber-600 text-slate-900"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-md focus:outline-none focus:border-amber-600 text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#13293D] hover:bg-slate-900 text-white text-xs font-bold py-2 rounded-md uppercase tracking-wider transition"
            >
              Apply Filter
            </button>
          </form>
        </div>

        {/* Customer Rating Filter */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Customer Ratings
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-amber-700">
              <input type="checkbox" className="rounded text-amber-600 focus:ring-0" />
              <span className="inline-flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                4★ & above
              </span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-amber-700">
              <input type="checkbox" className="rounded text-amber-600 focus:ring-0" />
              <span className="inline-flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                3★ & above
              </span>
            </label>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="p-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={currentInStock === 'true'}
              onChange={e => applyFilter({ inStock: e.target.checked ? 'true' : undefined })}
              className="rounded text-amber-600 focus:ring-0"
            />
            <span>Exclude Out of Stock</span>
          </label>
        </div>

        {mobileFilterOpen && (
          <div className="p-4 mt-auto">
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-amber-600 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider text-xs shadow-md"
            >
              Show Results
            </button>
          </div>
        )}
      </div>
    </>
  );
}
