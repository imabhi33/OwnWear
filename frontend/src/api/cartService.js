import api from './apiService';
export const addToCart = (data, token)=> api.post('/cart/add', data, { headers: { Authorization: 'Bearer '+token }});
export const getMyCart = (token)=> api.get('/cart/me', { headers: { Authorization: 'Bearer '+token }});
export const getAllCarts = (token)=> api.get('/cart/all', { headers: { Authorization: 'Bearer '+token }});
export const removeFromCart = (cartItemId, token)=> api.delete(`/cart/remove/${cartItemId}`, { headers: { Authorization: 'Bearer '+token }});
