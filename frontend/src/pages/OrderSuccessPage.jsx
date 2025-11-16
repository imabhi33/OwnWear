import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api/orderService';
import { CheckCircleIcon, TruckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function OrderSuccessPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            setIsLoading(true);
            const { data } = await getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12 px-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-coral-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            <div className="max-w-3xl mx-auto relative z-10">
                {/* Success Message */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center animate-fadeInUp relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-green-500 to-teal-500"></div>
                    
                    {/* Confetti Effect */}
                    <div className="absolute top-10 left-10 text-4xl animate-bounce">🎉</div>
                    <div className="absolute top-10 right-10 text-4xl animate-bounce animation-delay-200">🎊</div>
                    
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-lg animate-pulse">
                        <CheckCircleIcon className="h-14 w-14 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent mb-3">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">Thank you for shopping with us! Your order has been confirmed and will be delivered soon.</p>
                    <div className="inline-block bg-gradient-to-r from-teal-50 to-green-50 border-2 border-teal-300 rounded-xl px-8 py-4 shadow-md">
                        <p className="text-sm font-semibold text-gray-600 mb-1">Order ID</p>
                        <p className="text-2xl font-bold text-teal-600">#{order?._id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 animate-fadeInUp border border-gray-100" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                            📦
                        </div>
                        Order Details
                    </h2>
                    
                    {/* Items */}
                    <div className="space-y-4 mb-6">
                        {order?.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                <img
                                    src={item.imageUrl || '/placeholder.png'}
                                    alt={item.title}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                    <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                                    <p className="text-lg font-bold text-teal-600">₹{item.price * item.qty}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price Summary */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{order?.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{order?.shippingCharges === 0 ? 'FREE' : `₹${order?.shippingCharges}`}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                            <span>Total</span>
                            <span className="text-teal-600">₹{order?.total}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 animate-fadeInUp border border-gray-100" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPinIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        Delivery Address
                    </h2>
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                {order?.shippingAddress.type.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 capitalize mb-1">{order?.shippingAddress.type} Address</p>
                                <p className="text-gray-700 font-medium">{order?.shippingAddress.street}</p>
                                <p className="text-gray-600">
                                    {order?.shippingAddress.city}, {order?.shippingAddress.state} - {order?.shippingAddress.pincode}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Timeline */}
                <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl shadow-2xl p-8 mb-8 text-white animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <TruckIcon className="h-7 w-7" />
                        Estimated Delivery
                    </h2>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 text-center border-2 border-white/30">
                        <div className="text-6xl mb-4">🚚</div>
                        <p className="text-4xl font-bold mb-3">5-7 Business Days</p>
                        <p className="text-teal-50 text-lg">Track your order via email updates</p>
                    </div>
                    <div className="mt-6 grid grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">✓</div>
                            <p className="text-xs text-teal-50">Order Placed</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">📦</div>
                            <p className="text-xs text-teal-50">Processing</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">🚚</div>
                            <p className="text-xs text-teal-50">Shipped</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">🏠</div>
                            <p className="text-xs text-teal-50">Delivered</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <Link
                        to="/"
                        className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-center"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        to="/orders"
                        className="flex-1 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold py-4 px-6 rounded-lg transition-colors text-center"
                    >
                        View Orders
                    </Link>
                </div>
            </div>
        </div>
    );
}
