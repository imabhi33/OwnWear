import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AuthPage from './pages/AuthPage';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import Profile from './pages/Profile';
import DesignStudio from './pages/DesignStudio';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Navbar from './components/Navbar';
import CustomToast from './components/CustomToast';
import ChatWidget from './components/ChatWidget';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname.startsWith('/reset-password');

  return (
    <>
      <CustomToast />
      {!isAuthPage && <Navbar />}
      <div className={isAuthPage ? '' : 'container mx-auto p-4'}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<AuthPage/>} />
          <Route path="/signup" element={<AuthPage/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/admin/products" element={<AdminProducts/>} />
          <Route path="/admin/users" element={<AdminUsers/>} />
          <Route path="/admin/orders" element={<AdminOrders/>} />
          <Route path="/design-studio" element={<DesignStudio/>} />
          <Route path="/wishlist" element={<WishlistPage/>} />
          <Route path="/checkout" element={<CheckoutPage/>} />
          <Route path="/orders" element={<OrdersPage/>} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage/>} />
          <Route path="/product/:id" element={<ProductDetailPage/>} />
          <Route path="*" element={<Navigate to="/" replace/>} />
        </Routes>
        {!isAuthPage && <ChatWidget />}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
