'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
      const token = storage.getItem('accessToken');
      
      if (!token) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const validatePasswords = () => {
    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      return false;
    }
    
    // Check password strength
    if (formData.newPassword.length < 8) {
      setError('Şifre en az 8 karakter uzunluğunda olmalıdır');
      return false;
    }
    
    // Check if new password is different from current
    if (formData.newPassword === formData.currentPassword) {
      setError('Yeni şifre mevcut şifre ile aynı olamaz');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!validatePasswords()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
      const token = storage.getItem('accessToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      // Change password
      await axios.put(
        `${apiUrl}/api/auth/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess(true);
      setSubmitting(false);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/account/dashboard');
      }, 2000);
      
    } catch (error: any) {
      setSubmitting(false);
      
      if (error.response?.status === 401) {
        // Unauthorized, redirect to login
        router.push('/login');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Şifre değiştirirken bir hata oluştu');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mb-8"></div>
              <div className="h-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Şifre Değiştir</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Hesabınız için yeni bir şifre oluşturun.
              </p>
            </div>
            <Link href="/account/dashboard" className="btn-outline py-2 px-4">
              Geri Dön
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-6">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-6">
                <p className="text-green-800 dark:text-green-200">
                  Şifreniz başarıyla değiştirildi.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir.
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yeni Şifreyi Onayla
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-8">
                <Link 
                  href="/account/dashboard" 
                  className="btn-outline py-2 px-6"
                >
                  İptal
                </Link>
                <button
                  type="submit"
                  className="btn-primary py-2 px-6"
                  disabled={submitting}
                >
                  {submitting ? 'İşleniyor...' : 'Şifreyi Değiştir'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Şifrenizi mi unuttunuz?{' '}
              <Link href="/forgot-password" className="text-primary hover:text-secondary font-medium">
                Şifre sıfırlama bağlantısı talep edin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 