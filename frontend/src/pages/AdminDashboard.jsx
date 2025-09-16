import React, { useState, useContext } from 'react';
import { createProduct } from '../api/productService';
import { getAllCarts } from '../api/cartService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AdminDashboard(){
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ 
    title:'', 
    description:'', 
    price:'', 
    imageUrl:'',
    category: 'tshirt',
    size: ['S', 'M', 'L', 'XL'],
    color: '',
    stock: 0
  });
  const [carts, setCarts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setForm({ ...form, imageUrl: url });
    setImagePreview(url);
    setImageFile(null);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + user.token
        },
        body: formData
      });
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let productData = { ...form };
      
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        productData.imageUrl = uploadedUrl;
      }

      await createProduct(productData, user.token);
      toast.success('Product added successfully!');
      
      // Reset form
      setForm({ 
        title: '', 
        description: '', 
        price: '', 
        imageUrl: '',
        category: 'tshirt',
        size: ['S', 'M', 'L', 'XL'],
        color: '',
        stock: 0
      });
      setImagePreview('');
      setImageFile(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  }

  const fetchCarts = async ()=>{
    try{
      const { data } = await getAllCarts(user.token);
      setCarts(data);
      toast.success('Cart data refreshed');
    }catch(e){ 
      toast.error('Failed to fetch cart data');
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {!user ? <div>Please login as admin.</div> : (
        <div className="grid md:grid-cols-2 gap-6">
          <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={submit}>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h3>
            
            {/* Image Preview Section */}
            <div className="mb-6">
              <div className={`border-2 border-dashed rounded-lg p-4 text-center 
                ${imagePreview ? 'border-green-500' : 'border-gray-300'} 
                hover:border-indigo-500 transition-colors`}>
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setForm({...form, imageUrl: ''});
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-500">Drag and drop or click to upload</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    placeholder="Or paste image URL"
                    value={form.imageUrl}
                    onChange={handleImageUrlChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  required 
                  value={form.title} 
                  onChange={e=>setForm({...form,title:e.target.value})}
                  placeholder="Product Title"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input 
                    required
                    type="number"
                    value={form.price} 
                    onChange={e=>setForm({...form,price:e.target.value})}
                    placeholder="Price"
                    min="0"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input 
                    type="number"
                    value={form.stock} 
                    onChange={e=>setForm({...form,stock:e.target.value})}
                    placeholder="Available Stock"
                    min="0"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={form.category}
                  onChange={e=>setForm({...form,category:e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="tshirt">T-Shirt</option>
                  <option value="shirt">Shirt</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="sweater">Sweater</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input 
                  type="text"
                  value={form.color} 
                  onChange={e=>setForm({...form,color:e.target.value})}
                  placeholder="Product Color"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  required
                  value={form.description} 
                  onChange={e=>setForm({...form,description:e.target.value})}
                  placeholder="Product Description"
                  rows="4"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium
                  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
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
