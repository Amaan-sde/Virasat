'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  MapPin,
  Ruler,
  Tag,
  Share2,
  Check
} from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { calculateDiscountPercentage, formatCurrency } from '@/lib/utils';
import { useCart } from '@/components/cart/CartContext';
import { useToast } from '@/components/ui/ToastContext';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { success, error, info } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const inWishlist = isInWishlist(product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentComparePrice = selectedVariant?.compareAtPrice || product.compareAtPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const discountPercent = calculateDiscountPercentage(currentPrice, currentComparePrice);

  const images = product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'];

  const handleAddToCart = () => {
    if (currentStock <= 0) {
      error('Selected item is currently out of stock.');
      return;
    }
    addToCart(product, selectedVariant, quantity);
    success('Item successfully added to your cart!');
  };

  const handleBuyNow = () => {
    if (currentStock <= 0) {
      error('Selected item is currently out of stock.');
      return;
    }
    const added = addToCart(product, selectedVariant, quantity);
    if (added) {
      router.push('/checkout');
    }
  };

  const checkDeliveryPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length !== 6) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    const estDate = new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    setPincodeStatus(`Delivery by ${estDate} | Free ₹40 (Cash on Delivery Available)`);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      info('Product link copied to clipboard!');
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          customerName: reviewName || 'Verified Buyer',
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        success('Thank you for your review! It is now live.');
        setReviewsList(prev => [data.review, ...prev]);
        setReviewComment('');
        setReviewName('');
      } else {
        error(data.error || 'Failed to submit review');
      }
    } catch {
      error('Error submitting review');
    }
    setSubmittingReview(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: Flipkart Sticky Image Gallery & Action Buttons (5 Columns) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          {/* Vertical Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[460px] pb-2 sm:pb-0 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-14 h-18 sm:w-16 sm:h-20 rounded-xs overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                    selectedImage === idx
                      ? 'border-[#13293D] shadow-sm'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Display Image Frame */}
          <div className="relative aspect-[3/4] flex-1 bg-gray-50 border border-gray-200 rounded-xs overflow-hidden">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />

            {/* Floating Wishlist Heart */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full border border-gray-200 shadow-sm transition active:scale-90"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              />
            </button>
          </div>
        </div>

        {/* HIGH-CONVERSION DUAL ACTION BUTTONS (VIRASAT BESPOKE) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="w-full bg-[#13293D] hover:bg-[#0B1522] active:bg-[#050C15] text-white font-bold py-3.5 px-4 rounded-sm shadow-sm transition flex items-center justify-center gap-2 uppercase tracking-wide text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 fill-white" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={currentStock <= 0}
            className="w-full bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold py-3.5 px-4 rounded-sm shadow-sm transition flex items-center justify-center gap-2 uppercase tracking-wide text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Product Information (7 Columns) */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Brand & Share */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            VIRASAT ETHNICS
          </span>
          <button
            onClick={handleShare}
            className="text-gray-500 hover:text-[#13293D] text-xs flex items-center gap-1 font-medium transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Product Title */}
        <h1 className="text-lg sm:text-xl font-medium text-gray-900 leading-snug">
          {product.name}
        </h1>

        {/* Rating Pill & Silk Mark Certified Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-[#059669] text-white text-xs font-bold px-2 py-0.5 rounded-sm">
            {(product.rating || 4.4).toFixed(1)} <Star className="w-3 h-3 fill-white" />
          </span>
          <span className="text-xs font-semibold text-gray-500">
            {product.reviewCount || 1240} Ratings & 312 Reviews
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Silk Mark Certified
          </span>
        </div>

        {/* Special Price Tag */}
        <div className="text-xs font-bold text-green-700">
          Special Price
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-bold text-gray-900 font-sans">
            {formatCurrency(currentPrice)}
          </span>
          {currentComparePrice && currentComparePrice > currentPrice && (
            <span className="text-base text-gray-500 line-through">
              {formatCurrency(currentComparePrice)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-base font-bold text-[#388e3c]">
              {discountPercent}% off
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div>
          {currentStock > 0 ? (
            currentStock <= 5 ? (
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                Hurry, Only {currentStock} left in stock!
              </span>
            ) : (
              <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
              </span>
            )
          ) : (
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Currently Out of Stock
            </span>
          )}
        </div>

        {/* AVAILABLE OFFERS (Flipkart signature section) */}
        <div className="border border-gray-200 rounded-xs p-3.5 bg-gray-50/50 space-y-2">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            Available Offers
          </h3>
          <div className="space-y-1.5 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <Tag className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5 fill-green-100" />
              <span>
                <strong>Bank Offer:</strong> 10% instant discount on HDFC & SBI Bank Credit Cards, up to ₹1,500.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Tag className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5 fill-green-100" />
              <span>
                <strong>Special Price:</strong> Get extra 15% off (coupon code <strong className="text-[#D97706]">VIRASAT10</strong> applied at checkout).
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Tag className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5 fill-green-100" />
              <span>
                <strong>Partner Offer:</strong> Complimentary pure silk handcrafted potli pouch with this order.
              </span>
            </div>
          </div>
        </div>

        {/* DELIVERY PINCODE CHECKER */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-1.5">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-700">Delivery Options</span>
          </div>
          <form onSubmit={checkDeliveryPincode} className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Enter 6-digit Pincode"
              maxLength={6}
              value={pincode}
              onChange={e => setPincode(e.target.value)}
              className="flex-1 text-xs border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#13293D]"
            />
            <button
              type="submit"
              className="bg-white border border-[#13293D] text-[#13293D] font-bold text-xs px-4 py-2 rounded-sm hover:bg-slate-100 transition uppercase cursor-pointer"
            >
              Check
            </button>
          </form>
          {pincodeStatus && (
            <p className="text-xs font-semibold text-green-700 mt-1.5">
              {pincodeStatus}
            </p>
          )}
        </div>

        {/* VARIANT MATRIX (Sizes & Colors) */}
        {product.variants && product.variants.length > 1 && (
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Select Size:</span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3 h-3" /> Size Chart
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(variant => {
                const isSelected = selectedVariant?.id === variant.id;
                const isAvailable = variant.stock > 0;
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!isAvailable}
                    className={`px-3 py-1.5 text-xs font-bold rounded-sm border transition cursor-pointer ${
                      isSelected
                        ? 'border-[#13293D] bg-slate-100 text-[#13293D] ring-1 ring-[#13293D]'
                        : isAvailable
                        ? 'border-gray-300 text-gray-800 hover:border-gray-500 bg-white'
                        : 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through'
                    }`}
                  >
                    {variant.size || variant.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PRODUCT HIGHLIGHTS & SPECIFICATIONS */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Product Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex py-1.5 border-b border-gray-100">
              <span className="w-32 text-gray-500 font-medium shrink-0">Fabric / Material</span>
              <span className="text-gray-900 font-semibold">
                {product.attributes?.find(a => a.name.toLowerCase().includes('fabric'))?.value || 'Pure Mulberry Silk'}
              </span>
            </div>
            <div className="flex py-1.5 border-b border-gray-100">
              <span className="w-32 text-gray-500 font-medium shrink-0">Pattern / Weave</span>
              <span className="text-gray-900 font-semibold">
                {product.attributes?.find(a => a.name.toLowerCase().includes('weave'))?.value || 'Handloom Jacquard Zari'}
              </span>
            </div>
            <div className="flex py-1.5 border-b border-gray-100">
              <span className="w-32 text-gray-500 font-medium shrink-0">Occasion</span>
              <span className="text-gray-900 font-semibold">Bridal, Wedding, Festive</span>
            </div>
            <div className="flex py-1.5 border-b border-gray-100">
              <span className="w-32 text-gray-500 font-medium shrink-0">Wash Care</span>
              <span className="text-gray-900 font-semibold">Dry Clean Only</span>
            </div>
            <div className="flex py-1.5 border-b border-gray-100">
              <span className="w-32 text-gray-500 font-medium shrink-0">Country of Origin</span>
              <span className="text-gray-900 font-semibold">India</span>
            </div>
            <div className="flex py-1.5 border-b border-gray-100">
              <span className="w-32 text-gray-500 font-medium shrink-0">SKU</span>
              <span className="text-gray-900 font-semibold">{selectedVariant?.sku || product.sku}</span>
            </div>
          </div>
        </div>

        {/* PRODUCT DESCRIPTION */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Product Description
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* CUSTOMER REVIEWS & RATINGS SECTION */}
        <div className="pt-5 border-t border-gray-200 space-y-4">
          <h3 className="text-base font-bold text-gray-900">
            Ratings & Reviews
          </h3>
          
          <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xs border border-gray-200">
            <div className="text-center shrink-0">
              <div className="text-3xl font-black text-gray-900">
                {(product.rating || 4.4).toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-0.5 text-amber-500 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-[11px] text-gray-500">{product.reviewCount || 1240} Ratings</p>
            </div>

            {/* Rating distribution progress bars */}
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 text-gray-500">5★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[78%] h-full bg-emerald-600" />
                </div>
                <span className="text-gray-400 text-[10px]">78%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 text-gray-500">4★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[14%] h-full bg-emerald-600" />
                </div>
                <span className="text-gray-400 text-[10px]">14%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 text-gray-500">3★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[5%] h-full bg-amber-500" />
                </div>
                <span className="text-gray-400 text-[10px]">5%</span>
              </div>
            </div>
          </div>

          {/* Write a review form */}
          <form onSubmit={submitReview} className="bg-white border border-gray-200 p-3 rounded-xs space-y-2">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Rate & Review this Product
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-0.5 text-amber-500"
                  >
                    <Star
                      className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-500' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={reviewName}
                onChange={e => setReviewName(e.target.value)}
                className="w-1/3 text-xs p-2 border border-gray-300 rounded-xs focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Write your review here..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="flex-1 text-xs p-2 border border-gray-300 rounded-xs focus:outline-none"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#13293D] text-white font-bold text-xs px-4 py-2 rounded-sm uppercase tracking-wider hover:bg-[#0B1522] transition"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Reviews List */}
          {reviewsList.length > 0 && (
            <div className="space-y-2 divide-y divide-gray-100">
              {reviewsList.map((rev, idx) => (
                <div key={idx} className="pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-xs">
                      {rev.rating} ★
                    </span>
                    <span className="font-bold text-gray-800">{rev.customerName}</span>
                    <span className="text-green-700 font-semibold flex items-center gap-0.5 text-[10px]">
                      <Check className="w-3 h-3" /> Certified Buyer
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* SIZE GUIDE MODAL */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xs shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-base text-gray-900">Standard Saree & Suit Size Guide</h3>
              <button onClick={() => setSizeGuideOpen(false)} className="text-gray-500 font-bold">✕</button>
            </div>
            <table className="w-full text-xs text-left border">
              <thead className="bg-gray-100 font-bold border-b">
                <tr>
                  <th className="p-2 border-r">Size</th>
                  <th className="p-2 border-r">Bust (in)</th>
                  <th className="p-2 border-r">Waist (in)</th>
                  <th className="p-2">Hip (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-2 border-r font-bold">Small (S)</td>
                  <td className="p-2 border-r">34 - 35</td>
                  <td className="p-2 border-r">28 - 29</td>
                  <td className="p-2">36 - 37</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-bold">Medium (M)</td>
                  <td className="p-2 border-r">36 - 37</td>
                  <td className="p-2 border-r">30 - 31</td>
                  <td className="p-2">38 - 39</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-bold">Large (L)</td>
                  <td className="p-2 border-r">38 - 39</td>
                  <td className="p-2 border-r">32 - 33</td>
                  <td className="p-2">40 - 41</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-bold">XL</td>
                  <td className="p-2 border-r">40 - 42</td>
                  <td className="p-2 border-r">34 - 36</td>
                  <td className="p-2">42 - 44</td>
                </tr>
                <tr>
                  <td className="p-2 border-r font-bold">Free Size</td>
                  <td className="p-2 border-r">5.5m Saree</td>
                  <td className="p-2 border-r">0.8m Blouse</td>
                  <td className="p-2">Standard Fit</td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="w-full bg-[#13293D] text-white font-bold py-2 rounded-sm text-xs uppercase hover:bg-[#0B1522] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
