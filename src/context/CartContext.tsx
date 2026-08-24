import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem, Product, Coupon } from '../types';
import { useStore } from './StoreContext';
import { validateCouponCode } from '../services/db';

interface CartItem extends OrderItem {}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  grandTotal: number;
  appliedCoupon: Coupon | null;
  couponMessage: string | null;
  selectedDistrict: string;
  isCartDrawerOpen: boolean;
  addToCart: (product: Product, quantity?: number, selectedWeight?: { weight: number; unit: string; price: number; salePrice?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  setSelectedDistrict: (district: string) => void;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
}

const CART_STORAGE_KEY = 'pg_cart_items';
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useStore();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Sylhet');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Delivery charge calculation
  let deliveryCharge = 0;
  if (items.length > 0) {
    if (subtotal >= (settings?.freeDeliveryThreshold || 2000)) {
      deliveryCharge = 0;
    } else {
      const isSylhet = selectedDistrict.toLowerCase().includes('sylhet') || selectedDistrict.includes('সিলেট');
      const isDhaka = selectedDistrict.toLowerCase().includes('dhaka') || selectedDistrict.includes('ঢাকা');

      if (isSylhet) {
        deliveryCharge = settings?.deliveryCharges?.insideSylhet ?? 50;
      } else if (isDhaka) {
        deliveryCharge = settings?.deliveryCharges?.insideDhaka ?? 80;
      } else {
        deliveryCharge = settings?.deliveryCharges?.outsideDhaka ?? 130;
      }
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedWeight?: { weight: number; unit: string; price: number; salePrice?: number }
  ) => {
    const itemPrice = selectedWeight ? (selectedWeight.salePrice || selectedWeight.price) : (product.salePrice || product.price);
    const itemWeight = selectedWeight ? selectedWeight.weight : product.weight;
    const itemUnit = selectedWeight ? selectedWeight.unit : product.unit;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.productId === product.id);
      if (existingIndex >= 0) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        // Limit to available stock
        if (newQty > product.stock) {
          alert(`দুঃখিত! এই পণ্যের সর্বোচ্চ ${product.stock} টি মওজুদ আছে।`);
          return prevItems;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            productId: product.id,
            nameBn: product.nameBn,
            nameEn: product.nameEn,
            price: itemPrice,
            quantity: Math.min(quantity, product.stock),
            weight: itemWeight,
            unit: itemUnit,
            image: product.images[0]?.url || '',
            selectedWeightOption: `${itemWeight} ${itemUnit}`,
          },
        ];
      }
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponMessage(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    const result = await validateCouponCode(code, subtotal);
    setCouponMessage(result.message);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setDiscountAmount(result.discountAmount);
      return true;
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponMessage(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount: discountAmount,
        deliveryCharge,
        grandTotal,
        appliedCoupon,
        couponMessage,
        selectedDistrict,
        isCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setSelectedDistrict,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
