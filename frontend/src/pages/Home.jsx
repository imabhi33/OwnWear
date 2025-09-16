import React, { useEffect, useState, useContext } from 'react';
import { getProducts } from '../api/productService';
import { addToCart } from '../api/cartService';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

export default function Home(){
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);

  const handleDelete = (deletedId) => {
    setProducts(prev => prev.filter(p => p._id !== deletedId));
  };

  useEffect(() => {
    fetchProducts();
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.on('productAdded', (p) => setProducts(prev => [p, ...prev]));
    socket.on('productDeleted', (id) => handleDelete(id));
    return () => socket.disconnect();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data);
    } catch (e) {
      toast.error('Failed to fetch products');
      console.error(e);
    }
  };

  const handleAdd = async (p) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart({ productId: p._id, qty: 1 }, user.token);
      toast.success(`${p.title} added to cart!`);
    } catch (e) {
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Shirts & T-Shirts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p=> (
          <ProductCard 
            key={p._id} 
            p={p} 
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}