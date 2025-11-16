import React, { useEffect, useState, useContext } from 'react';
import { getMyCart, removeFromCart } from '../api/cartService';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBagIcon, TrashIcon, ArrowRightIcon, TagIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function CartPage() {
    const { user } = useContext(AuthContext);
    const { refreshCounts } = useCart();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        if (user) fetchCart();
        else setIsLoading(false);
    }, [user]);

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const { data } = await getMyCart(user.token);
            
            // Filter out items with null/invalid products
            const validItems = data.filter(item => item.product && item.product._id);
            if (validItems.length < data.length) {
                toast.error('Some items are no longer available and were removed');
            }
            
            setItems(validItems);
        } catch (e) {
            console.error(e);
            toast.error('Failed to fetch cart items');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await removeFromCart(cartItemId, user.token);
            await fetchCart();
            refreshCounts(); // Refresh cart count
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item from cart');
        }
    };

    const subtotal = items.reduce((total, item) => {
        if (item.product && item.product.price) {
            return total + (item.product.price * item.qty);
        }
        return total;
    }, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const discount = 0;
    const total = subtotal + shipping - discount;

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
                        <ShoppingBagIcon className="h-10 w-10 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Waiting</h2>
                    <p className="text-gray-600 mb-8">Please login to view your cart and continue shopping</p>
                    <Link
                        to="/login"
                        className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 border-opacity-75 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center bg-white p-16 rounded-2xl shadow-lg">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                            <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
                        <Link
                            to="/"
                            className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                                >
                                    <div className="flex gap-6">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.product.imageUrl || '/placeholder.png'}
                                                alt={item.product.title}
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                        {item.product.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">Size: M | Color: Blue</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-600">Quantity:</span>
                                                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                                        <button className="px-3 py-1 hover:bg-gray-100 transition-colors">-</button>
                                                        <span className="px-4 py-1 border-x-2 border-gray-200 font-semibold">{item.qty}</span>
                                                        <button className="px-3 py-1 hover:bg-gray-100 transition-colors">+</button>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-teal-600">₹{item.product.price * item.qty}</p>
                                                    <p className="text-sm text-gray-500">₹{item.product.price} each</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                                <div className="mb-6">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                                            />
                                        </div>
                                        <button className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-semibold">
                                            {shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-bold text-gray-800">Total</span>
                                    <span className="text-2xl font-bold text-teal-600">₹{total}</span>
                                </div>
                                <Link
                                    to="/checkout"
                                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout
                                    <ArrowRightIcon className="h-5 w-5" />
                                </Link>
                                {subtotal < 500 && (
                                    <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                                        <p className="text-sm text-teal-700">
                                            Add ₹{500 - subtotal} more to get <span className="font-semibold">FREE shipping</span>! 🎉
                                        </p>
                                    </div>
                                )}
                                <Link to="/" className="block text-center mt-4 text-teal-600 hover:text-teal-700 font-medium transition-colors">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
