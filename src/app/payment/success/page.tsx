'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, user, isLoading } = useAuth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Force refresh user data to get updated premium status
    refreshUser();
    
    // Set up countdown to redirect to dashboard
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshUser, router]);

  return (
    <div className="py-16 bg-light dark:bg-dark min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Ödeme Başarılı!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Premium aboneliğiniz için teşekkür ederiz. Hesabınız premium özelliklere erişim için aktifleştirildi.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Premium bilgileriniz güncelleniyor...
                </span>
              ) : user?.is_premium ? (
                <>Premium hesabınız {new Date(user.premium_expires || '').toLocaleDateString('tr-TR')} tarihine kadar aktif.</>
              ) : (
                <>Premium hesap bilgileriniz birkaç dakika içinde güncellenecektir.</>
              )}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary px-6 py-2"
              >
                Dashboard'a Git ({countdown})
              </button>
              <button
                onClick={() => router.push('/')}
                className="btn-secondary px-6 py-2"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 