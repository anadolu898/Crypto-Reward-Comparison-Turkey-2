import axios from 'axios';

// Types for the API responses
export interface StakingOffer {
  coin: string;
  apy: string;
  lockupPeriod: string;
  minStaking: string;
  features: string[];
  lastUpdated: string;
}

export interface Campaign {
  name: string;
  description: string;
  expiryDate: string;
  requirements: string[];
  reward: string;
  lastUpdated: string;
}

export interface PlatformData {
  platform: string;
  website: string;
  stakingOffers: StakingOffer[];
  campaigns: Campaign[];
  lastUpdated: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  count?: number;
}

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
    // Sample mock data
    const mockData: PlatformData[] = [
      {
        platform: 'BtcTurk',
        website: 'https://www.btcturk.com',
        stakingOffers: [
          {
            coin: 'USDT',
            apy: '8.0',
            lockupPeriod: '30',
            minStaking: '100',
            features: ['Anlık Bozma', 'Günlük Ödeme'],
            lastUpdated: new Date().toISOString(),
          },
          {
            coin: 'BTC',
            apy: '4.5',
            lockupPeriod: '60',
            minStaking: '0.01',
            features: ['Otomatik Yenileme'],
            lastUpdated: new Date().toISOString(),
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
        stakingOffers: [
          {
            coin: 'ETH',
            apy: '7.5',
            lockupPeriod: '60',
            minStaking: '0.1',
            features: ['Otomatik Yenileme'],
            lastUpdated: new Date().toISOString(),
          },
          {
            coin: 'DOT',
            apy: '12.0',
            lockupPeriod: '30',
            minStaking: '5',
            features: ['Esnek Süre', 'Haftalık Ödeme'],
            lastUpdated: new Date().toISOString(),
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
    ];

    return mockData;
  },
};

export default apiService; 