import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCartIcon, UserCircleIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon, BellIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const nav = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        nav('/login');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Search:', searchQuery);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4">
                {/* Top Bar */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <img 
                            src="/logo.png" 
                            alt="OwnWear" 
                            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" 
                        />
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for products, brands and more..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all duration-200 outline-none"
                            />
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </form>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-6">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            {user ? (
                                <>
                                    <button className="relative group">
                                        <HeartIcon className="h-6 w-6 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
                                    </button>
                                    
                                    <Link to="/cart" className="relative group">
                                        <ShoppingCartIcon className="h-6 w-6 text-gray-600 group-hover:text-teal-600 transition-colors duration-200" />
                                        <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
                                    </Link>

                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors duration-200"
                                        >
                                            <UserCircleIcon className="h-7 w-7 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                                        </button>

                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fadeInUp">
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    Orders
                                                </Link>
                                                <Link
                                                    to="/wishlist"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    Wishlist
                                                </Link>
                                                {user?.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <hr className="my-2 border-gray-100" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-gray-600 hover:text-teal-600 transition-colors"
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-4">
                    <form onSubmit={handleSearchSubmit}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </form>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-fadeInUp">
                    <div className="container mx-auto px-4 py-4 space-y-3">
                        <Link
                            to="/"
                            className="block py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to="/cart"
                                    className="block py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Cart
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="block py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left py-2 text-red-600 font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="block py-2 text-teal-600 font-semibold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
