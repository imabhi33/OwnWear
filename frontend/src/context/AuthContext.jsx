import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=> {
    const raw = localStorage.getItem('ecart_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(()=> {
    localStorage.setItem('ecart_user', JSON.stringify(user));
  }, [user]);

  const logout = ()=> { setUser(null); localStorage.removeItem('ecart_user'); }

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>
}
