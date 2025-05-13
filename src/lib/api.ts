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
        logoUrl: '/logos/btcturk-logo.svg',
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
        logoUrl: '/logos/paribu-logo.svg',
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
            coin: 'Avax',
            symbol: 'AVAX',
            apy: '9.0',
            lockupPeriod: '30',
            minStaking: '1 AVAX',
            features: ['Günlük Ödeme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(9.0),
            dayChange: '0.5',
            rating: 4.4,
            fees: '0.3%',
          },
        ],
        campaigns: [
          {
            name: 'Referans Programı',
            description: 'Arkadaşınızı davet edin, işlem hacmine göre bonus kazanın',
            expiryDate: 'Süresiz',
            requirements: ['Referans Kodu Paylaşımı', 'Min. 100 TL İşlem'],
            reward: 'İşlem hacminin %10\'u',
            lastUpdated: new Date().toISOString(),
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'Bitexen',
        website: 'https://www.bitexen.com',
        logoUrl: '/logos/bitexen-logo.svg',
        stakingOffers: [
          {
            coin: 'Tether',
            symbol: 'USDT',
            apy: '8.2',
            lockupPeriod: '45',
            minStaking: '50 USDT',
            features: ['Erken Bozma Seçeneği'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(8.2),
            dayChange: '0.4',
            rating: 4.3,
            fees: '0.1%',
          },
          {
            coin: 'Cardano',
            symbol: 'ADA',
            apy: '6.5',
            lockupPeriod: '30',
            minStaking: '100 ADA',
            features: ['Flexible'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(6.5),
            dayChange: '-0.2',
            rating: 4.1,
            fees: '0.2%',
          }
        ],
        campaigns: [
          {
            name: 'Trading Yarışması',
            description: 'En yüksek hacimli 10 trader özel ödüller kazanır',
            expiryDate: '2023-10-30',
            requirements: ['Min. 1000 TL Hacim', 'KYC Onaylı Hesap'],
            reward: 'Toplam 50,000 TL Ödül Havuzu',
            lastUpdated: new Date().toISOString(),
          }
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'Bitci',
        website: 'https://www.bitci.com',
        logoUrl: '/logos/bitci-logo.svg',
        stakingOffers: [
          {
            coin: 'Bitcoin',
            symbol: 'BTC',
            apy: '4.8',
            lockupPeriod: '90',
            minStaking: '0.005 BTC',
            features: ['Kademeli Getiri'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(4.8),
            dayChange: '0.1',
            rating: 4.4,
            fees: '0.15%',
          },
          {
            coin: 'BITCI',
            symbol: 'BITCI',
            apy: '12.0',
            lockupPeriod: '60',
            minStaking: '1000 BITCI',
            features: ['Platform Tokeni'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(12.0),
            dayChange: '1.2',
            rating: 4.7,
            fees: '0%',
          }
        ],
        campaigns: [
          {
            name: 'Fan Token Yatırımcı Programı',
            description: 'Fan token alan kullanıcılara özel fırsatlar',
            expiryDate: '2023-12-15',
            requirements: ['Min. 100 TL Fan Token Yatırımı'],
            reward: 'Maç Bileti Çekilişi',
            lastUpdated: new Date().toISOString(),
          }
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'CoinTR',
        website: 'https://www.cointr.com',
        logoUrl: '/logos/cointr-logo.svg',
        stakingOffers: [
          {
            coin: 'Ethereum',
            symbol: 'ETH',
            apy: '5.5',
            lockupPeriod: '60',
            minStaking: '0.2 ETH',
            features: ['Haftalık Ödeme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(5.5),
            dayChange: '0.2',
            rating: 4.0,
            fees: '0.3%',
          },
          {
            coin: 'Polkadot',
            symbol: 'DOT',
            apy: '10.5',
            lockupPeriod: '30',
            minStaking: '20 DOT',
            features: ['Esnek'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(10.5),
            dayChange: '0.8',
            rating: 4.2,
            fees: '0.2%',
          }
        ],
        campaigns: [],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'ICRYPEX',
        website: 'https://www.icrypex.com',
        logoUrl: '/logos/icrypex-logo.svg',
        stakingOffers: [
          {
            coin: 'Tether',
            symbol: 'USDT',
            apy: '7.8',
            lockupPeriod: '45',
            minStaking: '100 USDT',
            features: ['Günlük Faiz'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(7.8),
            dayChange: '-0.3',
            rating: 4.1,
            fees: '0.4%',
          },
          {
            coin: 'Solana',
            symbol: 'SOL',
            apy: '8.2',
            lockupPeriod: '60',
            minStaking: '2 SOL',
            features: ['Otomatik Yenileme'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(8.2),
            dayChange: '0.6',
            rating: 4.3,
            fees: '0.2%',
          }
        ],
        campaigns: [
          {
            name: 'Kriptopara Yatırım Eğitimi',
            description: 'Ücretsiz eğitim serisi',
            expiryDate: '2023-11-30',
            requirements: ['Hesap Onayı'],
            reward: 'Sertifika + 5 USDT',
            lastUpdated: new Date().toISOString(),
          }
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        platform: 'Bitay',
        website: 'https://www.bitay.com',
        logoUrl: '/logos/bitay-logo.svg',
        stakingOffers: [
          {
            coin: 'Bitcoin',
            symbol: 'BTC',
            apy: '4.2',
            lockupPeriod: '30',
            minStaking: '0.01 BTC',
            features: ['Esnek'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(4.2),
            dayChange: '-0.1',
            rating: 3.9,
            fees: '0.5%',
          },
          {
            coin: 'Binance Coin',
            symbol: 'BNB',
            apy: '6.8',
            lockupPeriod: '60',
            minStaking: '0.5 BNB',
            features: ['Kademeli Getiri'],
            lastUpdated: new Date().toISOString(),
            apyTrend: generateApyTrend(6.8),
            dayChange: '0.4',
            rating: 4.0,
            fees: '0.3%',
          }
        ],
        campaigns: [
          {
            name: 'Yeni Kullanıcı Kampanyası',
            description: 'İlk yatırımınıza özel bonus',
            expiryDate: '2023-11-15',
            requirements: ['Yeni Hesap', 'Min. 100 TL Yatırım'],
            reward: '%3 Bonus',
            lastUpdated: new Date().toISOString(),
          }
        ],
        lastUpdated: new Date().toISOString(),
      }
    ];

    return mockData;
  },
};

export default apiService; 