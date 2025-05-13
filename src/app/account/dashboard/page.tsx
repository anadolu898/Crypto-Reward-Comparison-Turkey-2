'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      setLoading(true);
      
      try {
        // First try to get token from storage
        const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
        const token = storage.getItem('accessToken');
        
        if (!token) {
          // No token found, redirect to login
          router.push('/login');
          return;
        }
        
        // Fetch user profile
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const response = await axios.get(`${apiUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUser(response.data.user);
        setLoading(false);
        
      } catch (error: any) {
        setLoading(false);
        
        if (error.response?.status === 401) {
          // Token expired or invalid, try to refresh
          try {
            await refreshToken();
          } catch (refreshError) {
            // Refresh failed, redirect to login
            clearAuthData();
            router.push('/login');
          }
        } else {
          setError('Profil bilgileri alınırken bir hata oluştu');
        }
      }
    };
    
    checkAuth();
  }, [router]);
  
  const refreshToken = async () => {
    try {
      const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
      const refreshToken = storage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(
        `${apiUrl}/api/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        }
      );
      
      // Update tokens
      storage.setItem('accessToken', response.data.accessToken);
      storage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      return true;
      
    } catch (error) {
      throw error;
    }
  };
  
  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  };
  
  const handleLogout = async () => {
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
      
      // Clear auth data regardless of API response
      clearAuthData();
      
      // Redirect to home
      router.push('/');
      
    } catch (error) {
      // Even if the API call fails, clear local data and redirect
      clearAuthData();
      router.push('/');
    }
  };
  
  if (loading) {
    return (
      <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mb-8"></div>
              <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg mb-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="btn-primary py-2 px-4"
            >
              Tekrar Giriş Yap
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Oturum zaman aşımına uğradı veya giriş yapılmadı.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="btn-primary py-2 px-4"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Hesap Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Hesap bilgilerinizi görüntüleyin ve yönetin.
          </p>
          
          {/* Account Overview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Hesap Bilgileri</h2>
              <Link href="/account/profile" className="btn-secondary py-1 px-4 text-sm">
                Düzenle
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">İsim</p>
                <p className="font-medium">{user.name || 'Belirlenmemiş'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">E-posta</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Kayıt Tarihi</p>
                <p className="font-medium">{formatDate(user.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Son Giriş Tarihi</p>
                <p className="font-medium">{user.last_login ? formatDate(user.last_login) : 'İlk kez giriş yapıldı'}</p>
              </div>
            </div>
          </div>
          
          {/* Subscription Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Abonelik Durumu</h2>
              <Link href="/subscription" className="btn-primary py-1 px-4 text-sm">
                {user.is_premium ? 'Yönet' : 'Abone Ol'}
              </Link>
            </div>
            
            <div className="flex items-center">
              <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                user.is_premium 
                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {user.is_premium ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">
                  {user.is_premium ? 'Premium Üyelik' : 'Ücretsiz Üyelik'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.is_premium 
                    ? `Aboneliğiniz ${formatDate(user.premium_expires_at)} tarihine kadar geçerli.` 
                    : 'Premium özelliklere erişmek için abone olun.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Email Preferences Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">E-posta Bildirimleri</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Kampanya ve Fırsat Bildirimleri</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Yeni kampanyalar ve fırsatlar hakkında e-posta bildirimleri alın.
                </p>
              </div>
              <div className="text-right">
                <div className="relative inline-block w-12 align-middle select-none">
                  <span className={`block h-6 rounded-full ${
                    user.email_notifications 
                      ? 'bg-primary' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                      user.email_notifications 
                        ? 'translate-x-6' 
                        : 'translate-x-0'
                    }`}></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/account/change-password" className="btn-secondary py-2 px-6">
              Şifre Değiştir
            </Link>
            <button onClick={handleLogout} className="btn-outline py-2 px-6">
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 