import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  name: string | null;
  is_active: boolean;
  is_premium: boolean;
  premium_since: string | null;
  premium_expires: string | null;
  email_notifications: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.response?.data?.error || 'Authentication error');
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear tokens if they are invalid
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
        rememberMe
      });

      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        needsVerification: err.response?.data?.needsVerification
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // Call logout endpoint
        await axios.post(
          `${apiUrl}/api/auth/logout`, 
          {}, 
          { headers: { 'Authorization': `Bearer ${token}` }}
        );
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear tokens and user state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const register = async (formData: { name: string; email: string; password: string; confirmPassword: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/auth/register`, formData);
      
      // Auto-login if account is auto-activated
      if (response.data.auto_activated) {
        return { 
          success: true, 
          autoActivated: true,
          email: response.data.email
        };
      }
      
      return { 
        success: true, 
        autoActivated: false,
        email: response.data.email
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Refresh user profile periodically to check premium status
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        fetchUserProfile();
      }
    }, 60000); // every minute
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    register,
    refreshUser: fetchUserProfile
  };
} 