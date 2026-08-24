import React from 'react';
import { HeroSection } from '../../components/public/HeroSection';
import { TrustStrip } from '../../components/common/TrustStrip';
import { CategoryTiles } from '../../components/public/CategoryTiles';
import { SpecialOffers } from '../../components/public/SpecialOffers';
import { ProductGridSection } from '../../components/public/ProductGridSection';
import { QualityPromiseSection } from '../../components/public/QualityPromiseSection';
import { ReviewsSection } from '../../components/public/ReviewsSection';
import { FAQSection } from '../../components/public/FAQSection';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      <HeroSection onNavigate={onNavigate} />
      <TrustStrip />
      <CategoryTiles onNavigate={onNavigate} />
      <SpecialOffers onNavigate={onNavigate} />
      <ProductGridSection onNavigate={onNavigate} />
      <QualityPromiseSection onNavigate={onNavigate} />
      <ReviewsSection />
      <FAQSection />
    </div>
  );
};
