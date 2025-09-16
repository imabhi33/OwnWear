import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCog, faSignOutAlt, faListAlt, faGift, faSearch } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.css';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const nav = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLogout = () => {
        logout();
        nav('/login');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Perform search logic here (e.g., navigate to a search results page)
        console.log('Search submitted:', searchQuery);
    };

    return (
        <nav className="bg-indigo-400 shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt="OwnWear Logo" className="h-12 w-48 mr-0" /> {/* Increased height, removed text */}
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex items-center rounded-md bg-white md:w-1/3">
                    <div className="flex w-full">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full py-2 px-3 text-gray-700 focus:outline-none rounded-tl-md rounded-bl-md"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded-tr-md rounded-br-md focus:outline-none"
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </form>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white focus:outline-none"
                >
                    <svg
                        className="h-6 w-6 fill-current"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMenuOpen ? (
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                            />
                        ) : (
                            <path
                                fillRule="evenodd"
                                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
                            />
                        )}
                    </svg>
                </button>

                {/* Navigation Links */}
                <div
                    className={`${isMenuOpen ? 'block' : 'hidden'
                        } md:flex md:items-center space-x-4`}
                >
                    <Link
                        to="/"
                        className="block md:inline-block text-white hover:text-gray-200 py-2 transition duration-300"
                    >
                        Home
                    </Link>
                    <Link
                        to="/cart"
                        className="block md:inline-block text-white hover:text-gray-200 py-2 transition duration-300"
                    >
                        Cart
                    </Link>
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="block md:inline-block text-white hover:text-gray-200 py-2 transition duration-300"
                        >
                            Admin
                        </Link>
                    )}

                    {/* Auth Links / User Info */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={toggleProfile}
                                className="focus:outline-none rounded-full"
                            >
                                <FontAwesomeIcon
                                    icon={faUserCircle}
                                    className="text-white text-2xl hover:text-gray-200 transition duration-300"
                                />
                            </button>

                            {/* Profile Dropdown */}
                            <div
                                className={`${isProfileOpen ? 'block' : 'hidden'
                                    } absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10`}
                            >
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                                >
                                    Settings
                                </Link>
                                <Link
                                    to="/orders"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                                >
                                    Orders
                                </Link>
                                <Link
                                    to="/rewards"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                                >
                                    Rewards
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-white hover:bg-gray-100 text-indigo-700 font-medium py-1.5 px-3 rounded-md transition duration-300"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}