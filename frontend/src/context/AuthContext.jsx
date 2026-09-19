import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('norcet_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const data = await api.get('/api/auth/me');
        setUser(data.user);
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('norcet_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await api.post('/api/auth/register', userData);
    localStorage.setItem('norcet_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('norcet_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
