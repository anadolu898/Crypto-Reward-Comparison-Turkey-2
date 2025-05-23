'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const subscriptionPlans = [
  {
    name: 'Ücretsiz',
    price: '0 ₺',
    period: 'Süresiz',
    description: 'Temel karşılaştırma ve bilgilere erişim.',
    features: [
      { name: 'Temel karşılaştırma tablosu', included: true },
      { name: 'Sınırlı filtreleme seçenekleri', included: true },
      { name: 'Platformlar hakkında temel bilgiler', included: true },
      { name: 'Günlük veri güncellemeleri', included: false },
      { name: 'Gelişmiş tablolar ve grafikler', included: false },
      { name: 'Daha detaylı platform analizleri', included: false },
      { name: 'Gelişmiş veri filtreleme ve sıralama', included: false },
      { name: 'Özelleştirilmiş karşılaştırma görünümü', included: false },
      { name: 'PDF raporu indirme', included: false },
    ],
    buttonText: 'Mevcut Plan',
    popular: false,
    buttonVariant: 'secondary'
  },
  {
    name: 'Premium Aylık',
    price: '99 ₺',
    period: 'Aylık',
    description: 'En güncel bilgiler ve gelişmiş özellikler.',
    features: [
      { name: 'Temel karşılaştırma tablosu', included: true },
      { name: 'Gelişmiş filtreleme seçenekleri', included: true },
      { name: 'Platformlar hakkında temel bilgiler', included: true },
      { name: 'Günlük veri güncellemeleri', included: true },
      { name: 'Gelişmiş tablolar ve grafikler', included: true },
      { name: 'Daha detaylı platform analizleri', included: true },
      { name: 'Gelişmiş veri filtreleme ve sıralama', included: true },
      { name: 'Özelleştirilmiş karşılaştırma görünümü', included: true },
      { name: 'PDF raporu indirme', included: true },
    ],
    buttonText: 'Şimdi Abone Ol',
    popular: true,
    buttonVariant: 'primary'
  },
  {
    name: 'Premium Yıllık',
    price: '899 ₺',
    period: 'Yıllık',
    description: 'En iyi değer, 2 ay ücretsiz.',
    features: [
      { name: 'Temel karşılaştırma tablosu', included: true },
      { name: 'Gelişmiş filtreleme seçenekleri', included: true },
      { name: 'Platformlar hakkında temel bilgiler', included: true },
      { name: 'Günlük veri güncellemeleri', included: true },
      { name: 'Gelişmiş tablolar ve grafikler', included: true },
      { name: 'Daha detaylı platform analizleri', included: true },
      { name: 'Gelişmiş veri filtreleme ve sıralama', included: true },
      { name: 'Özelleştirilmiş karşılaştırma görünümü', included: true },
      { name: 'PDF raporu indirme', included: true },
    ],
    buttonText: 'Şimdi Abone Ol',
    popular: false,
    buttonVariant: 'primary'
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  
  // Check if user is premium when component mounts
  useEffect(() => {
    const userIsPremium = localStorage.getItem('isPremium') === 'true';
    setIsPremium(userIsPremium);
  }, []);

  const handleSubscribe = (planName: string) => {
    setSelectedPlan(planName);
    
    // For demo purposes only - in a real app this would integrate with a payment gateway
    if (planName !== 'Ücretsiz') {
      const shouldProceed = window.confirm(
        `Bu bir demo uygulamasıdır. Gerçek bir ödeme yapılmayacaktır. "${planName}" planına geçiş yapmak istediğinizden emin misiniz?`
      );
      
      if (shouldProceed) {
        // Set the user as premium in localStorage
        localStorage.setItem('isPremium', 'true');
        setIsPremium(true);
        
        // Show success message
        alert(`Tebrikler! ${planName} aboneliğiniz başarıyla etkinleştirildi. Premium özelliklere erişebilirsiniz.`);
        
        // Redirect to comparison page to try premium features
        router.push('/comparison');
      }
    }
  };
  
  // Function to cancel premium (for demo purposes)
  const handleCancelPremium = () => {
    const shouldCancel = window.confirm(
      'Premium üyeliğinizi iptal etmek istediğinizden emin misiniz?'
    );
    
    if (shouldCancel) {
      localStorage.removeItem('isPremium');
      setIsPremium(false);
      alert('Premium üyeliğiniz iptal edildi.');
    }
  };

  return (
    <div className="py-12 bg-light dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Premium Üyelik Planları</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Kripto para yatırımlarınızdan maksimum getiri elde etmek için premium özelliklere erişin ve
            en iyi fırsatları kaçırmayın.
          </p>
          
          {/* Show premium status */}
          {isPremium && (
            <div className="mt-4 mb-6 inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Premium üyeliğiniz aktif!</span>
                <button 
                  onClick={handleCancelPremium}
                  className="ml-4 text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  İptal Et
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan, index) => (
            <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <div className="bg-primary text-white py-2 text-center text-sm font-semibold">
                  En Popüler Plan
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-extrabold">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>
                <button 
                  onClick={() => plan.buttonVariant === 'primary' ? handleSubscribe(plan.name) : null}
                  className={`w-full py-3 rounded-md font-semibold ${plan.buttonVariant === 'primary' ? 'bg-primary text-white hover:bg-secondary' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition-colors`}
                >
                  {plan.buttonText}
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6">
                <h4 className="font-medium mb-4">Özellikler</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${feature.included ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'}`}>
                        {feature.included ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </div>
                      <span className={`ml-2 ${feature.included ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Sık Sorulan Sorular</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Premium üyelik satın aldığımda hemen erişim sağlayabilir miyim?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Evet, ödemeniz onaylandıktan hemen sonra premium özelliklere erişiminiz açılır.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Aboneliğimi istediğim zaman iptal edebilir miyim?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Evet, aylık aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal işleminden sonra, mevcut ödeme döneminin sonuna kadar premium özelliklere erişiminiz devam eder.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Hangi ödeme yöntemlerini kabul ediyorsunuz?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Kredi kartı, banka havalesi ve belirli kripto para birimleri ile ödeme yapabilirsiniz.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Verileriniz ne kadar güncel?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Premium üyeler için veriler saatlik olarak güncellenir. Ücretsiz plan için veriler günlük olarak güncellenir.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Yıllık plandan aylık plana geçiş yapabilir miyim?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Evet, yıllık aboneliğinizin süresi dolduğunda aylık plana geçiş yapabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Hala Sorularınız Mı Var?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Detaylı bilgi için bizimle iletişime geçebilirsiniz.
          </p>
          <Link href="/about#contact" className="btn-primary">
            İletişime Geçin
          </Link>
        </div>
      </div>
    </div>
  );
} 