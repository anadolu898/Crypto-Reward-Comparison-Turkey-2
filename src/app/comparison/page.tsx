'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ComparisonTable from '../../components/ComparisonTable';
import { apiService } from '../../lib/api';
import Link from 'next/link';
import Image from 'next/image';

// Define local types to avoid import issues
interface StakingOffer {
  coin: string;
  symbol: string;
  apy: string;
  lockupPeriod: string;
  minStaking: string;
  features: string[];
  lastUpdated: string;
  apyTrend: number[];
  dayChange: string;
  rating: number;
  fees: string;
  logoUrl?: string;
}

interface Campaign {
  name: string;
  description: string;
  expiryDate: string;
  requirements: string[];
  reward: string;
  lastUpdated: string;
}

interface PlatformData {
  platform: string;
  website: string;
  stakingOffers: StakingOffer[];
  campaigns: Campaign[];
  lastUpdated: string;
  logoUrl?: string;
}

export default function ComparisonPage() {
  const [data, setData] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to fetch data from the API
        const response = await apiService.getAllRewards();
        
        if (response.success && response.data.length > 0) {
          setData(response.data);
        } else {
          // If the API fails or returns no data, use mock data
          const mockData = await apiService.getMockData();
          setData(mockData);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Veri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        
        // Use mock data as fallback
        const mockData = await apiService.getMockData();
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Calculate stats for the info cards
  const stats = useMemo(() => {
    if (data.length === 0) return { totalOffers: 0, averageApy: 0, maxApy: 0, platformCount: 0 };
    
    let totalOffers = 0;
    let apySum = 0;
    let maxApy = 0;
    
    data.forEach(platform => {
      totalOffers += platform.stakingOffers.length;
      
      platform.stakingOffers.forEach(offer => {
        const apy = parseFloat(offer.apy);
        apySum += apy;
        maxApy = Math.max(maxApy, apy);
      });
    });
    
    return {
      totalOffers,
      averageApy: (apySum / totalOffers).toFixed(2),
      maxApy: maxApy.toFixed(2),
      platformCount: data.length
    };
  }, [data]);

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
              Kripto Para Ödüllerini Karşılaştır
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Türkiye'deki en iyi staking ve ödül fırsatlarını karşılaştırın ve yatırımınızdan maksimum getiri elde edin.
            </p>
            
            {/* Search bar */}
            <div className="relative max-w-xl mx-auto mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Bitcoin, Ethereum, Solana..."
                className="w-full py-3 pl-12 pr-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-1">Platform Sayısı</p>
                <p className="text-2xl font-bold text-white">{stats.platformCount}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-1">Toplam Fırsat</p>
                <p className="text-2xl font-bold text-white">{stats.totalOffers}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-1">Ortalama APY</p>
                <p className="text-2xl font-bold text-white">%{stats.averageApy}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-1">En Yüksek APY</p>
                <p className="text-2xl font-bold text-accent">%{stats.maxApy}</p>
              </div>
            </div>
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Staking Fırsatları</h2>
            
            {/* Supported platforms */}
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Desteklenen platformlar:</span>
              <div className="flex -space-x-4">
                <Image src="/btcturk-logo.png" alt="BtcTurk" width={32} height={32} className="h-8 w-8 rounded-full border-2 border-white dark:border-dark" />
                <Image src="/paribu-logo.png" alt="Paribu" width={32} height={32} className="h-8 w-8 rounded-full border-2 border-white dark:border-dark" />
                <Image src="/binance-logo.png" alt="Binance" width={32} height={32} className="h-8 w-8 rounded-full border-2 border-white dark:border-dark" />
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm text-white border-2 border-white dark:border-dark">
                  +2
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Yükleniyor...</span>
              </div>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">Staking fırsatları yükleniyor...</p>
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
            <>
              <ComparisonTable 
                data={data} 
                showFilters={true} 
                searchQuery={searchQuery}
              />

              {/* FAQ Section */}
              <div className="mt-20">
                <h2 className="text-2xl font-bold mb-8 text-center">Sık Sorulan Sorular</h2>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-dark-card rounded-large p-6 shadow-lg">
                    <h3 className="font-semibold text-lg mb-3">Staking nedir?</h3>
                    <p className="text-gray-700 dark:text-gray-300">Staking, kripto varlıklarınızı bir blokzincirinde kilitleyerek ağın güvenliğine katkıda bulunduğunuz ve karşılığında ödül kazandığınız bir süreçtir.</p>
                  </div>
                  <div className="bg-white dark:bg-dark-card rounded-large p-6 shadow-lg">
                    <h3 className="font-semibold text-lg mb-3">APY ne anlama gelir?</h3>
                    <p className="text-gray-700 dark:text-gray-300">APY (Yıllık Yüzde Getiri), bir yıl içinde kazanabileceğiniz toplam getiriyi, bileşik faiz dahil gösterir.</p>
                  </div>
                  <div className="bg-white dark:bg-dark-card rounded-large p-6 shadow-lg">
                    <h3 className="font-semibold text-lg mb-3">Kilitleme süresi nedir?</h3>
                    <p className="text-gray-700 dark:text-gray-300">Kilitleme süresi, stake ettiğiniz varlıkları çekemeyeceğiniz minimum süreyi ifade eder. Bazı platformlar "esnek" staking seçenekleri sunar.</p>
                  </div>
                  <div className="bg-white dark:bg-dark-card rounded-large p-6 shadow-lg">
                    <h3 className="font-semibold text-lg mb-3">Hangi platformu seçmeliyim?</h3>
                    <p className="text-gray-700 dark:text-gray-300">En iyi platform seçimi, risk toleransınıza, yatırım sürenize ve tercih ettiğiniz kripto varlıklara bağlıdır. Tablomuz, en iyi kararı vermenize yardımcı olur.</p>
                  </div>
                </div>
              </div>

              {/* Premium Upgrade Banner */}
              <div className="mt-20 bg-gradient-to-r from-primary to-secondary rounded-large shadow-xl p-8 text-white overflow-hidden relative">
                <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4 opacity-30">
                  <svg className="w-64 h-64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 21V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="md:flex items-center justify-between relative z-10">
                  <div className="mb-6 md:mb-0 md:mr-12">
                    <h2 className="text-2xl font-bold mb-3">Premium Özelliklere Geçin</h2>
                    <p className="text-white/80 max-w-2xl">
                      Premium üyelik ile daha detaylı karşılaştırmalar, gerçek zamanlı fiyat uyarıları, özel filtreler, API erişimi ve çok daha fazlasını elde edin. Staking stratejinizi üst seviyeye taşıyın.
                    </p>
                    <ul className="mt-4 grid grid-cols-2 gap-2">
                      <li className="flex items-center text-sm text-white/90">
                        <svg className="w-4 h-4 mr-1 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Gerçek zamanlı uyarılar
                      </li>
                      <li className="flex items-center text-sm text-white/90">
                        <svg className="w-4 h-4 mr-1 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Kişiselleştirilmiş öneriler
                      </li>
                      <li className="flex items-center text-sm text-white/90">
                        <svg className="w-4 h-4 mr-1 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Detaylı analiz raporları
                      </li>
                      <li className="flex items-center text-sm text-white/90">
                        <svg className="w-4 h-4 mr-1 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Rekabetçi tablolar
                      </li>
                    </ul>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-sm text-white/70 mb-2">Aylık sadece</div>
                    <div className="text-3xl font-bold mb-3">99₺</div>
                    <Link href="/subscription" className="bg-accent hover:bg-opacity-90 text-dark font-semibold px-8 py-3 rounded-lg inline-block transition-all duration-200 hover:shadow-lg">
                      Premium'a Geç
                    </Link>
                  </div>
                </div>
              </div>
            </>
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