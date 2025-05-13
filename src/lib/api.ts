import axios from 'axios';
import { StakingOffer, PlatformData, APIResponse, AssetCategory, ChainType, Campaign } from './types';

// API base URL - for local development we'll use relative URLs
// so Next.js can proxy the requests with rewrites
const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generate realistic APY trend data
const generateApyTrend = (baseApy: number): number[] => {
  const trend: number[] = [];
  for (let i = 0; i < 7; i++) {
    // Add small fluctuations within +/- 10% of the base APY
    const fluctuation = baseApy * 0.1 * (Math.random() * 2 - 1);
    trend.push(+(baseApy + fluctuation).toFixed(2));
  }
  return trend;
};

// Calculate 24h change based on the last two trend points
const calculateDayChange = (trend: number[]): string => {
  if (trend.length < 2) return '0.0';
  const lastDay = trend[trend.length - 1];
  const previousDay = trend[trend.length - 2];
  const change = ((lastDay - previousDay) / previousDay) * 100;
  return change.toFixed(1);
};

// API service functions
export const apiService = {
  // Get all rewards from all platforms
  getAllRewards: async (): Promise<APIResponse<PlatformData[]>> => {
    try {
      const response = await api.get<APIResponse<PlatformData[]>>('/rewards');
      return response.data;
    } catch (error) {
      console.error('Error fetching all rewards:', error);
      return {
        success: false,
        data: [],
        error: 'Failed to fetch rewards data. Please try again later.',
      };
    }
  },

  // Get rewards for a specific platform
  getPlatformRewards: async (platform: string): Promise<APIResponse<PlatformData>> => {
    try {
      const response = await api.get<APIResponse<PlatformData>>(`/rewards/${platform}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rewards for platform ${platform}:`, error);
      return {
        success: false,
        data: {} as PlatformData,
        error: `Failed to fetch rewards data for ${platform}. Please try again later.`,
      };
    }
  },

  // Mock function to get data when the backend is not available
  getMockData: async (): Promise<PlatformData[]> => {
    // Sample mock data with expanded information
    const mockData: PlatformData[] = [
      {
        platform: 'BtcTurk',
        website: 'https://www.btcturk.com',
        logoUrl: '/btcturk-logo.png',
        stakingOffers: [
          {
            coin: 'Tether',
            symbol: 'USDT',
            apy: '8.0',
            lockupPeriod: '30',
            minStaking: '100 USDT',
            features: ['Anlık Bozma', 'Günlük Ödeme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(8.0),
            dayChange: '0.2',
            rating: 4.5,
            fees: '0%',
          },
          {
            coin: 'Bitcoin',
            symbol: 'BTC',
            apy: '4.5',
            lockupPeriod: '60',
            minStaking: '0.01 BTC',
            features: ['Otomatik Yenileme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(4.5),
            dayChange: '-0.1',
            rating: 4.8,
            fees: '0.2%',
          },
          {
            coin: 'Ethereum',
            symbol: 'ETH',
            apy: '5.2',
            lockupPeriod: '30',
            minStaking: '0.1 ETH',
            features: ['Esnek Süre'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(5.2),
            dayChange: '0.5',
            rating: 4.6,
            fees: '0.1%',
          },
        ],
        campaigns: [
          {
            name: 'Yeni Üye Bonusu',
            description: 'Kayıt olun ve KYC tamamlayarak 10 USDT kazanın',
            expiryDate: '2023-12-31',
            requirements: ['Yeni Hesap', 'KYC Doğrulama'],
            reward: '10 USDT',
            lastUpdated: new Date().toISOString(),
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'Paribu',
        website: 'https://www.paribu.com',
        logoUrl: '/paribu-logo.png',
        stakingOffers: [
          {
            coin: 'Ethereum',
            symbol: 'ETH',
            apy: '7.5',
            lockupPeriod: '60',
            minStaking: '0.1 ETH',
            features: ['Otomatik Yenileme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(7.5),
            dayChange: '0.3',
            rating: 4.2,
            fees: '0.5%',
          },
          {
            coin: 'Polkadot',
            symbol: 'DOT',
            apy: '12.0',
            lockupPeriod: '30',
            minStaking: '5 DOT',
            features: ['Esnek Süre', 'Haftalık Ödeme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(12.0),
            dayChange: '1.2',
            rating: 4.0,
            fees: '1%',
          },
          {
            coin: 'Cardano',
            symbol: 'ADA',
            apy: '8.2',
            lockupPeriod: '90',
            minStaking: '100 ADA',
            features: ['Günlük Ödeme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(8.2),
            dayChange: '-0.4',
            rating: 4.3,
            fees: '0.8%',
          },
        ],
        campaigns: [
          {
            name: 'Referans Programı',
            description: 'Arkadaşınızın işlem ücretlerinin %30\'unu 6 ay boyunca kazanın',
            expiryDate: 'Ongoing',
            requirements: ['Doğrulanmış Hesap'],
            reward: 'İşlem ücretlerinin %30\'u',
            lastUpdated: new Date().toISOString(),
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'Binance TR',
        website: 'https://www.binance.com/tr',
        logoUrl: '/binance-logo.png',
        stakingOffers: [
          {
            coin: 'BNB',
            symbol: 'BNB',
            apy: '9.2',
            lockupPeriod: '90',
            minStaking: '0.1 BNB',
            features: ['Günlük Ödeme', 'Otomatik Yenileme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(9.2),
            dayChange: '0.7',
            rating: 4.7,
            fees: '0%',
          },
          {
            coin: 'Solana',
            symbol: 'SOL',
            apy: '6.3',
            lockupPeriod: '60',
            minStaking: '1 SOL',
            features: ['Haftalık Ödeme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(6.3),
            dayChange: '-0.3',
            rating: 4.4,
            fees: '0.2%',
          },
          {
            coin: 'Avalanche',
            symbol: 'AVAX',
            apy: '7.8',
            lockupPeriod: '30',
            minStaking: '1 AVAX',
            features: ['Anlık Bozma'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(7.8),
            dayChange: '0.4',
            rating: 4.5,
            fees: '0.3%',
          },
        ],
        campaigns: [
          {
            name: 'Locked Staking Bonus',
            description: '90 günlük kilitleme ile %10 bonus kazanın',
            expiryDate: '2023-12-31',
            requirements: ['Min. 1 BNB'],
            reward: '%10 Extra APY',
            lastUpdated: new Date().toISOString(),
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'KuCoin',
        website: 'https://www.kucoin.com',
        logoUrl: '/kucoin-logo.png',
        stakingOffers: [
          {
            coin: 'Polkadot',
            symbol: 'DOT',
            apy: '15.0',
            lockupPeriod: '120',
            minStaking: '10 DOT',
            features: ['Haftalık Ödeme', 'Yüksek Getiri'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(15.0),
            dayChange: '1.5',
            rating: 4.1,
            fees: '1.2%',
          },
          {
            coin: 'Cosmos',
            symbol: 'ATOM',
            apy: '14.2',
            lockupPeriod: '90',
            minStaking: '5 ATOM',
            features: ['Aylık Ödeme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(14.2),
            dayChange: '0.8',
            rating: 4.2,
            fees: '0.5%',
          },
        ],
        campaigns: [],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'Trust Wallet',
        website: 'https://trustwallet.com',
        logoUrl: '/trust-logo.png',
        stakingOffers: [
          {
            coin: 'Tron',
            symbol: 'TRX',
            apy: '10.5',
            lockupPeriod: '0',
            minStaking: '100 TRX',
            features: ['Esnek Süre', 'Non-custodial'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(10.5),
            dayChange: '0.3',
            rating: 4.9,
            fees: '1%',
          },
          {
            coin: 'Tezos',
            symbol: 'XTZ',
            apy: '5.5',
            lockupPeriod: '0',
            minStaking: '1 XTZ',
            features: ['Esnek Süre', 'Non-custodial'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(5.5),
            dayChange: '-0.2',
            rating: 4.6,
            fees: '0.5%',
          },
        ],
        campaigns: [],
        lastUpdated: new Date().toISOString(),
      },
    ];

    return mockData;
  },
};

export default apiService;
export type { AssetCategory, ChainType, StakingOffer, PlatformData }; 