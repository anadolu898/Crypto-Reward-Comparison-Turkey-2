'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ApySparkline from './charts/ApySparkline';
import StarRating from './ui/StarRating';

// Define types locally to avoid import issues
type AssetCategory = 'Proof-of-Stake' | 'DeFi LP' | 'Liquid Staking' | 'All';
type ChainType = 'Ethereum' | 'BNB Smart Chain' | 'Solana' | 'Avalanche' | 'All';

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

interface PlatformData {
  platform: string;
  website: string;
  stakingOffers: StakingOffer[];
  campaigns: any[];
  lastUpdated: string;
  logoUrl?: string;
}

interface ComparisonTableProps {
  data: PlatformData[];
  showFilters?: boolean;
  searchQuery?: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data, showFilters = true, searchQuery = '' }) => {
  // States for filtering and sorting
  const [platformFilter, setPlatformFilter] = useState<string>('');
  const [coinFilter, setCoinFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory>('All');
  const [chainFilter, setChainFilter] = useState<ChainType>('All');
  const [minApyFilter, setMinApyFilter] = useState<string>('');
  const [maxLockupFilter, setMaxLockupFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('apy_high');
  const [visibleRows, setVisibleRows] = useState<number>(10);
  const [fadeIn, setFadeIn] = useState<boolean[]>([]);

  // Map coins to their categories and chains (in a real app, this would come from your API)
  const coinMetadata = useMemo(() => {
    return {
      'BTC': { category: 'Proof-of-Stake', chain: 'All' },
      'ETH': { category: 'Proof-of-Stake', chain: 'Ethereum' },
      'BNB': { category: 'Proof-of-Stake', chain: 'BNB Smart Chain' },
      'SOL': { category: 'Proof-of-Stake', chain: 'Solana' },
      'DOT': { category: 'Proof-of-Stake', chain: 'All' },
      'ADA': { category: 'Proof-of-Stake', chain: 'All' },
      'AVAX': { category: 'Proof-of-Stake', chain: 'Avalanche' },
      'ATOM': { category: 'Proof-of-Stake', chain: 'All' },
      'TRX': { category: 'Proof-of-Stake', chain: 'All' },
      'XTZ': { category: 'Proof-of-Stake', chain: 'All' },
      'USDT': { category: 'DeFi LP', chain: 'Ethereum' },
    };
  }, []);

  // Extract unique platform names
  const platforms = useMemo(() => {
    const platformSet = new Set<string>();
    data.forEach(platform => platformSet.add(platform.platform));
    return Array.from(platformSet);
  }, [data]);

  // Extract unique coin names
  const coins = useMemo(() => {
    const coinSet = new Set<string>();
    data.forEach(platform => {
      platform.stakingOffers.forEach(offer => coinSet.add(offer.symbol));
    });
    return Array.from(coinSet);
  }, [data]);

  // Categories and chains for filtering
  const assetCategories: AssetCategory[] = ['All', 'Proof-of-Stake', 'DeFi LP', 'Liquid Staking'];
  const chainTypes: ChainType[] = ['All', 'Ethereum', 'BNB Smart Chain', 'Solana', 'Avalanche'];

  // Process and transform data for the table
  const tableData = useMemo(() => {
    // Flatten the data structure
    const flatData: Array<StakingOffer & { platform: string, website: string, platformLogoUrl: string }> = [];
    
    data.forEach(platform => {
      platform.stakingOffers.forEach(offer => {
        flatData.push({
          ...offer,
          platform: platform.platform,
          website: platform.website,
          platformLogoUrl: platform.logoUrl || ''
        });
      });
    });
    
    // Apply filters
    let filteredData = flatData;
    
    // Apply search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.platform.toLowerCase().includes(query) ||
        item.coin.toLowerCase().includes(query) ||
        item.symbol.toLowerCase().includes(query) ||
        item.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    if (platformFilter) {
      filteredData = filteredData.filter(item => item.platform.toLowerCase() === platformFilter.toLowerCase());
    }
    
    if (coinFilter) {
      filteredData = filteredData.filter(item => item.symbol.toLowerCase() === coinFilter.toLowerCase());
    }
    
    if (categoryFilter !== 'All') {
      filteredData = filteredData.filter(item => {
        const metadata = coinMetadata[item.symbol as keyof typeof coinMetadata];
        return metadata && metadata.category === categoryFilter;
      });
    }
    
    if (chainFilter !== 'All') {
      filteredData = filteredData.filter(item => {
        const metadata = coinMetadata[item.symbol as keyof typeof coinMetadata];
        return metadata && (metadata.chain === chainFilter || metadata.chain === 'All');
      });
    }
    
    if (minApyFilter) {
      const minApy = parseFloat(minApyFilter);
      filteredData = filteredData.filter(item => parseFloat(item.apy) >= minApy);
    }
    
    if (maxLockupFilter) {
      const maxLockup = parseInt(maxLockupFilter);
      filteredData = filteredData.filter(item => {
        const lockupPeriod = parseInt(item.lockupPeriod);
        return lockupPeriod <= maxLockup;
      });
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'apy_high':
        filteredData.sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy));
        break;
      case 'apy_low':
        filteredData.sort((a, b) => parseFloat(a.apy) - parseFloat(b.apy));
        break;
      case 'min_high':
        filteredData.sort((a, b) => {
          const aValue = parseFloat(a.minStaking.split(' ')[0]);
          const bValue = parseFloat(b.minStaking.split(' ')[0]);
          return bValue - aValue;
        });
        break;
      case 'min_low':
        filteredData.sort((a, b) => {
          const aValue = parseFloat(a.minStaking.split(' ')[0]);
          const bValue = parseFloat(b.minStaking.split(' ')[0]);
          return aValue - bValue;
        });
        break;
      case 'period_high':
        filteredData.sort((a, b) => parseInt(b.lockupPeriod) - parseInt(a.lockupPeriod));
        break;
      case 'period_low':
        filteredData.sort((a, b) => parseInt(a.lockupPeriod) - parseInt(b.lockupPeriod));
        break;
      case 'rating_high':
        filteredData.sort((a, b) => b.rating - a.rating);
        break;
      case '24h_change':
        filteredData.sort((a, b) => parseFloat(b.dayChange) - parseFloat(a.dayChange));
        break;
      default:
        break;
    }
    
    return filteredData;
  }, [data, platformFilter, coinFilter, categoryFilter, chainFilter, minApyFilter, maxLockupFilter, sortBy, coinMetadata, searchQuery]);

  // Handle filter and sort changes
  const handlePlatformFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatformFilter(e.target.value);
  };

  const handleCoinFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCoinFilter(e.target.value);
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value as AssetCategory);
  };

  const handleChainFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChainFilter(e.target.value as ChainType);
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleMinApyFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinApyFilter(e.target.value);
  };

  const handleMaxLockupFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxLockupFilter(e.target.value);
  };

  const handleLoadMore = () => {
    setVisibleRows(prev => prev + 10);
  };

  // Effect to handle fade-in animation for table rows
  useEffect(() => {
    const newFadeIn = new Array(tableData.length).fill(false);
    
    const animateRows = () => {
      for (let i = 0; i < Math.min(visibleRows, tableData.length); i++) {
        setTimeout(() => {
          setFadeIn(prev => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, i * 100); // Staggered animation with 100ms delay between rows
      }
    };
    
    animateRows();
    
    return () => {
      // Reset animation state when component unmounts
      setFadeIn([]);
    };
  }, [tableData, visibleRows]);

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="bg-white dark:bg-dark-card rounded-large shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 gradient-text">Filtreler</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform
              </label>
              <select
                id="platform"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary"
                value={platformFilter}
                onChange={handlePlatformFilterChange}
              >
                <option value="">Tüm Platformlar</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="coin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kripto Para
              </label>
              <select
                id="coin"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary"
                value={coinFilter}
                onChange={handleCoinFilterChange}
              >
                <option value="">Tüm Kripto Paralar</option>
                {coins.map(coin => (
                  <option key={coin} value={coin}>{coin}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <select
                id="category"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary"
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
              >
                {assetCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="chain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blockchain
              </label>
              <select
                id="chain"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary"
                value={chainFilter}
                onChange={handleChainFilterChange}
              >
                {chainTypes.map(chain => (
                  <option key={chain} value={chain}>{chain}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="minApy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min. APY (%)
              </label>
              <input
                type="number"
                id="minApy"
                placeholder="ör. 5"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary"
                value={minApyFilter}
                onChange={handleMinApyFilterChange}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="maxLockup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maks. Kilitleme (gün)
              </label>
              <input
                type="number"
                id="maxLockup"
                placeholder="ör. 30"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary"
                value={maxLockupFilter}
                onChange={handleMaxLockupFilterChange}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sıralama
              </label>
              <select
                id="sort"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary"
                value={sortBy}
                onChange={handleSortByChange}
              >
                <option value="apy_high">APY (Yüksekten Düşüğe)</option>
                <option value="apy_low">APY (Düşükten Yükseğe)</option>
                <option value="min_high">Minimum Tutar (Yüksekten Düşüğe)</option>
                <option value="min_low">Minimum Tutar (Düşükten Yükseğe)</option>
                <option value="period_high">Kilitleme Süresi (Uzundan Kısaya)</option>
                <option value="period_low">Kilitleme Süresi (Kısadan Uzuna)</option>
                <option value="rating_high">Değerlendirme (Yüksekten Düşüğe)</option>
                <option value="24h_change">24s Değişim (Yüksekten Düşüğe)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white dark:bg-dark-card rounded-large shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kripto Para
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  APY
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  7 Günlük Trend
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kilitleme Süresi
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Min. Miktar
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Komisyon
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Değerlendirme
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Özellikler
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {tableData.length > 0 ? (
                tableData.slice(0, visibleRows).map((row, index) => (
                  <tr 
                    key={index} 
                    className={`
                      ${index % 2 === 0 ? 'bg-white dark:bg-dark-card' : 'bg-gray-50 dark:bg-gray-800/30'} 
                      transform transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800
                      ${fadeIn[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    `}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {row.platformLogoUrl && (
                          <div className="h-8 w-8 flex-shrink-0 mr-3">
                            <Image
                              width={32}
                              height={32}
                              src={row.platformLogoUrl}
                              alt={row.platform}
                              className="h-8 w-8 rounded-full"
                            />
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {row.platform}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {row.coin}
                        </div>
                        <div className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                          {row.symbol}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                      %{row.apy}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <ApySparkline data={row.apyTrend} dayChange={row.dayChange} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {parseInt(row.lockupPeriod) === 0 ? (
                        <span className="text-green-500">Esnek</span>
                      ) : (
                        `${row.lockupPeriod} gün`
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {row.minStaking}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {row.fees}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StarRating rating={row.rating} showValue={true} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-wrap gap-1">
                        {row.features.map((feature, i) => (
                          <span key={i} className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        href={`/platform/${row.platform.toLowerCase()}`} 
                        className="btn-accent inline-flex items-center justify-center px-4 py-2 text-xs animate-pulse-slow hover:shadow-md transition-all"
                      >
                        Stake Et
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Bu kriterlere uygun sonuç bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {tableData.length > visibleRows && (
        <div className="text-center mt-6">
          <button 
            onClick={handleLoadMore}
            className="btn-primary px-6 py-3"
          >
            Daha Fazla Göster
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Toplam {tableData.length} sonuç bulundu.</p>
      </div>
    </div>
  );
};

export default ComparisonTable; 