'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

interface PlanOption {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
}

export default function PremiumPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const plans: PlanOption[] = [
    {
      id: 'monthly',
      name: 'Aylık Premium',
      price: '₺99',
      period: 'aylık',
      features: [
        'Tüm borsaların staking oranlarını karşılaştırın',
        'Kampanya uyarıları alın',
        'Kişiselleştirilmiş portföy tavsiyeleri',
        'Canlı fiyat güncellemeleri'
      ]
    },
    {
      id: 'annual',
      name: 'Yıllık Premium',
      price: '₺999',
      period: 'yıllık',
      features: [
        'Tüm aylık özellikleri içerir',
        '2 ay ücretsiz (₺198 tasarruf)',
        'Öncelikli destek',
        'Gelişmiş market analizleri',
        'API erişimi'
      ]
    }
  ];

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/premium');
    }
  }, [isLoading, isAuthenticated, router]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await axios.post(
        `${apiUrl}/api/payment/create-checkout-session`,
        { plan: selectedPlan },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      // Redirect to Stripe Checkout
      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        setError('Ödeme sayfası oluşturulamadı.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ödeme işlemi başlatılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user?.is_premium) {
    return (
      <div className="py-16 bg-light dark:bg-dark min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4">Zaten Premium Üyesiniz!</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Premium hesabınız {user.premium_expires ? new Date(user.premium_expires).toLocaleDateString('tr-TR') : 'süresiz'} tarihine kadar aktif.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tüm premium özelliklerimize erişebilirsiniz. İyi kullanımlar!
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary px-8 py-3"
              >
                Dashboard'a Git
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-light dark:bg-dark min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Premium'a Yükseltin</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Premium hesapla Türkiye'deki tüm kripto borsalarının staking ödüllerine ve kampanyalarına tam erişim elde edin.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative ${
                selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.id === 'annual' && (
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                  En İyi Değer
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">/{plan.period}</span>
                </div>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-md font-medium ${
                    selectedPlan === plan.id
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {selectedPlan === plan.id ? 'Seçildi' : 'Seç'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto mt-12 text-center">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary py-3 px-8 text-lg w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşleniyor...
              </span>
            ) : (
              'Premium'a Yükselt'
            )}
          </button>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
            Güvenli ödeme için Stripe altyapısı kullanılmaktadır. İptal etmek isterseniz, aboneliğinizi istediğiniz zaman iptal edebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
} 