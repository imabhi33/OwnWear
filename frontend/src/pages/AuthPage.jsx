import React, { useState, useContext } from 'react';
import { login, register } from '../api/authService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, SparklesIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AuthPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const nav = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    nav(isLogin ? '/signup' : '/login', { replace: true });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Password reset link sent to your email! 📧');
        setIsForgotPassword(false);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        toast.error(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      toast.error('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);
    try {
      const { data } = isLogin 
        ? await login({ email: formData.email, password: formData.password })
        : await register({ name: formData.name, email: formData.email, password: formData.password });
      
      setUser(data);
      toast.success(isLogin ? 'Welcome back! 🎉' : 'Account created successfully! 🎉');
      nav('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || (isLogin ? 'Invalid credentials' : 'Failed to create account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ minHeight: '650px', maxHeight: '90vh' }}>
          <div className="relative w-full h-full flex" style={{ minHeight: '650px' }}>
            {/* Form Section - Animated */}
            <div
              className={`absolute top-0 w-full md:w-1/2 h-full transition-all duration-700 ease-in-out ${
                isLogin ? 'left-0' : 'left-0 md:left-1/2'
              }`}
            >
              <div className="h-full flex items-start justify-center p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-md py-6">
                  {/* Logo */}
                  <div className="text-center mb-5">
                    <img src="/logo.png" alt="OwnWear" className="h-14 mx-auto mb-3" onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }} />
                    <div style={{ display: 'none' }} className="text-3xl font-bold text-teal-600 mb-3">OwnWear</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {isForgotPassword 
                        ? 'Enter your email to receive reset link'
                        : isLogin 
                        ? 'Sign in to continue shopping'
                        : 'Join OwnWear and start shopping!'}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-3.5">
                    {/* Name Input - Only for Signup */}
                    {!isLogin && !isForgotPassword && (
                      <div className="animate-fadeInUp">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your full name"
                            className="w-full pl-11 pr-4 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter your email"
                          className="w-full pl-11 pr-4 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 outline-none"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    {!isForgotPassword && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                            className="w-full pl-11 pr-11 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                        </div>
                        {!isLogin && <p className="mt-0.5 text-xs text-gray-500">Must be at least 6 characters</p>}
                      </div>
                    )}

                    {/* Confirm Password - Only for Signup */}
                    {!isLogin && !isForgotPassword && (
                      <div className="animate-fadeInUp">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            required
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Confirm your password"
                            className="w-full pl-11 pr-11 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Remember Me / Terms / Back to Login */}
                    {isForgotPassword ? (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(false);
                            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                          }}
                          className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          ← Back to Login
                        </button>
                      </div>
                    ) : isLogin ? (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                          <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          required
                          className="w-4 h-4 mt-1 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label className="ml-2 text-sm text-gray-600">
                          I agree to the{' '}
                          <a href="#" className="text-teal-600 hover:underline font-medium">Terms</a>
                          {' '}and{' '}
                          <a href="#" className="text-teal-600 hover:underline font-medium">Privacy Policy</a>
                        </label>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          <span className="text-sm">{isForgotPassword ? 'Sending...' : isLogin ? 'Signing in...' : 'Creating account...'}</span>
                        </div>
                      ) : (
                        <span className="text-sm">{isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}</span>
                      )}
                    </button>
                  </form>

                  {/* Toggle Link */}
                  {!isForgotPassword && (
                    <div className="mt-3 text-center">
                      <p className="text-xs text-gray-600">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                          onClick={handleToggle}
                          className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          {isLogin ? 'Create Account' : 'Sign In'}
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Theme Section - Animated */}
            <div
              className={`hidden md:block absolute top-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
                isLogin ? 'left-1/2' : 'left-0'
              }`}
            >
              <div className="relative h-full bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                      <ShoppingBagIcon className="h-10 w-10" />
                    </div>
                    
                    <h2 className="text-4xl font-bold mb-4">
                      {isLogin ? 'New Here?' : 'Welcome Back!'}
                    </h2>
                    
                    <p className="text-lg text-teal-50 mb-8 max-w-md">
                      {isLogin 
                        ? 'Create an account and discover amazing products tailored just for you!'
                        : 'Sign in to access your account and continue your shopping journey!'
                      }
                    </p>

                    {/* Features */}
                    <div className="space-y-4 text-left max-w-sm mx-auto">
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <SparklesIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Premium Quality</h3>
                          <p className="text-sm text-teal-50">Best fabric & prints</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <TruckIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Free Shipping</h3>
                          <p className="text-sm text-teal-50">On orders over ₹500</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <ShieldCheckIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Secure Payment</h3>
                          <p className="text-sm text-teal-50">100% secure transactions</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={handleToggle}
                      className="mt-8 px-8 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {isLogin ? 'Create Account' : 'Sign In'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
