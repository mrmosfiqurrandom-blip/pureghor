import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';

// Common Public Layout Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ShopPage } from './pages/public/ShopPage';
import { CategoryPage } from './pages/public/CategoryPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { OrderConfirmationPage } from './pages/public/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/public/OrderTrackingPage';
import { AboutUsPage } from './pages/public/AboutUsPage';
import { QualityPromisePage } from './pages/public/QualityPromisePage';
import { DeliveryReturnPolicyPage } from './pages/public/DeliveryReturnPolicyPage';
import { ContactUsPage } from './pages/public/ContactUsPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSetupWizard } from './pages/admin/AdminSetupWizard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminBanners } from './pages/admin/AdminBanners';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminMediaLibrary } from './pages/admin/AdminMediaLibrary';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

// Inner App Content with State-Based Routing
const MainAppContent: React.FC = () => {
  const { adminUser } = useStore();

  // State router
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [navData, setNavData] = useState<any>(null);
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, data?: any) => {
    setCurrentPath(path);
    setNavData(data);
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching
  const isAdminRoute = currentPath.startsWith('/admin');

  // Render Admin Section
  if (isAdminRoute) {
    if (!adminUser) {
      return (
        <AdminLoginPage
          onSuccess={() => navigate('/admin')}
          onNavigatePublic={() => navigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onNavigatePublic={(p) => navigate(p)}
      >
        {adminTab === 'dashboard' && <AdminDashboard onSelectTab={setAdminTab} />}
        {adminTab === 'wizard' && <AdminSetupWizard />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'banners' && <AdminBanners />}
        {adminTab === 'coupons' && <AdminCoupons />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'media' && <AdminMediaLibrary />}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'audit' && <AdminAuditLogs />}
      </AdminLayout>
    );
  }

  // Render Public Section
  const renderPublicPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }
    if (currentPath === '/shop') {
      return <ShopPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '');
      return <CategoryPage slug={slug} onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }
    if (currentPath === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/order-confirmation/')) {
      const orderNumber = currentPath.replace('/order-confirmation/', '');
      return (
        <OrderConfirmationPage
          orderNumber={orderNumber}
          order={navData}
          onNavigate={navigate}
        />
      );
    }
    if (currentPath === '/track-order') {
      return <OrderTrackingPage onNavigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <AboutUsPage />;
    }
    if (currentPath === '/quality-promise') {
      return <QualityPromisePage />;
    }
    if (currentPath === '/delivery-returns') {
      return <DeliveryReturnPolicyPage />;
    }
    if (currentPath === '/contact') {
      return <ContactUsPage />;
    }

    // Default fallback
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5FBF2] text-[#102B16] font-['Hind_Siliguri'] selection:bg-[#5EB809]/25 selection:text-[#004F18]">
      <Navbar onNavigate={navigate} currentPath={currentPath} />
      <main className="flex-1">{renderPublicPage()}</main>
      <Footer onNavigate={navigate} />
      <CartDrawer onNavigate={navigate} />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </StoreProvider>
  );
}
