import React, { createContext, useState, useEffect, useContext } from 'react';
import { setAuthToken } from '../api/apiService';

export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('ecart_user');
      const parsedUser = raw ? JSON.parse(raw) : null;
      if (parsedUser?.token) {
        setAuthToken(parsedUser.token);
      }
      return parsedUser;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('ecart_user');
      setAuthToken(null);
      return null;
    }
  });

  useEffect(() => {
    if (user?.token) {
      localStorage.setItem('ecart_user', JSON.stringify(user));
      setAuthToken(user.token);
    } else {
      localStorage.removeItem('ecart_user');
      setAuthToken(null);
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecart_user');
  };

  const updateUser = (newUserData) => {
    setUser(prevUser => ({ ...prevUser, ...newUserData }));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
