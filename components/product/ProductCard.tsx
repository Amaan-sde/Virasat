'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types';
import { calculateDiscountPercentage, formatCurrency } from '@/lib/utils';
import { useCart } from '../cart/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const discountPercent = calculateDiscountPercentage(product.price, product.compareAtPrice);
  const inWishlist = isInWishlist(product.id);

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images[1] || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    const defaultVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
    addToCart(product, defaultVariant, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-card-hover transition-all duration-300 rounded-lg p-3 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative">
        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2 top-2 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-xs border border-slate-100 transition-transform active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist
                ? 'fill-red-500 text-red-500'
                : 'text-slate-400 hover:text-red-500'
            }`}
          />
        </button>

        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] w-full overflow-hidden bg-slate-50 rounded-md mb-2">
          <Image
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-103"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between pt-1">
        <div>
          {/* Brand & Silk Mark Hallmark */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              VIRASAT
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
              Silk Mark ✓
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center gap-0.5 bg-emerald-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded leading-none">
              {(product.rating || 4.4).toFixed(1)} <Star className="w-2.5 h-2.5 fill-white" />
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ({product.reviewCount || 1240})
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-bold text-slate-900 font-sans">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-700">
                {discountPercent}% off
              </span>
            )}
          </div>

          {/* Bottom Bar: Free delivery + Add button */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 font-medium">
              Free delivery
            </span>
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className={`text-xs font-bold px-3 py-1.5 rounded-md border transition flex items-center gap-1 cursor-pointer ${
                isAdding
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-[#13293D] border-slate-300 hover:bg-[#13293D] hover:text-white hover:border-[#13293D]'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-3 h-3" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
