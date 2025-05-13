import axios from 'axios';

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
  getAllRewards: async () => {
    try {
      const response = await api.get('/rewards');
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
  getPlatformRewards: async (platform: string) => {
    try {
      const response = await api.get(`/rewards/${platform}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rewards for platform ${platform}:`, error);
      return {
        success: false,
        data: {},
        error: `Failed to fetch rewards data for ${platform}. Please try again later.`,
      };
    }
  },

  // Mock function to get data when the backend is not available
  getMockData: async () => {
    // Sample mock data with expanded information
    const mockData = [
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
        ],
        campaigns: [],
        lastUpdated: new Date().toISOString(),
      },
    ];

    return mockData;
  },
};

export default apiService; 