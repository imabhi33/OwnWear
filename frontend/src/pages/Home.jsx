import React, { useEffect, useState, useContext } from 'react';
import { getProducts } from '../api/productService';
import { addToCart } from '../api/cartService';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

export default function Home(){
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(()=> {
    fetchProducts();
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.on('productAdded', (p)=> setProducts(prev => [p, ...prev]));
    return ()=> socket.disconnect();
  },[]);

  const fetchProducts = async ()=> {
    try{
      const { data } = await getProducts();
      setProducts(data);
    }catch(e){ console.error(e) }
  }

  const handleAdd = async (p)=>{
    if(!user){ return alert('Login to add'); }
    try{
      await addToCart({ productId: p._id, qty:1 }, user.token);
      alert('Added to cart');
    }catch(e){ alert('Error adding') }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Shirts & T-Shirts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p=> <ProductCard key={p._id} p={p} onAdd={handleAdd} />)}
      </div>
    </div>
  )
}
