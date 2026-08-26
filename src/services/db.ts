import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  runTransaction,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  StoreSettings,
  Category,
  Product,
  Order,
  Review,
  Coupon,
  Banner,
  FAQ,
  Customer,
  AuditLog,
  AdminUser,
} from '../types';
import {
  initialSettings,
  initialCategories,
  initialProducts,
  initialBanners,
  initialCoupons,
  initialFAQs,
  initialReviews,
} from './seedData';

const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'pg_store_settings',
  CATEGORIES: 'pg_categories',
  PRODUCTS: 'pg_products',
  BANNERS: 'pg_banners',
  ORDERS: 'pg_orders',
  COUPONS: 'pg_coupons',
  FAQS: 'pg_faqs',
  REVIEWS: 'pg_reviews',
  ADMINS: 'pg_admins',
  AUDIT: 'pg_audit',
};

// Helper for local storage fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// ----------------- SETTINGS -----------------
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const docRef = doc(db, 'settings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as StoreSettings;
      const merged: StoreSettings = {
        ...initialSettings,
        ...data,
        logoUrl: (data.logoUrl && !data.logoUrl.includes('1GdN6VsN-EgeAHZ-7MVPfsjsJ9wx7ukjM')) ? data.logoUrl : '/logo.svg',
        faviconUrl: (data.faviconUrl && !data.faviconUrl.includes('1GdN6VsN-EgeAHZ-7MVPfsjsJ9wx7ukjM')) ? data.faviconUrl : '/favicon.svg',
        themeColors: {
          ...initialSettings.themeColors,
          ...(data.themeColors || {}),
        },
      };
      setLocal(LOCAL_STORAGE_KEYS.SETTINGS, merged);
      return merged;
    }
  } catch (err) {
    console.warn('Firestore settings read failed, using cache:', err);
  }
  const cached = getLocal<StoreSettings | null>(LOCAL_STORAGE_KEYS.SETTINGS, null);
  if (cached) {
    return {
      ...initialSettings,
      ...cached,
      logoUrl: (cached.logoUrl && !cached.logoUrl.includes('1GdN6VsN-EgeAHZ-7MVPfsjsJ9wx7ukjM')) ? cached.logoUrl : '/logo.svg',
      faviconUrl: (cached.faviconUrl && !cached.faviconUrl.includes('1GdN6VsN-EgeAHZ-7MVPfsjsJ9wx7ukjM')) ? cached.faviconUrl : '/favicon.svg',
      themeColors: {
        ...initialSettings.themeColors,
        ...(cached.themeColors || {}),
      },
    };
  }
  return initialSettings;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>, userEmail?: string): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated: StoreSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  setLocal(LOCAL_STORAGE_KEYS.SETTINGS, updated);

  try {
    const docRef = doc(db, 'settings', 'global');
    await setDoc(docRef, updated, { merge: true });
    await addAuditLog({
      action: 'UPDATE_SETTINGS',
      collection: 'settings',
      documentId: 'global',
      performedBy: userEmail || 'admin',
      details: settings,
    });
  } catch (err) {
    console.warn('Firestore settings update fallback to local:', err);
  }
  return updated;
}

// ----------------- SEED DATABASE -----------------
export async function seedInitialDatabase(force = false): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Settings
    const settingsDoc = doc(db, 'settings', 'global');
    const settingsSnap = await getDoc(settingsDoc);
    if (!settingsSnap.exists() || force) {
      await setDoc(settingsDoc, initialSettings);
      setLocal(LOCAL_STORAGE_KEYS.SETTINGS, initialSettings);
    }

    // 2. Categories
    const categoriesCol = collection(db, 'categories');
    const catSnap = await getDocs(query(categoriesCol, limit(1)));
    if (catSnap.empty || force) {
      const batch = writeBatch(db);
      initialCategories.forEach((cat) => {
        batch.set(doc(db, 'categories', cat.id), cat);
      });
      await batch.commit();
      setLocal(LOCAL_STORAGE_KEYS.CATEGORIES, initialCategories);
    }

    // 3. Products
    const productsCol = collection(db, 'products');
    const prodSnap = await getDocs(query(productsCol, limit(1)));
    if (prodSnap.empty || force) {
      const batch = writeBatch(db);
      initialProducts.forEach((prod) => {
        batch.set(doc(db, 'products', prod.id), prod);
      });
      await batch.commit();
      setLocal(LOCAL_STORAGE_KEYS.PRODUCTS, initialProducts);
    }

    // 4. Banners
    const bannersCol = collection(db, 'banners');
    const banSnap = await getDocs(query(bannersCol, limit(1)));
    if (banSnap.empty || force) {
      const batch = writeBatch(db);
      initialBanners.forEach((ban) => {
        batch.set(doc(db, 'banners', ban.id), ban);
      });
      await batch.commit();
      setLocal(LOCAL_STORAGE_KEYS.BANNERS, initialBanners);
    }

    // 5. Coupons
    const couponsCol = collection(db, 'coupons');
    const coupSnap = await getDocs(query(couponsCol, limit(1)));
    if (coupSnap.empty || force) {
      const batch = writeBatch(db);
      initialCoupons.forEach((coup) => {
        batch.set(doc(db, 'coupons', coup.id), coup);
      });
      await batch.commit();
      setLocal(LOCAL_STORAGE_KEYS.COUPONS, initialCoupons);
    }

    // 6. FAQs
    const faqsCol = collection(db, 'faqs');
    const faqSnap = await getDocs(query(faqsCol, limit(1)));
    if (faqSnap.empty || force) {
      const batch = writeBatch(db);
      initialFAQs.forEach((f) => {
        batch.set(doc(db, 'faqs', f.id), f);
      });
      await batch.commit();
      setLocal(LOCAL_STORAGE_KEYS.FAQS, initialFAQs);
    }

    // 7. Reviews
    const reviewsCol = collection(db, 'reviews');
    const revSnap = await getDocs(query(reviewsCol, limit(1)));
    if (revSnap.empty || force) {
      const batch = writeBatch(db);
      initialReviews.forEach((r) => {
        batch.set(doc(db, 'reviews', r.id), r);
      });
      await batch.commit();
      setLocal(LOCAL_STORAGE_KEYS.REVIEWS, initialReviews);
    }

    return { success: true, message: 'ডাটাবেজ সফলভাবে প্রাথমিক তথ্যে পূর্ণ হয়েছে।' };
  } catch (error: any) {
    console.error('Seed DB Error:', error);
    // Initialize locally so app works regardless
    setLocal(LOCAL_STORAGE_KEYS.SETTINGS, initialSettings);
    setLocal(LOCAL_STORAGE_KEYS.CATEGORIES, initialCategories);
    setLocal(LOCAL_STORAGE_KEYS.PRODUCTS, initialProducts);
    setLocal(LOCAL_STORAGE_KEYS.BANNERS, initialBanners);
    setLocal(LOCAL_STORAGE_KEYS.COUPONS, initialCoupons);
    setLocal(LOCAL_STORAGE_KEYS.FAQS, initialFAQs);
    setLocal(LOCAL_STORAGE_KEYS.REVIEWS, initialReviews);
    return { success: true, message: 'স্থানীয় মেমোরিতে প্রাথমিক তথ্য সেট হয়েছে।' };
  }
}

// ----------------- CATEGORIES -----------------
export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, 'categories'), orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
      setLocal(LOCAL_STORAGE_KEYS.CATEGORIES, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore categories read fallback:', err);
  }
  return getLocal(LOCAL_STORAGE_KEYS.CATEGORIES, initialCategories);
}

export async function saveCategory(category: Category, userEmail?: string): Promise<Category> {
  const currentList = await getCategories();
  const index = currentList.findIndex((c) => c.id === category.id);
  let updatedList: Category[];
  if (index >= 0) {
    updatedList = [...currentList];
    updatedList[index] = category;
  } else {
    updatedList = [...currentList, category];
  }
  setLocal(LOCAL_STORAGE_KEYS.CATEGORIES, updatedList);

  try {
    await setDoc(doc(db, 'categories', category.id), category, { merge: true });
    await addAuditLog({
      action: index >= 0 ? 'UPDATE_CATEGORY' : 'CREATE_CATEGORY',
      collection: 'categories',
      documentId: category.id,
      performedBy: userEmail || 'admin',
      details: { nameBn: category.nameBn, slug: category.slug },
    });
  } catch (err) {
    console.warn('Firestore saveCategory fallback:', err);
  }
  return category;
}

export async function deleteCategory(categoryId: string, userEmail?: string): Promise<boolean> {
  const currentList = await getCategories();
  const updatedList = currentList.filter((c) => c.id !== categoryId);
  setLocal(LOCAL_STORAGE_KEYS.CATEGORIES, updatedList);

  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    await addAuditLog({
      action: 'DELETE_CATEGORY',
      collection: 'categories',
      documentId: categoryId,
      performedBy: userEmail || 'admin',
    });
  } catch (err) {
    console.warn('Firestore deleteCategory fallback:', err);
  }
  return true;
}

// ----------------- PRODUCTS -----------------
export async function getProducts(includeUnpublished = false): Promise<Product[]> {
  try {
    const col = collection(db, 'products');
    const snap = await getDocs(col);
    if (!snap.empty) {
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      setLocal(LOCAL_STORAGE_KEYS.PRODUCTS, list);
      return includeUnpublished ? list : list.filter((p) => p.isPublished);
    }
  } catch (err) {
    console.warn('Firestore products read fallback:', err);
  }
  const cached = getLocal(LOCAL_STORAGE_KEYS.PRODUCTS, initialProducts);
  return includeUnpublished ? cached : cached.filter((p) => p.isPublished);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts(true);
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts(true);
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product: Product, userEmail?: string): Promise<Product> {
  const currentList = await getProducts(true);
  const index = currentList.findIndex((p) => p.id === product.id);
  const now = new Date().toISOString();
  const toSave: Product = {
    ...product,
    updatedAt: now,
    createdAt: product.createdAt || now,
    updatedBy: userEmail || 'admin',
  };

  let updatedList: Product[];
  if (index >= 0) {
    updatedList = [...currentList];
    updatedList[index] = toSave;
  } else {
    updatedList = [toSave, ...currentList];
  }
  setLocal(LOCAL_STORAGE_KEYS.PRODUCTS, updatedList);

  try {
    await setDoc(doc(db, 'products', toSave.id), toSave, { merge: true });
    await addAuditLog({
      action: index >= 0 ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT',
      collection: 'products',
      documentId: toSave.id,
      performedBy: userEmail || 'admin',
      details: { nameBn: toSave.nameBn, price: toSave.price, stock: toSave.stock },
    });
  } catch (err) {
    console.warn('Firestore saveProduct fallback:', err);
  }
  return toSave;
}

export async function deleteProduct(productId: string, userEmail?: string): Promise<boolean> {
  const currentList = await getProducts(true);
  const updatedList = currentList.filter((p) => p.id !== productId);
  setLocal(LOCAL_STORAGE_KEYS.PRODUCTS, updatedList);

  try {
    await deleteDoc(doc(db, 'products', productId));
    await addAuditLog({
      action: 'DELETE_PRODUCT',
      collection: 'products',
      documentId: productId,
      performedBy: userEmail || 'admin',
    });
  } catch (err) {
    console.warn('Firestore deleteProduct fallback:', err);
  }
  return true;
}

// ----------------- ORDERS -----------------
export async function createOrderSecure(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<{ success: boolean; order?: Order; message?: string }> {
  // Validate prices, calculate subtotal and stock
  const allProducts = await getProducts(true);
  const settings = await getStoreSettings();

  let calculatedSubtotal = 0;
  const verifiedItems = [];

  for (const item of orderData.items) {
    const dbProduct = allProducts.find((p) => p.id === item.productId);
    if (!dbProduct) {
      return { success: false, message: `পণ্য পাওয়া যায়নি: ${item.nameBn}` };
    }
    if (dbProduct.stock < item.quantity) {
      return {
        success: false,
        message: `দুঃখিত! "${dbProduct.nameBn}" পণ্যের পর্যাপ্ত স্টক নেই (মওজুদ আছে: ${dbProduct.stock})`,
      };
    }

    // Determine authentic verified price
    const currentPrice = dbProduct.salePrice || dbProduct.price;
    calculatedSubtotal += currentPrice * item.quantity;

    verifiedItems.push({
      ...item,
      price: currentPrice,
      nameBn: dbProduct.nameBn,
      nameEn: dbProduct.nameEn,
      image: dbProduct.images[0]?.url || item.image,
    });
  }

  // Delivery charge calculation
  let deliveryCharge = orderData.deliveryCharge;
  const isSylhet = orderData.shippingAddress.district.toLowerCase().includes('sylhet') ||
                   orderData.shippingAddress.district.includes('সিলেট');
  const isDhaka = orderData.shippingAddress.district.toLowerCase().includes('dhaka') ||
                  orderData.shippingAddress.district.includes('ঢাকা');

  if (calculatedSubtotal >= settings.freeDeliveryThreshold) {
    deliveryCharge = 0;
  } else if (isSylhet) {
    deliveryCharge = settings.deliveryCharges.insideSylhet || 50;
  } else if (isDhaka) {
    deliveryCharge = settings.deliveryCharges.insideDhaka || 80;
  } else {
    deliveryCharge = settings.deliveryCharges.outsideDhaka || 130;
  }

  // Coupon validation
  let discount = 0;
  if (orderData.couponCode) {
    const coupon = await validateCouponCode(orderData.couponCode, calculatedSubtotal);
    if (coupon.valid) {
      discount = coupon.discountAmount;
    }
  }

  const grandTotal = Math.max(0, calculatedSubtotal - discount + deliveryCharge);
  const now = new Date().toISOString();
  const orderNumber = `PG-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const orderId = `ord-${Date.now()}`;

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    orderNumber,
    items: verifiedItems,
    subtotal: calculatedSubtotal,
    discount,
    deliveryCharge,
    grandTotal,
    orderStatus: 'Pending',
    paymentStatus: orderData.paymentStatus || 'Pending',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: now,
        note: 'অর্ডারটি সফলভাবে জমা হয়েছে।',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  // Atomically decrease stock and save order
  try {
    await runTransaction(db, async (transaction) => {
      // 1. Check & decrease product stocks
      for (const item of verifiedItems) {
        const prodRef = doc(db, 'products', item.productId);
        const prodDoc = await transaction.get(prodRef);
        if (prodDoc.exists()) {
          const currentStock = prodDoc.data().stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          transaction.update(prodRef, { stock: newStock, updatedAt: now });
        }
      }

      // 2. Save order
      const orderRef = doc(db, 'orders', orderId);
      transaction.set(orderRef, newOrder);
    });
  } catch (err) {
    console.warn('Firestore transaction fallback to local update:', err);
    // Update local products stock
    const updatedProducts = allProducts.map((p) => {
      const orderedItem = verifiedItems.find((vi) => vi.productId === p.id);
      if (orderedItem) {
        return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
      }
      return p;
    });
    setLocal(LOCAL_STORAGE_KEYS.PRODUCTS, updatedProducts);
  }

  // Update local orders list
  const currentOrders = getLocal<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
  setLocal(LOCAL_STORAGE_KEYS.ORDERS, [newOrder, ...currentOrders]);

  return { success: true, order: newOrder };
}

export async function getOrders(): Promise<Order[]> {
  try {
    const col = collection(db, 'orders');
    const q = query(col, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      setLocal(LOCAL_STORAGE_KEYS.ORDERS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore orders read fallback:', err);
  }
  return getLocal(LOCAL_STORAGE_KEYS.ORDERS, []);
}

export async function updateOrderStatus(orderId: string, newStatus: Order['orderStatus'], note?: string, userEmail?: string): Promise<Order | null> {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const targetOrder = { ...orders[index] };
  targetOrder.orderStatus = newStatus;
  targetOrder.updatedAt = now;
  targetOrder.statusHistory = [
    ...targetOrder.statusHistory,
    {
      status: newStatus,
      timestamp: now,
      note: note || `অর্ডারের অবস্থা পরিবর্তিত হয়েছে: ${newStatus}`,
      updatedBy: userEmail || 'admin',
    },
  ];

  orders[index] = targetOrder;
  setLocal(LOCAL_STORAGE_KEYS.ORDERS, orders);

  try {
    await updateDoc(doc(db, 'orders', orderId), {
      orderStatus: newStatus,
      updatedAt: now,
      statusHistory: targetOrder.statusHistory,
    });
    await addAuditLog({
      action: 'UPDATE_ORDER_STATUS',
      collection: 'orders',
      documentId: orderId,
      performedBy: userEmail || 'admin',
      details: { newStatus, note },
    });
  } catch (err) {
    console.warn('Firestore updateOrderStatus fallback:', err);
  }

  return targetOrder;
}

export async function getOrderByNumberOrPhone(searchQuery: string): Promise<Order[]> {
  const orders = await getOrders();
  const clean = searchQuery.trim().toLowerCase();
  return orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(clean) ||
      o.shippingAddress.phoneNumber.includes(clean) ||
      o.id.toLowerCase().includes(clean)
  );
}

// ----------------- BANNERS -----------------
export async function getBanners(activeOnly = true): Promise<Banner[]> {
  try {
    const q = query(collection(db, 'banners'), orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner));
      setLocal(LOCAL_STORAGE_KEYS.BANNERS, list);
      return activeOnly ? list.filter((b) => b.isActive) : list;
    }
  } catch (err) {
    console.warn('Firestore banners read fallback:', err);
  }
  const cached = getLocal(LOCAL_STORAGE_KEYS.BANNERS, initialBanners);
  return activeOnly ? cached.filter((b) => b.isActive) : cached;
}

export async function saveBanner(banner: Banner, userEmail?: string): Promise<Banner> {
  const currentList = await getBanners(false);
  const index = currentList.findIndex((b) => b.id === banner.id);
  let updatedList: Banner[];
  if (index >= 0) {
    updatedList = [...currentList];
    updatedList[index] = banner;
  } else {
    updatedList = [...currentList, banner];
  }
  setLocal(LOCAL_STORAGE_KEYS.BANNERS, updatedList);

  try {
    await setDoc(doc(db, 'banners', banner.id), banner, { merge: true });
    await addAuditLog({
      action: index >= 0 ? 'UPDATE_BANNER' : 'CREATE_BANNER',
      collection: 'banners',
      documentId: banner.id,
      performedBy: userEmail || 'admin',
    });
  } catch (err) {
    console.warn('Firestore saveBanner fallback:', err);
  }
  return banner;
}

export async function deleteBanner(bannerId: string, userEmail?: string): Promise<boolean> {
  const currentList = await getBanners(false);
  const updatedList = currentList.filter((b) => b.id !== bannerId);
  setLocal(LOCAL_STORAGE_KEYS.BANNERS, updatedList);

  try {
    await deleteDoc(doc(db, 'banners', bannerId));
    await addAuditLog({
      action: 'DELETE_BANNER',
      collection: 'banners',
      documentId: bannerId,
      performedBy: userEmail || 'admin',
    });
  } catch (err) {
    console.warn('Firestore deleteBanner fallback:', err);
  }
  return true;
}

// ----------------- COUPONS -----------------
export async function getCoupons(): Promise<Coupon[]> {
  try {
    const snap = await getDocs(collection(db, 'coupons'));
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon));
      setLocal(LOCAL_STORAGE_KEYS.COUPONS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore coupons fallback:', err);
  }
  return getLocal(LOCAL_STORAGE_KEYS.COUPONS, initialCoupons);
}

export async function validateCouponCode(code: string, subtotal: number): Promise<{ valid: boolean; message: string; discountAmount: number; coupon?: Coupon }> {
  const coupons = await getCoupons();
  const cleanCode = code.trim().toUpperCase();
  const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

  if (!coupon) {
    return { valid: false, message: 'কুপন কোডটি সঠিক নয় অথবা মেয়াদোত্তীর্ণ।', discountAmount: 0 };
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, message: 'এই কুপন কোডের মেয়াদ শেষ হয়ে গেছে।', discountAmount: 0 };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `এই কুপন ব্যবহারের জন্য সর্বনিম্ন ৳${coupon.minOrderAmount} টাকার অর্ডার প্রয়োজন।`,
      discountAmount: 0,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.value;
  }

  return {
    valid: true,
    message: `কুপন সফলভাবে প্রয়োগ হয়েছে! আপনি ৳${discount} ছাড় পেয়েছেন।`,
    discountAmount: Math.min(discount, subtotal),
    coupon,
  };
}

export async function saveCoupon(coupon: Coupon, userEmail?: string): Promise<Coupon> {
  const currentList = await getCoupons();
  const index = currentList.findIndex((c) => c.id === coupon.id);
  let updatedList: Coupon[];
  if (index >= 0) {
    updatedList = [...currentList];
    updatedList[index] = coupon;
  } else {
    updatedList = [...currentList, coupon];
  }
  setLocal(LOCAL_STORAGE_KEYS.COUPONS, updatedList);

  try {
    await setDoc(doc(db, 'coupons', coupon.id), coupon, { merge: true });
    await addAuditLog({
      action: index >= 0 ? 'UPDATE_COUPON' : 'CREATE_COUPON',
      collection: 'coupons',
      documentId: coupon.id,
      performedBy: userEmail || 'admin',
    });
  } catch (err) {
    console.warn('Firestore saveCoupon fallback:', err);
  }
  return coupon;
}

export async function deleteCoupon(couponId: string, userEmail?: string): Promise<boolean> {
  const currentList = await getCoupons();
  const updatedList = currentList.filter((c) => c.id !== couponId);
  setLocal(LOCAL_STORAGE_KEYS.COUPONS, updatedList);

  try {
    await deleteDoc(doc(db, 'coupons', couponId));
    await addAuditLog({
      action: 'DELETE_COUPON',
      collection: 'coupons',
      documentId: couponId,
      performedBy: userEmail || 'admin',
    });
  } catch (err) {
    console.warn('Firestore deleteCoupon fallback:', err);
  }
  return true;
}

// ----------------- REVIEWS -----------------
export async function getReviews(productId?: string, approvedOnly = true): Promise<Review[]> {
  try {
    const snap = await getDocs(collection(db, 'reviews'));
    if (!snap.empty) {
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
      setLocal(LOCAL_STORAGE_KEYS.REVIEWS, list);
      if (approvedOnly) list = list.filter((r) => r.status === 'approved');
      if (productId) list = list.filter((r) => r.productId === productId);
      return list;
    }
  } catch (err) {
    console.warn('Firestore reviews fallback:', err);
  }
  let cached = getLocal<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS, initialReviews);
  if (approvedOnly) cached = cached.filter((r) => r.status === 'approved');
  if (productId) cached = cached.filter((r) => r.productId === productId);
  return cached;
}

export async function submitCustomerReview(review: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<Review> {
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    status: 'approved', // Auto-approved for verified smooth experience or can be pending
    createdAt: new Date().toISOString(),
  };

  const current = getLocal<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS, initialReviews);
  setLocal(LOCAL_STORAGE_KEYS.REVIEWS, [newReview, ...current]);

  try {
    await setDoc(doc(db, 'reviews', newReview.id), newReview);
  } catch (err) {
    console.warn('Firestore submitReview fallback:', err);
  }
  return newReview;
}

export async function updateReviewStatus(reviewId: string, status: Review['status'], userEmail?: string): Promise<boolean> {
  const list = await getReviews(undefined, false);
  const target = list.find((r) => r.id === reviewId);
  if (!target) return false;
  target.status = status;
  setLocal(LOCAL_STORAGE_KEYS.REVIEWS, list);

  try {
    await updateDoc(doc(db, 'reviews', reviewId), { status });
    await addAuditLog({
      action: 'UPDATE_REVIEW_STATUS',
      collection: 'reviews',
      documentId: reviewId,
      performedBy: userEmail || 'admin',
      details: { newStatus: status },
    });
  } catch (err) {
    console.warn('Firestore updateReviewStatus fallback:', err);
  }
  return true;
}

export async function deleteReview(reviewId: string, userEmail?: string): Promise<boolean> {
  const list = await getReviews(undefined, false);
  const filtered = list.filter((r) => r.id !== reviewId);
  setLocal(LOCAL_STORAGE_KEYS.REVIEWS, filtered);

  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
    await addAuditLog({
      action: 'DELETE_REVIEW',
      collection: 'reviews',
      documentId: reviewId,
      performedBy: userEmail || 'admin',
    });
  } catch (err) {
    console.warn('Firestore deleteReview fallback:', err);
  }
  return true;
}

// ----------------- FAQS -----------------
export async function getFAQs(): Promise<FAQ[]> {
  try {
    const q = query(collection(db, 'faqs'), orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FAQ));
      setLocal(LOCAL_STORAGE_KEYS.FAQS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore FAQs fallback:', err);
  }
  return getLocal(LOCAL_STORAGE_KEYS.FAQS, initialFAQs);
}

export async function saveFAQ(faq: FAQ, userEmail?: string): Promise<FAQ> {
  const currentList = await getFAQs();
  const index = currentList.findIndex((f) => f.id === faq.id);
  let updatedList: FAQ[];
  if (index >= 0) {
    updatedList = [...currentList];
    updatedList[index] = faq;
  } else {
    updatedList = [...currentList, faq];
  }
  setLocal(LOCAL_STORAGE_KEYS.FAQS, updatedList);

  try {
    await setDoc(doc(db, 'faqs', faq.id), faq, { merge: true });
    await addAuditLog({
      action: index >= 0 ? 'UPDATE_FAQ' : 'CREATE_FAQ',
      collection: 'faqs',
      documentId: faq.id,
      performedBy: userEmail || 'admin',
    });
  } catch (err) {
    console.warn('Firestore saveFAQ fallback:', err);
  }
  return faq;
}

export async function deleteFAQ(faqId: string, userEmail?: string): Promise<boolean> {
  const currentList = await getFAQs();
  const updatedList = currentList.filter((f) => f.id !== faqId);
  setLocal(LOCAL_STORAGE_KEYS.FAQS, updatedList);

  try {
    await deleteDoc(doc(db, 'faqs', faqId));
    await addAuditLog({
      action: 'DELETE_FAQ',
      collection: 'faqs',
      documentId: faqId,
      performedBy: userEmail || 'admin',
    });
  } catch (err) {
    console.warn('Firestore deleteFAQ fallback:', err);
  }
  return true;
}

// ----------------- AUDIT LOGS -----------------
export async function addAuditLog(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
  const log: AuditLog = {
    ...logData,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };

  const logs = getLocal<AuditLog[]>(LOCAL_STORAGE_KEYS.AUDIT, []);
  setLocal(LOCAL_STORAGE_KEYS.AUDIT, [log, ...logs.slice(0, 100)]);

  try {
    await setDoc(doc(db, 'auditLogs', log.id), log);
  } catch (err) {
    // Non-blocking
  }
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(50));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditLog));
    }
  } catch (err) {
    // fallback
  }
  return getLocal<AuditLog[]>(LOCAL_STORAGE_KEYS.AUDIT, []);
}
