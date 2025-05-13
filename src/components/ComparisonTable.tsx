'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ApySparkline from '../charts/ApySparkline';
import StarRating from '../ui/StarRating';
import { downloadPDF } from '../lib/pdfExport';

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

interface ComparisonTableProps {
  data: PlatformData[];
  showFilters?: boolean;
  searchQuery?: string;
  isPremium?: boolean;
}

export default function ComparisonTable({ 
  data, 
  showFilters = true,
  searchQuery = '',
  isPremium = false
}: ComparisonTableProps) {
  const router = useRouter();
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set());
  const [visibleOffers, setVisibleOffers] = useState<number>(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'apy', direction: 'desc' });
  const [filters, setFilters] = useState({
    minApy: '',
    maxLockup: '',
    coin: '',
    platform: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Toggle expanded state for a platform
  const toggleExpand = (platform: string) => {
    const newExpandedPlatforms = new Set(expandedPlatforms);
    if (expandedPlatforms.has(platform)) {
      newExpandedPlatforms.delete(platform);
    } else {
      newExpandedPlatforms.add(platform);
    }
    setExpandedPlatforms(newExpandedPlatforms);
  };
  
  // Load more offers
  const loadMore = () => {
    setVisibleOffers(prev => prev + 10);
  };
  
  // Reset offers count
  const resetVisibleOffers = () => {
    setVisibleOffers(10);
  };
  
  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    resetVisibleOffers();
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      minApy: '',
      maxLockup: '',
      coin: '',
      platform: '',
    });
    resetVisibleOffers();
  };
  
  // Handle column sort
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };
  
  // Extract unique coins and platforms for filters
  const uniqueCoins = useMemo(() => {
    const coins = new Set<string>();
    data.forEach(platform => {
      platform.stakingOffers.forEach(offer => {
        coins.add(offer.coin);
      });
    });
    return Array.from(coins).sort();
  }, [data]);
  
  const uniquePlatforms = useMemo(() => {
    return data.map(platform => platform.platform).sort();
  }, [data]);
  
  // Filter and sort the data
  const filteredAndSortedData = useMemo(() => {
    // Flatten the data structure for easier filtering
    let flatData: Array<{platform: string; website: string; offer: StakingOffer; logoUrl?: string}> = [];
    
    data.forEach(platform => {
      platform.stakingOffers.forEach(offer => {
        flatData.push({
          platform: platform.platform,
          website: platform.website,
          offer,
          logoUrl: platform.logoUrl
        });
      });
    });
    
    // Apply search filter if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      flatData = flatData.filter(item => 
        item.platform.toLowerCase().includes(query) ||
        item.offer.coin.toLowerCase().includes(query) ||
        item.offer.symbol.toLowerCase().includes(query)
      );
    }
    
    // Apply other filters
    if (filters.minApy) {
      flatData = flatData.filter(item => parseFloat(item.offer.apy) >= parseFloat(filters.minApy));
    }
    
    if (filters.maxLockup) {
      flatData = flatData.filter(item => {
        // Handle "Flexible" lockup periods
        if (item.offer.lockupPeriod.toLowerCase() === 'esnek' || 
            item.offer.lockupPeriod.toLowerCase() === 'flexible') {
          return true;
        }
        const lockupDays = parseInt(item.offer.lockupPeriod);
        return !isNaN(lockupDays) && lockupDays <= parseInt(filters.maxLockup);
      });
    }
    
    if (filters.coin) {
      flatData = flatData.filter(item => item.offer.coin === filters.coin);
    }
    
    if (filters.platform) {
      flatData = flatData.filter(item => item.platform === filters.platform);
    }
    
    // Sort the data
    flatData.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.key) {
        case 'platform':
          aValue = a.platform;
          bValue = b.platform;
          break;
        case 'coin':
          aValue = a.offer.coin;
          bValue = b.offer.coin;
          break;
        case 'apy':
          aValue = parseFloat(a.offer.apy);
          bValue = parseFloat(b.offer.apy);
          break;
        case 'lockup':
          // Handle "Flexible" lockup periods for sorting
          aValue = a.offer.lockupPeriod.toLowerCase() === 'esnek' || 
                  a.offer.lockupPeriod.toLowerCase() === 'flexible' 
                  ? 0 : parseInt(a.offer.lockupPeriod);
          bValue = b.offer.lockupPeriod.toLowerCase() === 'esnek' || 
                  b.offer.lockupPeriod.toLowerCase() === 'flexible' 
                  ? 0 : parseInt(b.offer.lockupPeriod);
          break;
        case 'min':
          // Extract numerical value from min staking (e.g., "0.1 ETH" -> 0.1)
          aValue = parseFloat(a.offer.minStaking.split(' ')[0]);
          bValue = parseFloat(b.offer.minStaking.split(' ')[0]);
          break;
        case 'rating':
          aValue = a.offer.rating;
          bValue = b.offer.rating;
          break;
        default:
          return 0;
      }
      
      // For strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // For numbers
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return flatData;
  }, [data, sortConfig, filters, searchQuery]);
  
  // Get visible data based on load more feature
  const visibleData = filteredAndSortedData.slice(0, visibleOffers);
  
  // Function to determine arrow direction for sorted column
  const getSortArrow = (column: string) => {
    if (sortConfig.key !== column) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  
  // Function to get the platform logo URL
  const getPlatformLogoUrl = (platform: string): string => {
    // Default path for platform logos
    const defaultPath = `/logos/${platform.toLowerCase()}-logo.svg`;
    
    // Try to get the logo from the platform data
    const platformData = data.find(p => p.platform === platform);
    
    // Return the logo URL from the data if it exists, otherwise return the default path
    return platformData?.logoUrl || defaultPath;
  };
  
  // Function to export data as PDF
  const handleExportPDF = () => {
    if (!isPremium) {
      // Show premium upgrade prompt
      const shouldUpgrade = window.confirm(
        'PDF raporu indirmek premium bir özelliktir. Premium aboneliğe yükseltmek ister misiniz?'
      );
      
      if (shouldUpgrade) {
        router.push('/subscription');
      }
      return;
    }
    
    // Download PDF with current filters
    downloadPDF(data, filters);
  };
  
  return (
    <div>
      {/* Filters Section */}
      {showFilters && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Filtreleme ve Sıralama</h3>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="text-sm text-primary hover:text-primary-dark underline md:hidden"
            >
              {isFilterOpen ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
            </button>
          </div>
          
          <div className={`bg-white dark:bg-dark-card rounded-large shadow-md overflow-hidden transition-all duration-300 ${
            isFilterOpen ? 'max-h-[500px]' : 'max-h-0 md:max-h-[500px]'
          }`}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minimum APY (%)
                  </label>
                  <input
                    type="number"
                    name="minApy"
                    value={filters.minApy}
                    onChange={handleFilterChange}
                    placeholder="örn. 5"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maksimum Kilitleme Süresi (gün)
                  </label>
                  <input
                    type="number"
                    name="maxLockup"
                    value={filters.maxLockup}
                    onChange={handleFilterChange}
                    placeholder="örn. 30"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kripto Para
                  </label>
                  <select
                    name="coin"
                    value={filters.coin}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Tümü</option>
                    {uniqueCoins.map(coin => (
                      <option key={coin} value={coin}>{coin}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Platform
                  </label>
                  <select
                    name="platform"
                    value={filters.platform}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Tümü</option>
                    {uniquePlatforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary mr-2"
                >
                  Filtreleri Temizle
                </button>
                
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {filteredAndSortedData.length} sonuç bulundu
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-dark-card rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('platform')}>
                Platform {getSortArrow('platform')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('coin')}>
                Kripto {getSortArrow('coin')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('apy')}>
                APY {getSortArrow('apy')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('lockup')}>
                Kilitleme Süresi {getSortArrow('lockup')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('min')}>
                Min. Miktar {getSortArrow('min')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('rating')}>
                Değerlendirme {getSortArrow('rating')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Detaylar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
            {visibleData.length > 0 ? (
              visibleData.map((item, index) => (
                <tr 
                  key={`${item.platform}-${item.offer.coin}-${index}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  style={{
                    animation: `fadeIn 0.5s ease-in-out ${index * 0.05}s forwards`,
                    opacity: 0
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                        <Image 
                          src={getPlatformLogoUrl(item.platform)} 
                          alt={item.platform} 
                          width={32} 
                          height={32} 
                          className="h-8 w-8"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.platform}
                        </div>
                        <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                          {item.website.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden mr-2">
                        {item.offer.logoUrl ? (
                          <Image 
                            src={item.offer.logoUrl} 
                            alt={item.offer.coin} 
                            width={24} 
                            height={24} 
                            className="h-6 w-6"
                          />
                        ) : (
                          <span className="text-xs font-semibold">{item.offer.symbol}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.offer.coin}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.offer.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-primary">
                        %{item.offer.apy}
                        <span className={`ml-1 text-xs ${
                          parseFloat(item.offer.dayChange) > 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : parseFloat(item.offer.dayChange) < 0 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {parseFloat(item.offer.dayChange) > 0 ? '↑' : parseFloat(item.offer.dayChange) < 0 ? '↓' : ''}
                          {parseFloat(item.offer.dayChange) !== 0 && `${item.offer.dayChange}%`}
                        </span>
                      </div>
                      <div className="h-8 mt-1">
                        <ApySparkline data={item.offer.apyTrend} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {item.offer.lockupPeriod.toLowerCase() === 'esnek' || 
                       item.offer.lockupPeriod.toLowerCase() === 'flexible' 
                        ? 'Esnek' 
                        : `${item.offer.lockupPeriod} gün`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {item.offer.minStaking}
                    </div>
                    {item.offer.fees !== '0%' && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Ücret: {item.offer.fees}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StarRating rating={item.offer.rating} />
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.offer.features.length > 0 && (
                        <span className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-full">
                          {item.offer.features[0]}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/platform/${item.platform.toLowerCase()}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      Detaylar →
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">Sonuç bulunamadı</p>
                    <p>Lütfen filtreleme kriterlerinizi değiştirin veya tüm filtreleri temizleyin.</p>
                    <button 
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    >
                      Filtreleri Temizle
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Load More Button */}
      {visibleData.length < filteredAndSortedData.length && (
        <div className="mt-6 text-center">
          <button 
            onClick={loadMore}
            className="px-6 py-3 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors"
          >
            Daha Fazla Göster ({visibleData.length} / {filteredAndSortedData.length})
          </button>
        </div>
      )}
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}