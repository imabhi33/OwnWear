import React, { useState, useContext } from 'react';
import { createProduct } from '../api/productService';
import { getAllCarts } from '../api/cartService';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard(){
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title:'', description:'', price:'', imageUrl:'' });
  const [carts, setCarts] = useState([]);

  const submit = async (e)=>{
    e.preventDefault();
    try{
      await createProduct(form, user.token);
      alert('Product added');
    }catch(err){ alert(err?.response?.data?.message || 'Error'); }
  }

  const fetchCarts = async ()=>{
    try{
      const { data } = await getAllCarts(user.token);
      setCarts(data);
    }catch(e){ alert('Error') }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {!user ? <div>Please login as admin.</div> : (
        <div className="grid md:grid-cols-2 gap-6">
          <form className="bg-white p-4 rounded shadow" onSubmit={submit}>
            <h3 className="font-semibold mb-2">Add Product</h3>
            <input className="w-full p-2 border rounded mb-2" placeholder="Title" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            <input className="w-full p-2 border rounded mb-2" placeholder="Image URL" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})}/>
            <input className="w-full p-2 border rounded mb-2" placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
            <textarea className="w-full p-2 border rounded mb-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded">Add</button>
          </form>

          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">User Carts</h3>
              <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={fetchCarts}>Refresh</button>
            </div>
            <div className="space-y-2">
              {carts.map(c=> (
                <div key={c._id} className="p-2 border rounded">
                  <div className="font-semibold">{c.user.name} ({c.user.email})</div>
                  <div>Product: {c.product.title} - Qty: {c.qty}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
