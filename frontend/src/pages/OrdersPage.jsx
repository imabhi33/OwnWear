import React, { useEffect, useState, useContext } from 'react';
import { getMyOrders, cancelOrder } from '../api/orderService';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ShoppingBagIcon, TruckIcon, CheckCircleIcon, XCircleIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import ConfirmModal from '../components/ConfirmModal';

export default function OrdersPage() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null, orderNumber: '' });

    useEffect(() => {
        if (user) fetchOrders();
        else setIsLoading(false);
    }, [user]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const { data } = await getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    const openCancelModal = (orderId, orderNumber) => {
        setCancelModal({ isOpen: true, orderId, orderNumber });
    };

    const closeCancelModal = () => {
        setCancelModal({ isOpen: false, orderId: null, orderNumber: '' });
    };

    const handleCancelOrder = async () => {
        try {
            await cancelOrder(cancelModal.orderId);
            toast.success('Order cancelled successfully');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to cancel order');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
            processing: 'bg-purple-100 text-purple-700 border-purple-200',
            shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            delivered: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
            case 'confirmed':
                return <ClockIcon className="h-5 w-5" />;
            case 'processing':
            case 'shipped':
                return <TruckIcon className="h-5 w-5" />;
            case 'delivered':
                return <CheckCircleIcon className="h-5 w-5" />;
            case 'cancelled':
                return <XCircleIcon className="h-5 w-5" />;
            default:
                return <ShoppingBagIcon className="h-5 w-5" />;
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md">
                    <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-8">Please login to view your orders</p>
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
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                            <ShoppingBagIcon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-1">My Orders</h1>
                            <p className="text-gray-600">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center bg-white p-16 rounded-3xl shadow-2xl">
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                            <ShoppingBagIcon className="h-16 w-16 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">No orders yet</h2>
                        <p className="text-lg text-gray-600 mb-8">Start shopping to see your orders here</p>
                        <Link
                            to="/"
                            className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-4 px-10 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden animate-fadeInUp transition-all duration-300 border border-gray-100"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-teal-100 mb-1">Order ID</p>
                                            <p className="text-xl font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-teal-100 mb-1">Order Date</p>
                                            <p className="font-semibold text-lg">
                                                {new Date(order.orderDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-teal-100 mb-1">Total Amount</p>
                                            <p className="text-2xl font-bold">₹{order.total}</p>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm bg-white/20 backdrop-blur-sm border-2 border-white/40`}>
                                                {getStatusIcon(order.orderStatus)}
                                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4 mb-6">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                                <img
                                                    src={item.imageUrl || '/placeholder.png'}
                                                    alt={item.title}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                                                    <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                                                    <p className="text-lg font-bold text-teal-600">₹{item.price * item.qty}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-5 mb-4 border-2 border-blue-200">
                                        <div className="flex items-start gap-3">
                                            <MapPinIcon className="h-5 w-5 text-blue-600 mt-1" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 mb-2">Delivery Address</p>
                                                <p className="text-gray-800 font-medium">{order.shippingAddress.street}</p>
                                                <p className="text-gray-600 text-sm">
                                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/order-success/${order._id}`}
                                            className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-center"
                                        >
                                            View Details
                                        </Link>
                                        {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
                                            <button
                                                onClick={() => openCancelModal(order._id, order._id.slice(-8).toUpperCase())}
                                                className="px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold rounded-xl transition-all hover:shadow-md"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Cancel Order Confirmation Modal */}
                <ConfirmModal
                    isOpen={cancelModal.isOpen}
                    onClose={closeCancelModal}
                    onConfirm={handleCancelOrder}
                    title="Cancel Order"
                    message={`Are you sure you want to cancel order #${cancelModal.orderNumber}? This action cannot be undone.`}
                    confirmText="Yes, Cancel Order"
                    cancelText="Keep Order"
                    type="warning"
                />
            </div>
        </div>
    );
}
