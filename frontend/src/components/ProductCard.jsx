import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { deleteProduct } from '../api/productService';
import { toggleWishlist } from '../api/wishlistService';
import { toast } from 'sonner';
import ConfirmModal from './ConfirmModal';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function ProductCard({ p, onAdd, onDelete, onBuyNow }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useContext(AuthContext);
  const { refreshCounts } = useCart();
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

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      const { data } = await toggleWishlist(p._id);
      setIsWishlisted(data.inWishlist);
      toast.success(data.message);
      refreshCounts(); // Refresh wishlist count
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden card-hover">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <Link to={`/product/${p._id}`} className="block w-full h-full">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500"></div>
              </div>
            )}
            <img
              src={p.imageUrl || '/placeholder.png'}
              alt={p.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </Link>
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 pointer-events-auto">
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.preventDefault(); onAdd(p); }}
                  className="flex-1 bg-white text-teal-600 font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); handleToggleWishlist(); }}
                  className="bg-white p-2 rounded-lg hover:bg-red-50 transition-colors duration-300"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); onBuyNow && onBuyNow(p); }}
                className="w-full bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
            {p.stock < 10 && p.stock > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Only {p.stock} left
              </span>
            )}
            {p.stock === 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Admin Delete Button */}
          {isAdmin && (
            <button
              onClick={(e) => { e.preventDefault(); setShowDeleteModal(true); }}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 shadow-lg pointer-events-auto"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <Link to={`/product/${p._id}`}>
            <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-teal-600 transition-colors">
              {p.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
            {p.description}
          </p>

          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-gray-800">₹{p.price}</span>
              {p.originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-2">₹{p.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-semibold text-gray-700">4.5</span>
              <span className="text-xs text-gray-500">(120)</span>
            </div>
          </div>

          {/* Size Options */}
          {p.size && p.size.length > 0 && (
            <div className="flex gap-2 mb-3">
              {p.size.slice(0, 4).map((size, idx) => (
                <span
                  key={idx}
                  className="text-xs border border-gray-300 px-2 py-1 rounded hover:border-teal-500 hover:text-teal-600 transition-colors cursor-pointer"
                >
                  {size}
                </span>
              ))}
            </div>
          )}

          {/* Color Indicator */}
          {p.color && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>Color:</span>
              <div className="flex gap-1">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gradient-to-br from-red-400 to-red-600"></div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gradient-to-br from-green-400 to-green-600"></div>
              </div>
            </div>
          )}
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
