'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { api } from './api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithNafath: (nationalId: string, channel?: 'PUSH' | 'QR') => Promise<string>; // Returns transaction ID
  verifyNafathTransaction: (transactionId: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('sso_token');
    const storedUser = localStorage.getItem('sso_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

    const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithNafath = async (nationalId: string, channel: 'PUSH' | 'QR' = 'PUSH'): Promise<string> => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/nafath/initiate', { nationalId, channel });
      return response.data.transactionId;
    } catch (error) {
      console.error('Nafath initiation failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const verifyNafathTransaction = async (transactionId: string) => {
    try {
      const response = await axios.post('/api/auth/nafath/verify', { transactionId });
      
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Nafath verification failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sso_token');
    localStorage.removeItem('sso_user');
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithNafath,
    verifyNafathTransaction,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
