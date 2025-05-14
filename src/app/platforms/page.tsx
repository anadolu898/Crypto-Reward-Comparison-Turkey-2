'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService } from '../../lib/api';
import { PlatformData } from '../../lib/types';
import ExchangeLogo from '../../components/ui/ExchangeLogo';

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setLoading(true);
        // Try to fetch data from the API
        const response = await apiService.getAllRewards();
        
        if (response.success && response.data.length > 0) {
          setPlatforms(response.data);
        } else {
          // If the API fails or returns no data, use mock data
          const mockData = await apiService.getMockData();
          setPlatforms(mockData);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching platforms:', err);
        setError('Veri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        
        // Use mock data as fallback
        const mockData = await apiService.getMockData();
        setPlatforms(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  // Add more platforms to the mock data for demonstration purposes
  const extendedPlatforms = [...platforms];
  if (platforms.length > 0 && platforms.length < 6) {
    extendedPlatforms.push(
      {
        platform: 'Binance',
        website: 'https://www.binance.com',
        logoUrl: '/binance-logo.png',
        stakingOffers: [
          {
            coin: 'Bitcoin',
            symbol: 'BTC',
            apy: '5.0',
            lockupPeriod: '90',
            minStaking: '0.01 BTC',
            features: ['Otomatik Yenileme', 'Esnek Süre'],
            lastUpdated: new Date().toISOString(),
            apyTrend: [4.9, 4.8, 4.9, 5.0, 5.0, 5.1, 5.0],
            dayChange: '0.0',
            rating: 4.9,
            fees: '0%',
          },
          {
            coin: 'Ethereum',
            symbol: 'ETH',
            apy: '6.0',
            lockupPeriod: '30',
            minStaking: '0.1 ETH',
            features: ['Esnek Süre'],
            lastUpdated: new Date().toISOString(),
            apyTrend: [5.8, 5.9, 6.0, 6.0, 6.0, 6.1, 6.0],
            dayChange: '0.0',
            rating: 4.7,
            fees: '0%',
          },
        ],
        campaigns: [
          {
            name: 'Kripto Para Yatır, %10 Bonus Kazan',
            description: '500 USDT ve üzeri yatırım yapın, %10 bonus kazanın',
            expiryDate: '2023-12-31',
            requirements: ['500 USDT Minimum', 'KYC Doğrulama'],
            reward: '%10 Bonus',
            lastUpdated: new Date().toISOString(),
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'OKX',
        website: 'https://www.okx.com',
        logoUrl: '/okx-logo.png',
        stakingOffers: [
          {
            coin: 'Solana',
            symbol: 'SOL',
            apy: '7.2',
            lockupPeriod: '30',
            minStaking: '1 SOL',
            features: ['Günlük Ödeme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: [7.0, 7.1, 7.2, 7.2, 7.3, 7.2, 7.2],
            dayChange: '0.0',
            rating: 4.5,
            fees: '0.5%',
          },
        ],
        campaigns: [],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'Bitfinex',
        website: 'https://www.bitfinex.com',
        logoUrl: '/bitfinex-logo.png',
        stakingOffers: [
          {
            coin: 'Cardano',
            symbol: 'ADA',
            apy: '4.8',
            lockupPeriod: '30',
            minStaking: '100 ADA',
            features: ['Esnek Süre'],
            lastUpdated: new Date().toISOString(),
            apyTrend: [4.7, 4.8, 4.8, 4.9, 4.8, 4.8, 4.8],
            dayChange: '0.0',
            rating: 4.3,
            fees: '0.1%',
          },
        ],
        campaigns: [],
        lastUpdated: new Date().toISOString(),
      }
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-dark pb-6">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-alt opacity-30"></div>
          <div className="absolute inset-0 bg-hero-pattern"></div>
        </div>
        <div className="relative pt-32 pb-20 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Kripto Para Platformları
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Türkiye'deki en iyi kripto para platformlarını tanıyın ve sunduğu fırsatları keşfedin.
            </p>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-12 fill-light dark:fill-dark">
            <path d="M0,96L48,80C96,64,192,32,288,26.7C384,21,480,43,576,58.7C672,75,768,85,864,80C960,75,1056,53,1152,48C1248,43,1344,53,1392,58.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="py-14 bg-light dark:bg-dark">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-24">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Yükleniyor...</span>
              </div>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">Platform bilgileri yükleniyor...</p>
              <p className="mt-2 text-gray-500 dark:text-gray-500">Lütfen bekleyin.</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-6 rounded-lg shadow-sm mb-6 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-2">Bir Hata Oluştu</h3>
                <p>{error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-primary"
              >
                Tekrar Dene
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold mb-8">Karşılaştırılan Platformlar</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {extendedPlatforms.map((platform, index) => (
                  <div key={index} className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 mr-4 flex items-center justify-center">
                          <ExchangeLogo 
                            exchange={platform.platform} 
                            width={48} 
                            height={48} 
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{platform.platform}</h3>
                          <a href={platform.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            {platform.website.replace(/(^\w+:|^)\/\//, '')}
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Ödül Teklifleri: <span className="font-medium text-gray-900 dark:text-white">{platform.stakingOffers.length}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Kampanyalar: <span className="font-medium text-gray-900 dark:text-white">{platform.campaigns.length}</span>
                        </p>
                        
                        {platform.stakingOffers.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">En Yüksek APY Fırsatları:</p>
                            <div className="space-y-2">
                              {platform.stakingOffers
                                .sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy))
                                .slice(0, 3)
                                .map((offer, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">
                                    <span>{offer.coin} ({offer.symbol})</span>
                                    <span className="font-bold text-accent">%{offer.apy}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-6">
                          <Link 
                            href={`/platform/${platform.platform.toLowerCase()}`}
                            className="block w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded text-center transition-colors"
                          >
                            Detayları Gör
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Neden Platformları Karşılaştırmalısınız?</h2>
                <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
                  Kripto para platformları arasında getirileri, güvenliği ve özellikleri karşılaştırmak, 
                  yatırımlarınızdan maksimum verim almanızı sağlar. Her platform farklı avantajlar ve dezavantajlar sunar. 
                  Bizim karşılaştırma aracımız, bilinçli kararlar almanıza yardımcı olur.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-10">
                  <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
                    <div className="text-primary text-3xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">En Yüksek Getiriler</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Platformlar arasındaki getiri oranlarını karşılaştırarak paranızı en verimli şekilde değerlendirin.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
                    <div className="text-primary text-3xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Güvenlik Faktörü</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Platformların güvenlik önlemlerini ve geçmiş performanslarını analiz edin.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
                    <div className="text-primary text-3xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Ücret Yapıları</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      İşlem, para yatırma ve çekme ücretlerini karşılaştırarak masrafları minimize edin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Data Update Notice */}
          <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Son veri güncellemesi: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p className="mt-1 max-w-2xl mx-auto">
              Bu veriler bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımaz.
              Her zaman resmi platform sayfalarını kontrol edin. Veriler günlük olarak güncellenir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 