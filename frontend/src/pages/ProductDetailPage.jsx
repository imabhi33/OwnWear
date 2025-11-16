import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addToCart } from '../api/cartService';
import { toggleWishlist } from '../api/wishlistService';
import { toast } from 'sonner';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { refreshCounts } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/products/${id}`);
      const data = await response.json();
      setProduct(data);
      if (data.size && data.size.length > 0) {
        setSelectedSize(data.size[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart({ productId: product._id, qty: quantity }, user.token);
      toast.success(`${product.title} added to cart! 🛒`);
      refreshCounts();
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to buy');
      navigate('/login');
      return;
    }

    try {
      await addToCart({ productId: product._id, qty: quantity }, user.token);
      navigate('/checkout');
    } catch (error) {
      toast.error('Failed to proceed to checkout');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      const { data } = await toggleWishlist(product._id);
      setIsWishlisted(data.inWishlist);
      toast.success(data.message);
      refreshCounts();
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const discount = product.discount || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-teal-600 font-semibold mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg p-8 aspect-square flex items-center justify-center overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`bg-white rounded-lg p-4 aspect-square flex items-center justify-center overflow-hidden transition-all ${
                    selectedImage === idx
                      ? 'ring-4 ring-teal-500 shadow-lg'
                      : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <p className="text-gray-600 font-semibold">{product.brand}</p>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg">
                <span className="font-bold">{product.rating?.toFixed(1) || '4.5'}</span>
                <StarIcon className="h-4 w-4 fill-current" />
              </div>
              <span className="text-gray-600">
                {product.reviews || 0} Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-gray-800">₹{product.price}</span>
              {discount > 0 && (
                <>
                  <span className="text-2xl text-gray-400 line-through">₹{product.originalPrice}</span>
                  <span className="text-xl font-bold text-green-600">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Color */}
            {product.color && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Color: {product.color}</p>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-full border-4 border-teal-500 shadow-md" style={{ backgroundColor: product.color.toLowerCase() }}></div>
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.size && product.size.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Select Size</p>
                <div className="flex gap-3">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-lg font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-teal-600 text-white shadow-lg scale-110'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-teal-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className="w-14 h-14 bg-white border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Buy Now
            </button>

            {/* Features */}
            <div className="bg-blue-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <TruckIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-800">Free Delivery</p>
                  <p className="text-sm text-gray-600">On orders above ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-800">Secure Transaction</p>
                  <p className="text-sm text-gray-600">100% payment protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
                <ul className="grid md:grid-cols-2 gap-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="text-teal-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    )
                  ))}
                  {product.material && (
                    <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Material:</span>
                      <span className="text-gray-600">{product.material}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
