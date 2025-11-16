import React, { useEffect, useState, useContext } from 'react';
import { getWishlist, removeFromWishlist } from '../api/wishlistService';
import { addToCart } from '../api/cartService';
import { AuthContext } from '../context/AuthContext';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) fetchWishlist();
        else setIsLoading(false);
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setIsLoading(true);
            const { data } = await getWishlist();
            setItems(data);
        } catch (e) {
            console.error(e);
            toast.error('Failed to fetch wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveItem = async (wishlistItemId) => {
        try {
            await removeFromWishlist(wishlistItemId);
            setItems(items.filter(item => item._id !== wishlistItemId));
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await addToCart({ productId: product._id, qty: 1 }, user.token);
            toast.success(`${product.title} added to cart! 🛒`);
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                        <HeartIcon className="h-10 w-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist Awaits</h2>
                    <p className="text-gray-600 mb-8">Please login to view your saved items</p>
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
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 border-opacity-75 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <HeartIcon className="h-8 w-8 text-red-500" />
                        My Wishlist
                    </h1>
                    <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center bg-white p-16 rounded-2xl shadow-lg">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                            <HeartIcon className="h-12 w-12 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8">Save your favorite items to buy them later</p>
                        <Link
                            to="/"
                            className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item, index) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="relative aspect-square overflow-hidden bg-gray-100">
                                    <img
                                        src={item.product.imageUrl || '/placeholder.png'}
                                        alt={item.product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <button
                                        onClick={() => handleRemoveItem(item._id)}
                                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5 text-red-500" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                                        {item.product.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {item.product.description}
                                    </p>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-teal-600">
                                            ₹{item.product.price}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-sm font-semibold text-gray-700">4.5</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(item.product)}
                                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCartIcon className="h-5 w-5" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
