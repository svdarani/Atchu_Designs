import React, { createContext, useContext, useState, useEffect } from 'react';
import { SEED_PRODUCTS } from '../data/seedProducts';
import { SEED_CATEGORIES } from '../data/seedCategories';
import { DEFAULT_CONFIG } from '../data/customizationOptions';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Products list in memory with localStorage persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('atchu_products');
      return saved ? JSON.parse(saved) : SEED_PRODUCTS;
    } catch {
      return SEED_PRODUCTS;
    }
  });

  const [categories] = useState(SEED_CATEGORIES);

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('atchu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('atchu_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeWorkType, setActiveWorkType] = useState('all');

  // Customer Measurement Profiles (saved locally)
  const [measurementProfiles, setMeasurementProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('atchu_measurements');
      return saved ? JSON.parse(saved) : [
        {
          id: 'prof-default',
          name: 'My Bridal Fit (Standard 36)',
          unit: 'inches',
          bust: '36',
          underBust: '30',
          waist: '30',
          shoulder: '14.5',
          armhole: '16',
          sleeveLength: '10.5',
          sleeveRound: '11',
          blouseLength: '14',
          frontNeck: '7',
          backNeck: '9.5',
          date: '2026-09-01'
        }
      ];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('atchu_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('atchu_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('atchu_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('atchu_measurements', JSON.stringify(measurementProfiles));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [measurementProfiles]);

  // Cart operations
  const addToCart = (product, customization, measurements, unitPrice, quantity = 1) => {
    const cartItemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newItem = {
      cartItemId,
      product,
      customization,
      measurements,
      unitPrice,
      quantity,
      addedAt: new Date().toISOString()
    };
    setCart((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Wishlist toggle
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.some((p) => p.id === productId);

  // Measurements Profiles
  const saveMeasurementProfile = (profile) => {
    const newProfile = {
      ...profile,
      id: profile.id || `prof-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setMeasurementProfiles((prev) => {
      const exists = prev.some((p) => p.id === newProfile.id);
      if (exists) {
        return prev.map((p) => (p.id === newProfile.id ? newProfile : p));
      }
      return [newProfile, ...prev];
    });
    return newProfile;
  };

  // Admin Product Creation & Editing
  const addProduct = (newProd) => {
    const item = {
      ...newProd,
      id: `prod-${Date.now()}`,
      sku: `ATC-${newProd.category ? newProd.category.substring(0, 2).toUpperCase() : 'CU'}-${Math.floor(10 + Math.random() * 90)}`,
      rating: 5.0,
      reviewsCount: 1
    };
    setProducts((prev) => [item, ...prev]);
    return item;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        cartSubtotal,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        activeWorkType,
        setActiveWorkType,
        measurementProfiles,
        saveMeasurementProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        config: DEFAULT_CONFIG
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
