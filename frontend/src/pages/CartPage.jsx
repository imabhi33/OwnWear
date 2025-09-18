import React, { useEffect, useState, useContext } from 'react';
import { getMyCart } from '../api/cartService';
import { AuthContext } from '../context/AuthContext';
import { FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';

export default function CartPage() {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (user) fetchCart();
        else setIsLoading(false); // If no user, set loading to false
    }, [user]);

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const { data } = await getMyCart(user.token);
            setItems(data);
        } catch (e) {
            console.error(e);
            // Optionally set an error state here to display an error message
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return (
        <div className="flex flex-col items-center justify-center mt-16 p-4 bg-yellow-50 border border-yellow-200 rounded-md shadow-md w-full max-w-md mx-auto">
            <FaExclamationTriangle className="text-yellow-600 text-4xl mb-2" />
            <p className="text-yellow-700 font-semibold">Please login to view your cart.</p>
        </div>
    );

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg">
                <div className="flex items-center text-gray-700 mb-6">
                    <FaShoppingCart className="text-2xl mr-2 text-blue-500" />
                    <h2 className="text-2xl font-semibold">Your Shopping Cart</h2>
                </div>
                {items.length === 0 ? (
                    <div className="text-gray-500 italic">Your cart is empty.</div>
                ) : (
                    <div className="space-y-4">
                        {items.map(it => (
                            <div key={it._id} className="flex items-center bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={it.product.imageUrl || '/placeholder.png'} alt={it.product.title} className="w-32 h-32 object-cover object-center flex-shrink-0" />
                                <div className="p-4">
                                    <div className="text-lg font-semibold text-gray-800">{it.product.title}</div>
                                    <div className="text-sm text-gray-600">Quantity: {it.qty}</div>
                                    <div className="text-md font-bold text-gray-900 mt-2">₹{it.product.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}