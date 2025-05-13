import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StakingOffer, PlatformData } from '../lib/api';

interface ComparisonTableProps {
  data: PlatformData[];
  showFilters?: boolean;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data, showFilters = true }) => {
  // States for filtering and sorting
  const [platformFilter, setPlatformFilter] = useState<string>('');
  const [coinFilter, setCoinFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('apy_high');

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
      platform.stakingOffers.forEach(offer => coinSet.add(offer.coin));
    });
    return Array.from(coinSet);
  }, [data]);

  // Process and transform data for the table
  const tableData = useMemo(() => {
    // Flatten the data structure
    const flatData: Array<StakingOffer & { platform: string, website: string }> = [];
    
    data.forEach(platform => {
      platform.stakingOffers.forEach(offer => {
        flatData.push({
          ...offer,
          platform: platform.platform,
          website: platform.website
        });
      });
    });
    
    // Apply filters
    let filteredData = flatData;
    
    if (platformFilter) {
      filteredData = filteredData.filter(item => item.platform.toLowerCase() === platformFilter.toLowerCase());
    }
    
    if (coinFilter) {
      filteredData = filteredData.filter(item => item.coin.toLowerCase() === coinFilter.toLowerCase());
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
      default:
        break;
    }
    
    return filteredData;
  }, [data, platformFilter, coinFilter, sortBy]);

  // Handle filter and sort changes
  const handlePlatformFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatformFilter(e.target.value);
  };

  const handleCoinFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCoinFilter(e.target.value);
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div>
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtreler</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform
              </label>
              <select
                id="platform"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900"
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
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900"
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
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sıralama
              </label>
              <select
                id="sort"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 bg-white dark:bg-gray-900"
                value={sortBy}
                onChange={handleSortByChange}
              >
                <option value="apy_high">APY (Yüksekten Düşüğe)</option>
                <option value="apy_low">APY (Düşükten Yükseğe)</option>
                <option value="min_high">Minimum Tutar (Yüksekten Düşüğe)</option>
                <option value="min_low">Minimum Tutar (Düşükten Yükseğe)</option>
                <option value="period_high">Süre (Uzundan Kısaya)</option>
                <option value="period_low">Süre (Kısadan Uzuna)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kripto Para
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  APY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kilitleme Süresi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Min. Miktar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Özellikler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {row.platform}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {row.coin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                      %{row.apy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {row.lockupPeriod} gün
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {row.minStaking}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {row.features.map((feature, i) => (
                        <span key={i} className="px-2 py-1 mr-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/platform/${row.platform.toLowerCase()}`} 
                        className="text-primary hover:text-secondary"
                      >
                        Detaylar
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Bu kriterlere uygun sonuç bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Toplam {tableData.length} sonuç bulundu.</p>
      </div>
    </div>
  );
};

export default ComparisonTable; 