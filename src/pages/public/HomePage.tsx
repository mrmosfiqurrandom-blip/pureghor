import React from 'react';
import { HeroSection } from '../../components/public/HeroSection';
import { TrustStrip } from '../../components/common/TrustStrip';
import { CategoryTiles } from '../../components/public/CategoryTiles';
import { SpecialOffers } from '../../components/public/SpecialOffers';
import { ProductGridSection } from '../../components/public/ProductGridSection';
import { QualityPromiseSection } from '../../components/public/QualityPromiseSection';
import { StoreOutletsSection } from '../../components/public/StoreOutletsSection';
import { SourcingGallerySection } from '../../components/public/SourcingGallerySection';
import { ReviewsSection } from '../../components/public/ReviewsSection';
import { FAQSection } from '../../components/public/FAQSection';
import { VideoSection } from '../../components/public/VideoSection';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Promotional Slider & Value Offer */}
      <HeroSection onNavigate={onNavigate} />
      
      {/* 2. Trust Strip (100% Pure, COD, Safe Food Grade Packaging) */}
      <TrustStrip />
      
      {/* 3. Category Tiles */}
      <CategoryTiles onNavigate={onNavigate} />
      
      {/* 4. Special Offers & Biswanath 10% Discount Promo */}
      <SpecialOffers onNavigate={onNavigate} />
      
      {/* 5. Featured All Organic Products Grid */}
      <ProductGridSection onNavigate={onNavigate} />
      
      {/* 6. Quality Promise & Sourcing Transparency */}
      <QualityPromiseSection onNavigate={onNavigate} />
      
      {/* 7. Real Product & Sourcing Image Gallery with Zoom */}
      <SourcingGallerySection onNavigate={onNavigate} />
      
      {/* 8. Verified Customer Reviews & Testimonials */}
      <ReviewsSection />
      
      {/* 9. Frequently Asked Questions */}
      <FAQSection />

      {/* 10. Social Media Video Section */}
      <VideoSection onNavigate={onNavigate} />

      {/* 11. Physical Outlets at the VERY BOTTOM (Lalabazar Main Outlet & Biswanath Shopping City) */}
      <StoreOutletsSection onNavigate={onNavigate} />
    </div>
  );
};
