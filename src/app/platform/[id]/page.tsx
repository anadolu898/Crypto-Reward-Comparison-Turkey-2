'use client';

import React, { useEffect, useState } from 'react';
import { PlatformData, StakingOffer, Campaign, apiService } from '../../../lib/api';
import Link from 'next/link';

interface PlatformPageProps {
  params: {
    id: string;
  };
}

export default function PlatformPage({ params }: PlatformPageProps) {
  const { id } = params;
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch data for the specific platform
        const response = await apiService.getPlatformRewards(id);
        
        if (response.success && response.data) {
          setPlatformData(response.data);
        } else {
          // If the API fails, use mock data
          const mockData = await apiService.getMockData();
          const platform = mockData.find(p => p.platform.toLowerCase() === id.toLowerCase());
          
          if (platform) {
            setPlatformData(platform);
          } else {
            setError('Bu platform için veri bulunamadı.');
          }
        }
      } catch (err) {
        console.error(`Error fetching data for platform ${id}:`, err);
        setError('Veri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        
        // Try to use mock data as fallback
        try {
          const mockData = await apiService.getMockData();
          const platform = mockData.find(p => p.platform.toLowerCase() === id.toLowerCase());
          
          if (platform) {
            setPlatformData(platform);
          }
        } catch (mockErr) {
          console.error('Error loading mock data:', mockErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Function to format APY with % symbol
  const formatApy = (apy: string) => {
    return `%${apy}`;
  };

  if (loading) {
    return (
      <div className="py-16 bg-light dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Yükleniyor...</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Platform bilgileri yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !platformData) {
    return (
      <div className="py-16 bg-light dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-2">Hata</h2>
              <p>{error || 'Platform bilgileri bulunamadı.'}</p>
            </div>
            <Link href="/comparison" className="btn-primary">
              Karşılaştırma Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-light dark:bg-dark">
      <div className="container mx-auto px-4">
        {/* Platform Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{platformData.platform}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                <a href={platformData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">
                  {platformData.website}
                </a>
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/comparison" className="text-primary hover:text-secondary mr-4">
                ← Karşılaştırmaya Dön
              </Link>
              <a 
                href={platformData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Platformu Ziyaret Et
              </a>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary rounded"></div>
        </div>

        {/* Staking Offers Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Staking Fırsatları</h2>
          
          {platformData.stakingOffers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformData.stakingOffers.map((offer: StakingOffer, index: number) => (
                <div key={index} className="card border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{offer.coin} Staking</h3>
                    <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      {formatApy(offer.apy)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Minimum Miktar:</span>
                      <span className="font-medium">{offer.minStaking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Kilitleme Süresi:</span>
                      <span className="font-medium">{offer.lockupPeriod} gün</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Özellikler:</h4>
                    <div className="flex flex-wrap gap-2">
                      {offer.features.map((feature, i) => (
                        <span key={i} className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a 
                      href={`${platformData.website}/staking`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary flex items-center"
                    >
                      <span>Stake Et</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">Bu platform için staking fırsatı bulunamadı.</p>
            </div>
          )}
        </div>

        {/* Campaigns Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Güncel Kampanyalar</h2>
          
          {platformData.campaigns && platformData.campaigns.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {platformData.campaigns.map((campaign: Campaign, index: number) => (
                <div key={index} className="card border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{campaign.name}</h3>
                    <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      {campaign.expiryDate}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{campaign.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gereksinimler:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {campaign.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ödül:</h4>
                      <p className="text-sm font-semibold">{campaign.reward}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a 
                      href={`${platformData.website}/campaigns`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary flex items-center"
                    >
                      <span>Kampanyaya Katıl</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">Bu platform için aktif kampanya bulunamadı.</p>
            </div>
          )}
        </div>

        {/* Related Platforms Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Diğer Platformlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['BtcTurk', 'Paribu', 'Binance TR', 'Bitexen'].filter(p => 
              p.toLowerCase() !== platformData.platform.toLowerCase()
            ).map((platform, index) => (
              <Link 
                key={index}
                href={`/platform/${platform.toLowerCase().replace(' ', '-')}`}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center hover:border-primary hover:shadow-md transition-all"
              >
                <span className="font-medium">{platform}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Premium Banner */}
        <div className="mt-12 bg-primary rounded-lg shadow-lg p-8 text-white">
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Daha Fazla Detay İçin Premium</h2>
              <p className="text-white/80 max-w-2xl">
                Tarihsel APY verileri, otomatik uyarılar ve daha detaylı platform karşılaştırmaları için premium üyeliğe geçin.
              </p>
            </div>
            <Link href="/subscription" className="bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Premium'a Geç
            </Link>
          </div>
        </div>

        {/* Data Notice */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          <p className="mt-1">
            Bu veriler bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımaz.
            Her zaman resmi platform sayfalarını kontrol edin.
          </p>
        </div>
      </div>
    </div>
  );
} 