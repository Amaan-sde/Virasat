'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';
import { useToast } from '../ui/ToastContext';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  discountCode: string | null;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  tax: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => boolean;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'virasat_cart_v1';
const WISHLIST_STORAGE_KEY = 'virasat_wishlist_v1';
const FREE_SHIPPING_THRESHOLD = 1999;
const STANDARD_SHIPPING_FEE = 99;
const TAX_RATE = 0.05; // 5% GST

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { success, error, info } = useToast();

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      const savedCoupon = localStorage.getItem('virasat_coupon');
      if (savedCoupon) {
        const c = JSON.parse(savedCoupon);
        setDiscountCode(c.code);
        setDiscountAmount(c.amount || 0);
      }
    } catch {
      // storage unavailable
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, isLoaded]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback(
    (product: Product, variant?: ProductVariant, quantity: number = 1): boolean => {
      const targetStock = variant ? variant.stock : product.stock;
      if (targetStock <= 0) {
        error('This item is currently out of stock.');
        return false;
      }

      const cartItemId = `${product.id}-${variant?.id || 'default'}`;
      const effectivePrice = variant ? variant.price : product.price;
      const comparePrice = variant?.compareAtPrice || product.compareAtPrice;
      const primaryImage = product.images[0] || '';

      setItems(prev => {
        const existingIndex = prev.findIndex(item => item.id === cartItemId);
        if (existingIndex > -1) {
          const existingItem = prev[existingIndex];
          const newQty = existingItem.quantity + quantity;
          if (newQty > targetStock) {
            error(`Only ${targetStock} units available in stock.`);
            return prev;
          }
          const updated = [...prev];
          updated[existingIndex] = { ...existingItem, quantity: newQty };
          return updated;
        } else {
          if (quantity > targetStock) {
            error(`Only ${targetStock} units available in stock.`);
            return prev;
          }
          return [
            ...prev,
            {
              id: cartItemId,
              productId: product.id,
              productName: product.name,
              productSlug: product.slug,
              variantId: variant?.id,
              variantTitle: variant?.title,
              price: effectivePrice,
              compareAtPrice: comparePrice,
              image: primaryImage,
              quantity,
              stock: targetStock
            }
          ];
        }
      });

      success(`Added "${product.name}" to cart.`);
      setIsCartOpen(true);
      return true;
    },
    [error, success]
  );

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(cartItemId);
        return;
      }
      setItems(prev =>
        prev.map(item => {
          if (item.id === cartItemId) {
            if (quantity > item.stock) {
              error(`Only ${item.stock} units available.`);
              return item;
            }
            return { ...item, quantity };
          }
          return item;
        })
      );
    },
    [error]
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      setItems(prev => prev.filter(item => item.id !== cartItemId));
      info('Item removed from cart.');
    },
    [info]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscountCode(null);
    setDiscountAmount(0);
    try {
      localStorage.removeItem('virasat_coupon');
    } catch {}
  }, []);

  // Calculate pricing
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Recalculate discount if coupon applied
  const discount = Math.min(discountAmount, subtotal);
  const discountedSubtotal = Math.max(0, subtotal - discount);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const tax = Math.round(discountedSubtotal * TAX_RATE);
  const total = discountedSubtotal + shippingFee + tax;

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a coupon code.' };

    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, subtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Invalid promo code');
        return { success: false, message: data.error || 'Invalid promo code' };
      }

      setDiscountCode(data.coupon.code);
      setDiscountAmount(data.discountAmount);
      localStorage.setItem(
        'virasat_coupon',
        JSON.stringify({ code: data.coupon.code, amount: data.discountAmount })
      );
      success(`Coupon ${data.coupon.code} applied! Saved ₹${data.discountAmount.toLocaleString('en-IN')}`);
      return { success: true, message: 'Coupon applied successfully' };
    } catch {
      error('Failed to validate promo code.');
      return { success: false, message: 'Server connection error' };
    }
  };

  const removeCoupon = () => {
    setDiscountCode(null);
    setDiscountAmount(0);
    try {
      localStorage.removeItem('virasat_coupon');
    } catch {}
    info('Coupon removed.');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        info('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        success('Added to your wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        discountCode,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        tax,
        total,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}

