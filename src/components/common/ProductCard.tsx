import React, { useState } from 'react';
import { ShoppingBag, Star, Zap, Check } from 'lucide-react';
import { Product, ProductWeightOption } from '../../types';
import { useCart } from '../../context/CartContext';
import { PlaceholderImage } from './PlaceholderImage';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<ProductWeightOption | null>(
    product.weightOptions && product.weightOptions.length > 0 ? product.weightOptions[0] : null
  );
  const [isAdded, setIsAdded] = useState(false);

  const currentPrice = selectedWeight ? (selectedWeight.salePrice || selectedWeight.price) : (product.salePrice || product.price);
  const originalPrice = selectedWeight ? selectedWeight.price : product.price;
  const hasDiscount = (selectedWeight ? selectedWeight.salePrice : product.salePrice) && currentPrice < originalPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, selectedWeight || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, selectedWeight || undefined);
    onNavigate('/checkout');
  };

  return (
    <div
      onClick={() => onNavigate(`/product/${product.slug}`)}
      className="group relative bg-white rounded-2xl border border-[#DCECD5] hover:border-[#5EB809] hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Discount & Stock Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {hasDiscount && (
          <span className="bg-[#5EB809] text-white text-xs font-black px-2.5 py-1 rounded-md shadow-xs font-['Hind_Siliguri']">
            {discountPercent}% ছাড়
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-[#004F18] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            স্পেশাল
          </span>
        )}
      </div>

      {/* Stock Label (Top Right) */}
      <div className="absolute top-3 right-3 z-10">
        {isOutOfStock ? (
          <span className="bg-red-100 text-red-700 text-[11px] font-bold px-2 py-1 rounded-md border border-red-200">
            স্টক আউট
          </span>
        ) : isLowStock ? (
          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-1 rounded-md border border-amber-200">
            সীমিত স্টক ({product.stock})
          </span>
        ) : (
          <span className="bg-[#E8F8D8] text-[#004F18] text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#DCECD5]">
            ইন স্টক
          </span>
        )}
      </div>

      {/* Image Container with Consistent Aspect Ratio */}
      <div className="relative aspect-square w-full bg-[#F5FBF2] overflow-hidden">
        {product.images && product.images[0]?.url ? (
          <img
            src={resolveImageUrl(product.images[0].url)}
            alt={product.images[0].alt || product.nameBn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                target.src = DEFAULT_FALLBACK_IMAGE;
              }
            }}
          />
        ) : (
          <PlaceholderImage type="product" text={product.nameBn} />
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-[#E89D10]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-500">
              ({product.reviewCount || 12})
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-base text-[#004F18] line-clamp-2 leading-snug group-hover:text-[#5EB809] transition-colors font-['Hind_Siliguri']">
            {product.nameBn}
          </h3>

          {/* Short subtitle / weight */}
          <p className="text-xs text-[#102B16]/70 mt-1 line-clamp-1">
            {product.shortDescriptionBn}
          </p>

          {/* Weight selector pills if options exist */}
          {product.weightOptions && product.weightOptions.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-3" onClick={(e) => e.stopPropagation()}>
              {product.weightOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWeight(opt)}
                  className={`text-xs px-2 py-1 rounded-md border font-medium transition-all ${
                    selectedWeight?.sku === opt.sku || selectedWeight?.weight === opt.weight
                      ? 'border-[#004F18] bg-[#5EB809]/15 text-[#004F18] font-bold'
                      : 'border-[#DCECD5] bg-white text-[#102B16]/70 hover:border-[#004F18]'
                  }`}
                >
                  {opt.weight} {opt.unit}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Baseline */}
        <div className="mt-4 pt-3 border-t border-[#DCECD5]">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-[#004F18] font-['Hind_Siliguri']">
              ৳{currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ৳{originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] text-gray-500 ml-auto font-medium">
              /{selectedWeight ? `${selectedWeight.weight} ${selectedWeight.unit}` : `${product.weight} ${product.unit}`}
            </span>
          </div>

          {/* CTA Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-[#004F18] text-white'
                  : 'bg-[#F5FBF2] hover:bg-[#004F18] text-[#004F18] hover:text-white border border-[#004F18]/25'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-[#5EB809]" />
                  <span>যোগ হয়েছে</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>কার্ট</span>
                </>
              )}
            </button>

            <button
              onClick={handleQuickBuy}
              disabled={isOutOfStock}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#004F18] hover:bg-[#063B14] text-white shadow-xs active:scale-95'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current text-[#5EB809]" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
