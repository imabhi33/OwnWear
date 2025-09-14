import api from './apiService';
export const getProducts = ()=> api.get('/products');
export const createProduct = (data, token)=> api.post('/products', data, { headers: { Authorization: 'Bearer '+token }});
