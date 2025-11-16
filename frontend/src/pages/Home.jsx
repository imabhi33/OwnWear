import React, { useEffect, useState, useContext } from 'react';
import { getProducts } from '../api/productService';
import { addToCart } from '../api/cartService';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { SparklesIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { user } = useContext(AuthContext);
  const { refreshCounts } = useCart();
  const navigate = useNavigate();

  const handleDelete = (deletedId) => {
    setProducts(prev => prev.filter(p => p._id !== deletedId));
  };

  useEffect(() => {
    fetchProducts(1, selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl);
    socket.on('productAdded', () => fetchProducts(pagination.currentPage, selectedCategory, searchQuery));
    socket.on('productDeleted', (id) => handleDelete(id));
    return () => socket.disconnect();
  }, [pagination.currentPage, selectedCategory, searchQuery]);

  const fetchProducts = async (page = 1, category = 'all', search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(category !== 'all' && { category }),
        ...(search && { search })
      });
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/products?${params}`);
      const data = await response.json();
      
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (e) {
      toast.error('Failed to fetch products');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProducts(newPage, selectedCategory, searchQuery);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };



  const handleAdd = async (p) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart({ productId: p._id, qty: 1 }, user.token);
      toast.success(`${p.title} added to cart! 🛒`);
      refreshCounts(); // Refresh cart count
    } catch (e) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleBuyNow = async (p) => {
    if (!user) {
      toast.error('Please login to buy');
      navigate('/login');
      return;
    }
    try {
      // Add to cart first
      await addToCart({ productId: p._id, qty: 1 }, user.token);
      // Navigate to checkout
      navigate('/checkout');
    } catch (e) {
      toast.error('Failed to proceed to checkout');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ✨ New Collection 2024
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Express Yourself
                <br />
                <span className="text-coral-300">With Style</span>
              </h1>
              <p className="text-xl mb-8 text-teal-50">
                Discover premium quality t-shirts that match your personality. Comfort meets fashion.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className="bg-white text-teal-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Shop Now
                </a>
                <a href="#products" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-teal-600 transition-all duration-300">
                  View Collection
                </a>
              </div>
            </div>
            <div className="hidden md:block animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-6"></div>
                <img
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"
                  alt="Fashion"
                  className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4 group-hover:bg-teal-200 transition-colors">
                <TruckIcon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over ₹500</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                <SparklesIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Premium Quality</h3>
              <p className="text-sm text-gray-600">Best fabric & prints</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 group-hover:bg-orange-200 transition-colors">
                <CreditCardIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="container mx-auto px-4 py-12">
        {/* Header with Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Collection'}
              </h2>
              <p className="text-gray-600">
                {searchQuery && pagination.totalProducts > 0 ? (
                  <span>Found <strong>{pagination.totalProducts}</strong> products</span>
                ) : searchQuery && pagination.totalProducts === 0 ? (
                  <span className="text-red-600">No results found</span>
                ) : (
                  <span>{pagination.totalProducts} products available</span>
                )}
              </p>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'all', name: 'All Products', icon: '🛍️' },
              { id: 'tshirt', name: 'T-Shirts', icon: '👕' },
              { id: 'shirt', name: 'Shirts', icon: '👔' },
              { id: 'hoodie', name: 'Hoodies', icon: '🧥' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 border-opacity-75 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <SparklesIcon className="h-10 w-10 text-gray-400" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found for "{searchQuery}"</h3>
                <p className="text-gray-600 mb-4">Try searching with different keywords or browse all products</p>
                <button
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View All Products
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products yet</h3>
                <p className="text-gray-600">Check back soon for new arrivals!</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, index) => (
              <div
                key={p._id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard p={p} onAdd={handleAdd} onDelete={handleDelete} onBuyNow={handleBuyNow} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {[...Array(pagination.totalPages)].map((_, index) => {
                const pageNum = index + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === pagination.totalPages ||
                  (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        pagination.currentPage === pageNum
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                          : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === pagination.currentPage - 2 ||
                  pageNum === pagination.currentPage + 2
                ) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-coral-400 to-coral-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 text-coral-50">
            Get exclusive offers and updates on new arrivals
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/50"
            />
            <button className="bg-white text-coral-500 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
