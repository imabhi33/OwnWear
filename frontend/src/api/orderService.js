import axios from 'axios';
import { getAuthConfig } from './authService';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/orders`;

// Create new order
export const createOrder = async (orderData) => {
  const config = getAuthConfig();
  return await axios.post(API_URL, orderData, config);
};

// Get user's orders
export const getMyOrders = async () => {
  const config = getAuthConfig();
  return await axios.get(API_URL, config);
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const config = getAuthConfig();
  return await axios.get(`${API_URL}/${orderId}`, config);
};

// Cancel order
export const cancelOrder = async (orderId) => {
  const config = getAuthConfig();
  return await axios.put(`${API_URL}/${orderId}/cancel`, {}, config);
};
