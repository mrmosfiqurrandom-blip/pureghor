export type AdminRole = 'superAdmin' | 'manager' | 'editor';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeNameBn: string;
  storeNameEn: string;
  taglineBn: string;
  taglineEn: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressBn: string;
  addressEn: string;
  businessHours: string;
  isCodAvailable: boolean;
  deliveryCharges: {
    insideDhaka: number;
    outsideDhaka: number;
    insideSylhet: number;
    outsideSylhet: number;
  };
  freeDeliveryThreshold: number;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  currency: string;
  currencySymbol: string;
  taxText: string;
  themeColors: {
    primaryGreen: string;
    deepGreen: string;
    warmCream: string;
    honeyAmber: string;
    terracotta: string;
    neutralText: string;
    border: string;
  };
  announcementBar: {
    enabled: boolean;
    textBn: string;
    linkUrl?: string;
  };
  trustStrip: Array<{
    id: string;
    icon: string;
    titleBn: string;
    descBn: string;
  }>;
  aboutUsContent?: {
    headline: string;
    storyBn: string;
    sourcingBn: string;
    promiseBn: string;
  };
  isSetupComplete: boolean;
  updatedAt: string;
}

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  descriptionBn: string;
  imageUrl: string;
  bannerUrl?: string;
  displayOrder: number;
  isActive: boolean;
  type: 'food' | 'personal_care' | 'combo';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  url: string;
  storagePath?: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductWeightOption {
  weight: number;
  unit: 'gm' | 'kg' | 'ml' | 'ltr' | 'pcs';
  price: number;
  salePrice?: number;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescriptionBn: string;
  descriptionBn: string;
  price: number;
  salePrice?: number;
  currency: string;
  stock: number;
  lowStockThreshold: number;
  weight: number;
  unit: 'gm' | 'kg' | 'ml' | 'ltr' | 'pcs';
  weightOptions?: ProductWeightOption[];
  images: ProductImage[];
  ingredients?: string;
  nutrition?: string;
  source?: string;
  storageInstruction?: string;
  expiryText?: string;
  isPublished: boolean;
  isFeatured: boolean;
  isSpecialOffer?: boolean;
  offerExpiryDate?: string;
  relatedProductIds?: string[];
  seoTitle?: string;
  seoDescription?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethod = 'COD' | 'bKash' | 'Nagad' | 'Card';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  productId: string;
  nameBn: string;
  nameEn: string;
  price: number;
  quantity: number;
  weight: number;
  unit: string;
  image: string;
  selectedWeightOption?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  alternativePhone?: string;
  district: string;
  thanaOrArea?: string;
  fullAddress: string;
  deliveryNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerSnapshot: {
    name: string;
    phone: string;
    email?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  grandTotal: number;
  couponCode?: string;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  customerNote?: string;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  uid: string;
  displayName: string;
  phoneNumber: string;
  email?: string;
  addresses?: ShippingAddress[];
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productNameBn: string;
  customerName: string;
  customerPhone?: string;
  rating: number; // 1-5
  comment: string;
  imageUrl?: string;
  isVerifiedBuyer: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  isFeatured?: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  titleBn: string;
  subtitleBn?: string;
  type: 'hero' | 'offer' | 'category' | 'popup';
  imageUrl: string;
  mobileImageUrl?: string;
  targetUrl?: string;
  altText: string;
  ctaTextBn?: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  questionBn: string;
  answerBn: string;
  category: 'delivery' | 'payment' | 'products' | 'returns' | 'general';
  displayOrder: number;
  isActive: boolean;
}

export interface MediaFile {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  storagePath?: string;
  altText: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  collection: string;
  documentId: string;
  performedBy: string;
  performedByEmail?: string;
  details?: Record<string, any>;
  timestamp: string;
}
