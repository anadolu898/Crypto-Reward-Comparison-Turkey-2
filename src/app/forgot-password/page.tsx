'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
      
      setSuccess(true);
      setLoading(false);
      
    } catch (error: any) {
      setLoading(false);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Şifre sıfırlama isteği gönderilirken bir hata oluştu.');
      }
    }
  };

  return (
    <div className="py-16 bg-light dark:bg-dark min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Şifremi Unuttum</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Şifrenizi sıfırlamak için e-posta adresinizi girin.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {success ? (
              <div>
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mt-4 text-center">Şifre Sıfırlama Bağlantısı Gönderildi</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-center">
                  Şifre sıfırlama talimatları e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
                </p>
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
                  E-postayı almadıysanız, spam klasörünüzü kontrol edin.
                </p>
                <div className="mt-8 text-center">
                  <Link href="/login" className="text-primary hover:text-secondary font-medium">
                    Giriş sayfasına dön
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-6">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full btn-primary py-2.5"
                    disabled={loading}
                  >
                    {loading ? 'İşleniyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                  </button>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Şifrenizi hatırladınız mı?{' '}
                      <Link href="/login" className="text-primary hover:text-secondary font-medium">
                        Giriş Yap
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 