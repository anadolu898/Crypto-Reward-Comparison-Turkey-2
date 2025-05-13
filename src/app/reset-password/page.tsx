'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Check if token is present
  useEffect(() => {
    if (!token) {
      setError('Geçersiz şifre sıfırlama bağlantısı. Lütfen şifre sıfırlama işlemini tekrar başlatın.');
    }
  }, [token]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      return;
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter uzunluğunda olmalıdır');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      await axios.post(`${apiUrl}/api/auth/reset-password`, {
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error: any) {
      setLoading(false);
      
      if (error.response?.data?.expired) {
        setError('Şifre sıfırlama bağlantısının süresi dolmuş. Lütfen yeni bir bağlantı talep edin.');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Şifre sıfırlama sırasında bir hata oluştu.');
      }
    }
  };
  
  if (success) {
    return (
      <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mt-4">Şifre Başarıyla Sıfırlandı!</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Şifreniz başarıyla değiştirildi. Yeni şifreniz ile giriş yapabilirsiniz.
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Giriş sayfasına yönlendiriliyorsunuz...
              </p>
              <div className="mt-6">
                <Link href="/login" className="w-full inline-block btn-primary py-2.5">
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Şifre Sıfırlama</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Lütfen yeni şifrenizi belirleyin.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-6">
                <p className="text-red-800 dark:text-red-200">{error}</p>
                {error.includes('süresi dolmuş') && (
                  <div className="mt-2">
                    <Link href="/forgot-password" className="text-primary hover:text-secondary font-medium">
                      Yeni bir şifre sıfırlama bağlantısı talep et
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                  required
                  disabled={!token}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir.
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifreyi Onayla
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
                  disabled={!token}
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-2.5"
                disabled={loading || !token}
              >
                {loading ? 'İşleniyor...' : 'Şifreyi Sıfırla'}
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Link href="/login" className="text-primary hover:text-secondary font-medium">
                    Giriş sayfasına dön
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 