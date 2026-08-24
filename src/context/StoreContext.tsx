import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StoreSettings,
  Category,
  Product,
  Banner,
  FAQ,
  Review,
  AdminUser,
  Order,
  Coupon,
  AuditLog,
} from '../types';
import {
  getStoreSettings,
  updateStoreSettings,
  getCategories,
  getProducts,
  getBanners,
  getFAQs,
  getReviews,
  getOrders,
  getCoupons,
  getAuditLogs,
  seedInitialDatabase,
} from '../services/db';
import { getCachedAdmin, logoutUser } from '../services/auth';
import { initialSettings } from '../services/seedData';

interface StoreContextType {
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
  banners: Banner[];
  faqs: FAQ[];
  reviews: Review[];
  orders: Order[];
  coupons: Coupon[];
  auditLogs: AuditLog[];
  adminUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  setAdminUser: (admin: AdminUser | null) => void;
  logoutAdmin: () => Promise<void>;
  seedDemoData: (force?: boolean) => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(getCachedAdmin());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        fetchedSettings,
        fetchedCategories,
        fetchedProducts,
        fetchedBanners,
        fetchedFaqs,
        fetchedReviews,
        fetchedOrders,
        fetchedCoupons,
        fetchedAudit,
      ] = await Promise.all([
        getStoreSettings(),
        getCategories(),
        getProducts(false),
        getBanners(false),
        getFAQs(),
        getReviews(undefined, false),
        getOrders(),
        getCoupons(),
        getAuditLogs(),
      ]);

      setSettings(fetchedSettings);
      setCategories(fetchedCategories);
      setProducts(fetchedProducts);
      setBanners(fetchedBanners);
      setFaqs(fetchedFaqs);
      setReviews(fetchedReviews);
      setOrders(fetchedOrders);
      setCoupons(fetchedCoupons);
      setAuditLogs(fetchedAudit);
    } catch (err: any) {
      console.error('Failed to load store data:', err);
      setError('স্টোর ডাটা লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUpdateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = await updateStoreSettings(newSettings, adminUser?.email);
    setSettings(updated);
  };

  const handleLogout = async () => {
    await logoutUser();
    setAdminUser(null);
  };

  const handleSeedDemoData = async (force = false) => {
    const result = await seedInitialDatabase(force);
    await loadAllData();
    return result;
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        categories,
        products,
        banners,
        faqs,
        reviews,
        orders,
        coupons,
        auditLogs,
        adminUser,
        isLoading,
        error,
        refreshData: loadAllData,
        updateSettings: handleUpdateSettings,
        setAdminUser,
        logoutAdmin: handleLogout,
        seedDemoData: handleSeedDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
