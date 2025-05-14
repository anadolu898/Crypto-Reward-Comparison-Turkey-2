'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Set up countdown to redirect to premium page
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/premium');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="py-16 bg-light dark:bg-dark min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Ödeme İptal Edildi</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Premium abonelik işleminiz tamamlanamadı. Herhangi bir ödeme alınmadı.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Bir sorun mu yaşadınız? <Link href="/contact" className="text-primary hover:text-primary-dark">Bizimle iletişime geçin</Link> veya daha sonra tekrar deneyin.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/premium')}
                className="btn-primary px-6 py-2"
              >
                Premium'a Geri Dön ({countdown})
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