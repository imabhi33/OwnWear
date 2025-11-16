import axios from 'axios';
import { getAuthConfig } from './authService';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/wishlist`;

// Get user's wishlist
export const getWishlist = async () => {
  const config = getAuthConfig();
  return await axios.get(API_URL, config);
};

// Add item to wishlist
export const addToWishlist = async (productId) => {
  const config = getAuthConfig();
  return await axios.post(API_URL, { productId }, config);
};

// Remove item from wishlist
export const removeFromWishlist = async (wishlistItemId) => {
  const config = getAuthConfig();
  return await axios.delete(`${API_URL}/${wishlistItemId}`, config);
};

// Toggle wishlist (add/remove)
export const toggleWishlist = async (productId) => {
  const config = getAuthConfig();
  return await axios.post(`${API_URL}/toggle`, { productId }, config);
};
