import React, { useState, useContext } from 'react';
import { login } from '../api/authService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ email, password });
      setUser(data);
      nav('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white/90 rounded-2xl shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-semibold text-indigo-800 mb-4 text-center">Welcome Back</h2>
        <p className="text-gray-600 mb-6 text-center">Sign in to your account</p>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 bg-purple-50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
            />
          </div>
          <div>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full p-3 bg-purple-50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Create one
          </a>
        </div>
      </div>
    </div>
  );
}