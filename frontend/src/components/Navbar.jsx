import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar(){
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  return (
    <nav className="bg-white shadow p-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">ASR E-Cart</Link>
        <div className="flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
          {user ? (
            <>
              <span className="px-3 py-1 rounded bg-gray-100">{user.name}</span>
              <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>{logout(); nav('/login')}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 bg-blue-500 text-white rounded">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
