import api from './apiService';
export const getProducts = ()=> api.get('/products');
export const createProduct = (data, token)=> api.post('/products', data, { headers: { Authorization: 'Bearer '+token }});
export const deleteProduct = (id, token)=> api.delete(`/products/${id}`, { headers: { Authorization: 'Bearer '+token }});
