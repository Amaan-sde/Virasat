'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?all=true&limit=100')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          const filtered = data.products.filter((p: Product) => wishlist.includes(p.id));
          setProducts(filtered);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wishlist]);

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-gray-900">
              My Wishlist ({wishlist.length})
            </h1>
          </div>
          <Link
            href="/shop"
            className="text-xs text-[#13293D] font-bold hover:underline"
          >
            Continue Shopping &rarr;
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-md shadow-xs border border-slate-200 py-20 text-center max-w-xl mx-auto space-y-3 p-8">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 fill-red-500" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Empty Wishlist</h2>
            <p className="text-xs text-slate-500">
              You have no items in your wishlist. Start adding items you love!
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block bg-[#13293D] text-white text-xs font-bold px-6 py-2.5 rounded-sm uppercase tracking-wider hover:bg-[#0B1522] transition"
              >
                Explore Products
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
