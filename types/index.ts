export type UserRole = 'DEVELOPER' | 'CLIENT' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string; // e.g. "S / Crimson Red"
  size?: string; // e.g. "Free Size", "S", "M", "L", "XL", "Unstitched"
  color?: string; // e.g. "Royal Crimson", "Antique Gold"
  colorHex?: string; // e.g. "#6B1724"
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
}

export interface ProductAttribute {
  name: string; // e.g. "Fabric", "Weave", "Craft", "Zari Type", "Care"
  value: string; // e.g. "Pure Kanjeevaram Mulberry Silk", "Jacquard Handloom"
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  categoryId: string;
  categoryName?: string;
  collectionIds: string[];
  images: string[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  isArchived: boolean;
  seoTitle?: string;
  seoDescription?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isVisible: boolean;
  seoTitle?: string;
  seoDescription?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  displayOrder: number;
  isVisible: boolean;
  productCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'COD' | 'ONLINE_RAZORPAY' | 'CARD' | 'UPI';

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  variantId?: string;
  variantTitle?: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingCarrier?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantId?: string;
  variantTitle?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId?: string;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export type SectionType =
  | 'HERO_SLIDER'
  | 'CATEGORY_GRID'
  | 'FEATURED_COLLECTION'
  | 'PROMO_BANNER'
  | 'BEST_SELLERS'
  | 'BRAND_STORY'
  | 'TRUST_FEATURES'
  | 'NEWSLETTER';

export interface HomepageSection {
  id: string;
  sectionType: SectionType;
  title: string;
  subtitle?: string;
  content: Record<string, any>;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  url: string;
  target?: '_self' | '_blank';
  badge?: string;
  children?: NavigationMenuItem[];
}

export interface StoreSettings {
  id: string;
  storeName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  announcementText: string;
  announcementLink?: string;
  isAnnouncementVisible: boolean;
  currencySymbol: string;
  currencyCode: string;
  taxRate: number; // percentage, e.g. 5 for 5% GST
  freeShippingThreshold: number; // e.g. 1999
  standardShippingFee: number; // e.g. 99
  codEnabled: boolean;
  codFee: number;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    youtube?: string;
    whatsapp?: string;
  };
  headerNav: NavigationMenuItem[];
  footerNav: NavigationMenuItem[];
  seoMetaTitle: string;
  seoMetaDescription: string;
  paymentGatewayConfigured: boolean;
  razorpayKeyId?: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

