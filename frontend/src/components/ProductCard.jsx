import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { deleteProduct } from '../api/productService';
import { toast } from 'sonner';
import ConfirmModal from './ConfirmModal';

export default function ProductCard({p, onAdd, onDelete}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const handleDelete = async () => {
    try {
      await deleteProduct(p._id, user.token);
      toast.success('Product deleted successfully');
      onDelete && onDelete(p._id);
      setShowDeleteModal(false);
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <>
      <div className="bg-white rounded shadow p-4 hover:shadow-lg transition">
        <div className="h-48 flex items-center justify-center">
          <img src={p.imageUrl || '/placeholder.png'} alt={p.title} className="max-h-40"/>
        </div>
        <h3 className="font-semibold mt-2">{p.title}</h3>
        <p className="text-sm text-gray-600">{p.description}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="font-bold">₹{p.price}</div>
          <div className="flex gap-2">
            <button 
              onClick={()=>onAdd(p)} 
              className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Add
            </button>
            {isAdmin && (
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${p.title}"? This action cannot be undone.`}
      />
    </>
  );
}