'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Define the user type
interface User {
  id: number;
  email: string;
  name: string | null;
  is_active: boolean;
  is_premium: boolean;
  premium_expires_at: string | null;
  email_notifications: boolean;
  created_at: string;
  last_login: string | null;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Check if the user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // Check for stored token and user
      const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
      const token = storage.getItem('accessToken');
      const storedUser = storage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Set user from storage first
          setUser(JSON.parse(storedUser));
          
          // Then verify token and get fresh user data
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
          const response = await axios.get(`${apiUrl}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Update user data
          setUser(response.data.user);
          storage.setItem('user', JSON.stringify(response.data.user));
          
        } catch (error: any) {
          if (error.response?.status === 401) {
            // Try to refresh token
            const refreshSuccess = await refreshToken();
            
            if (!refreshSuccess) {
              // Clear auth data if refresh fails
              clearAuthData();
              setUser(null);
            }
          } else {
            // Clear auth data on other errors
            clearAuthData();
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
        rememberMe
      });
      
      // Store tokens in localStorage or sessionStorage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', response.data.accessToken);
      storage.setItem('refreshToken', response.data.refreshToken);
      storage.setItem('user', JSON.stringify(response.data.user));
      
      // Update user state
      setUser(response.data.user);
      
      return response.data;
      
    } catch (error) {
      throw error;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      if (token) {
        await axios.post(
          `${apiUrl}/api/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      
      // Clear auth data
      clearAuthData();
      setUser(null);
      
    } catch (error) {
      // Even if the API call fails, clear local data
      clearAuthData();
      setUser(null);
      throw error;
    }
  };
  
  // Refresh token function
  const refreshToken = async () => {
    try {
      const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
      const refreshTokenValue = storage.getItem('refreshToken');
      
      if (!refreshTokenValue) {
        return false;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(
        `${apiUrl}/api/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshTokenValue}`
          }
        }
      );
      
      // Update tokens and user data
      storage.setItem('accessToken', response.data.accessToken);
      storage.setItem('user', JSON.stringify(response.data.user));
      
      // Update user state
      setUser(response.data.user);
      
      return true;
      
    } catch (error) {
      return false;
    }
  };
  
  // Helper to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  };
  
  // Function to update user data
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Update storage
    const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(updatedUser));
  };
  
  // Auth context value
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshToken,
    updateUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 