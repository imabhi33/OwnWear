import React, { useEffect, useState, useContext } from 'react';
import { getMyCart } from '../api/cartService';
import { AuthContext } from '../context/AuthContext';

export default function CartPage(){
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(()=> {
    if(user) fetchCart();
  },[user]);

  const fetchCart = async ()=>{
    try{
      const { data } = await getMyCart(user.token);
      setItems(data);
    }catch(e){ console.error(e) }
  }

  if(!user) return <div className="mt-8">Please login to see cart.</div>

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-3">
        {items.map(it=> (
          <div key={it._id} className="p-3 bg-white rounded shadow flex items-center gap-4">
            <img src={it.product.imageUrl||'/placeholder.png'} className="w-24 h-24 object-contain"/>
            <div>
              <div className="font-semibold">{it.product.title}</div>
              <div>Qty: {it.qty}</div>
              <div className="font-bold mt-1">₹{it.product.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
