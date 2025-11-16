import React, { useEffect, useState, useContext } from 'react';
import { getMyCart } from '../api/cartService';
import { getProfile, addAddress } from '../api/profileService';
import { createOrder } from '../api/orderService';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MapPinIcon, CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CheckoutPage() {
    const { user } = useContext(AuthContext);
    const { refreshCounts } = useCart();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [profile, setProfile] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isLoading, setIsLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        type: 'home',
        street: '',
        city: '',
        state: '',
        pincode: ''
    });

    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            navigate('/login');
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [cartRes, profileRes] = await Promise.all([
                getMyCart(user.token),
                getProfile()
            ]);
            
            // Filter out items with null/invalid products
            const validItems = cartRes.data.filter(item => item.product && item.product._id);
            if (validItems.length < cartRes.data.length) {
                toast.error('Some items in your cart are no longer available');
            }
            
            setItems(validItems);
            setProfile(profileRes.data);
            
            // Auto-select default address
            const defaultAddr = profileRes.data.addresses?.find(addr => addr.isDefault);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load checkout data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddressInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await addAddress(newAddress);
            setProfile(prev => ({ ...prev, addresses: response.data }));
            const addedAddress = response.data[response.data.length - 1];
            setSelectedAddress(addedAddress);
            setShowAddressForm(false);
            setNewAddress({ type: 'home', street: '', city: '', state: '', pincode: '' });
            toast.success('Address added successfully!');
        } catch (error) {
            toast.error('Failed to add address');
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            setIsLoading(true);
            const orderData = {
                items: items.map(item => ({
                    product: item.product._id,
                    qty: item.qty
                })),
                shippingAddress: selectedAddress,
                paymentMethod
            };

            const { data } = await createOrder(orderData);
            refreshCounts(); // Refresh cart count (cart is cleared after order)
            toast.success('Order placed successfully! 🎉');
            navigate(`/order-success/${data._id}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to place order');
        } finally {
            setIsLoading(false);
        }
    };

    const subtotal = items.reduce((total, item) => {
        if (item.product && item.product.price) {
            return total + (item.product.price * item.qty);
        }
        return total;
    }, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <MapPinIcon className="h-6 w-6 text-teal-600" />
                                    Delivery Address
                                </h2>
                                <button
                                    onClick={() => setShowAddressForm(!showAddressForm)}
                                    className="text-teal-600 hover:text-teal-700 font-semibold"
                                >
                                    {showAddressForm ? 'Cancel' : '+ Add New'}
                                </button>
                            </div>

                            {showAddressForm && (
                                <form onSubmit={handleAddAddress} className="mb-6 p-6 bg-teal-50 rounded-xl border-2 border-teal-200">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                                            <select
                                                name="type"
                                                value={newAddress.type}
                                                onChange={handleAddressInputChange}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                                                required
                                            >
                                                <option value="home">Home</option>
                                                <option value="work">Work</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Street</label>
                                            <input
                                                type="text"
                                                name="street"
                                                value={newAddress.street}
                                                onChange={handleAddressInputChange}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={newAddress.city}
                                                onChange={handleAddressInputChange}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={newAddress.state}
                                                onChange={handleAddressInputChange}
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={newAddress.pincode}
                                                onChange={handleAddressInputChange}
                                                pattern="[0-9]{6}"
                                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors"
                                    >
                                        Save Address
                                    </button>
                                </form>
                            )}

                            <div className="space-y-3">
                                {profile?.addresses?.length > 0 ? (
                                    profile.addresses.map((address) => (
                                        <div
                                            key={address._id}
                                            onClick={() => setSelectedAddress(address)}
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                selectedAddress?._id === address._id
                                                    ? 'border-teal-500 bg-teal-50'
                                                    : 'border-gray-200 hover:border-teal-300'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full capitalize">
                                                            {address.type}
                                                        </span>
                                                        {address.isDefault && (
                                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-800 font-medium">{address.street}</p>
                                                    <p className="text-gray-600 text-sm">{address.city}, {address.state} - {address.pincode}</p>
                                                </div>
                                                {selectedAddress?._id === address._id && (
                                                    <CheckCircleIcon className="h-6 w-6 text-teal-600" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No saved addresses. Add one to continue.</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <CreditCardIcon className="h-6 w-6 text-teal-600" />
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
                                    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
                                    { id: 'upi', name: 'UPI', icon: '📱' },
                                    { id: 'netbanking', name: 'Net Banking', icon: '🏦' }
                                ].map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                                            paymentMethod === method.id
                                                ? 'border-teal-500 bg-teal-50'
                                                : 'border-gray-200 hover:border-teal-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{method.icon}</span>
                                            <span className="font-semibold text-gray-800">{method.name}</span>
                                        </div>
                                        {paymentMethod === method.id && (
                                            <CheckCircleIcon className="h-6 w-6 text-teal-600" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                            
                            {/* Items */}
                            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item._id} className="flex gap-3">
                                        <img
                                            src={item.product.imageUrl || '/placeholder.png'}
                                            alt={item.product.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.product.title}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                                            <p className="text-sm font-bold text-teal-600">₹{item.product.price * item.qty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
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

                            {/* Total */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-800">Total</span>
                                <span className="text-2xl font-bold text-teal-600">₹{total}</span>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isLoading || !selectedAddress}
                                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
