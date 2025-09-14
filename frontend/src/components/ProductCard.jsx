import React from 'react';

export default function ProductCard({p, onAdd}){
  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
      <div className="h-48 flex items-center justify-center">
        <img src={p.imageUrl || '/placeholder.png'} alt={p.title} className="max-h-40"/>
      </div>
      <h3 className="font-semibold mt-2">{p.title}</h3>
      <p className="text-sm text-gray-600">{p.description}</p>
      <div className="flex justify-between items-center mt-3">
        <div className="font-bold">₹{p.price}</div>
        <button onClick={()=>onAdd(p)} className="px-3 py-1 rounded bg-indigo-600 text-white">Add</button>
      </div>
    </div>
  )
}
