import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { getMyCart } from '../api/cartService';
import { getWishlist } from '../api/wishlistService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCounts = async () => {
    if (!user) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    try {
      const [cartRes, wishlistRes] = await Promise.all([
        getMyCart(user.token),
        getWishlist()
      ]);
      setCartCount(cartRes.data.length);
      setWishlistCount(wishlistRes.data.length);
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    }
  };

  useEffect(() => {
    refreshCounts();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, wishlistCount, refreshCounts }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
