import {React} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

function App(){
  return <AuthProvider>
    <Toast />
    <Navbar />
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </div>
  </AuthProvider>
}

export default App;
