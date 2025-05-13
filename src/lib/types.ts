// Type definitions for the application

// Asset Categories
export type AssetCategory = 'Proof-of-Stake' | 'DeFi LP' | 'Liquid Staking' | 'All';

// Chain Types
export type ChainType = 'Ethereum' | 'BNB Smart Chain' | 'Solana' | 'Avalanche' | 'All';

// Staking Offer Interface
export interface StakingOffer {
  coin: string;
  symbol: string;
  apy: string;
  lockupPeriod: string;
  minStaking: string;
  features: string[];
  lastUpdated: string;
  apyTrend: number[]; // 7-day APY trend data for sparklines
  dayChange: string; // 24-hour APY change (percentage)
  rating: number; // Platform rating (1-5)
  fees: string; // Fee percentage
  logoUrl?: string; // URL to coin logo
}

// Campaign Interface
export interface Campaign {
  name: string;
  description: string;
  expiryDate: string;
  requirements: string[];
  reward: string;
  lastUpdated: string;
}

// Platform Data Interface
export interface PlatformData {
  platform: string;
  website: string;
  stakingOffers: StakingOffer[];
  campaigns: Campaign[];
  lastUpdated: string;
  logoUrl?: string; // URL to platform logo
}

// API Response Interface
export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  count?: number;
} 