'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emailNotifications: true
  });
  
  useEffect(() => {
    const loadProfile = async () => {
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
        
        const userData = response.data.user;
        setFormData({
          name: userData.name || '',
          emailNotifications: userData.email_notifications
        });
        
        setLoading(false);
        
      } catch (error: any) {
        setLoading(false);
        
        if (error.response?.status === 401) {
          // Token expired or invalid
          router.push('/login');
        } else {
          setError('Profil bilgileri alınırken bir hata oluştu');
        }
      }
    };
    
    loadProfile();
  }, [router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    
    try {
      const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
      const token = storage.getItem('accessToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      // Update profile
      const response = await axios.put(
        `${apiUrl}/api/auth/profile`,
        {
          name: formData.name,
          emailNotifications: formData.emailNotifications
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update user data in storage
      storage.setItem('user', JSON.stringify(response.data.user));
      
      setSuccess(true);
      setSaving(false);
      
      // Auto-redirect after success
      setTimeout(() => {
        router.push('/account/dashboard');
      }, 2000);
      
    } catch (error: any) {
      setSaving(false);
      
      if (error.response?.status === 401) {
        router.push('/login');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Profil güncellenirken bir hata oluştu');
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
              <h1 className="text-3xl font-bold mb-2">Profil Bilgileri</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kişisel bilgilerinizi güncelleyin.
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
                  Profiliniz başarıyla güncellendi.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İsim
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="Adınız Soyadınız"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  İsminiz profilinizde görünecektir. İsterseniz boş bırakabilirsiniz.
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Bildirim Tercihleri</h3>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Kampanya ve fırsat bildirimleri
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                  Yeni kampanyalar, özel teklifler ve güncellemeler hakkında e-posta bildirimleri alın.
                </p>
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
                  disabled={saving}
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8">
            <Link href="/account/change-password" className="text-primary hover:text-secondary">
              Şifrenizi mi değiştirmek istiyorsunuz?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 