'use client';

import React, { useEffect, useState } from 'react';
import ComparisonTable from '../../components/ComparisonTable';
import { PlatformData, apiService } from '../../lib/api';
import Link from 'next/link';

export default function ComparisonPage() {
  const [data, setData] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="py-12 bg-light dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Kripto Para Ödüllerini Karşılaştır</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Türkiye'deki kripto borsalarının staking, kampanya ve ödül fırsatlarını karşılaştırın ve
            yatırımınız için en iyi getiriyi bulun.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Yükleniyor...</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Veriler yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
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
            <ComparisonTable data={data} showFilters={true} />

            {/* Premium Upgrade Banner */}
            <div className="mt-12 bg-primary rounded-lg shadow-lg p-8 text-white">
              <div className="md:flex items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">Premium Özelliklere Geçin</h2>
                  <p className="text-white/80 max-w-2xl">
                    Daha detaylı karşılaştırmalar, gerçek zamanlı uyarılar, özel filtreler ve daha fazlası için premium üyeliğe geçin.
                  </p>
                </div>
                <Link href="/subscription" className="bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                  Premium'a Geç
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Data Update Notice */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Son veri güncellemesi: {new Date().toLocaleDateString('tr-TR')}</p>
          <p className="mt-1">
            Bu veriler bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımaz.
            Her zaman resmi platform sayfalarını kontrol edin.
          </p>
        </div>
      </div>
    </div>
  );
} 