'use client';

import React from 'react';

export type ExchangeName = 
  | 'Binance' 
  | 'Binance TR'
  | 'BtcTurk' 
  | 'Paribu' 
  | 'Bitexen' 
  | 'Bitci' 
  | 'CoinTR' 
  | 'ICRYPEX' 
  | 'Bitay'
  | string;

interface ExchangeLogoProps {
  exchange: ExchangeName;
  width?: number;
  height?: number;
  className?: string;
}

export const EXCHANGE_COLORS: Record<ExchangeName, string> = {
  'Binance': '#F3BA2F',   // Binance Yellow
  'Binance TR': '#F3BA2F', // Binance Yellow
  'BtcTurk': '#0C36B5',   // BtcTurk Blue
  'Paribu': '#9FC612',    // Paribu Green
  'Bitexen': '#19A5DA',   // Bitexen Light Blue
  'Bitci': '#FF6B00',     // Bitci Orange
  'CoinTR': '#00C853',    // Green
  'ICRYPEX': '#0066CC',   // Blue
  'Bitay': '#28A745',     // Green
};

// Map exchange display names to their logo filenames
const EXCHANGE_LOGO_MAP: Record<string, string> = {
  'Binance TR': 'binance-tr',
  'Binance': 'binance',
  'BtcTurk': 'btcturk',
  'Paribu': 'paribu',
  'Bitexen': 'bitexen',
  'Bitci': 'bitci',
  'CoinTR': 'cointr',
  'ICRYPEX': 'icrypex', 
  'Bitay': 'bitay'
};

const ExchangeLogo: React.FC<ExchangeLogoProps> = ({ 
  exchange, 
  width = 150, 
  height = 50,
  className = ''
}) => {
  // Get the exchange initial and color for fallback
  const initial = exchange.charAt(0).toUpperCase();
  const color = EXCHANGE_COLORS[exchange] || '#6c757d'; // Default gray if not defined
  
  // Generate the normalized filename
  const normalizedExchange = EXCHANGE_LOGO_MAP[exchange] || 
    exchange.toLowerCase().replace(/\s+/g, '-');
  
  // Direct path to SVG
  const logoPath = `/logos/${normalizedExchange}-logo.svg`;
  
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`} 
      style={{ width, height }}
    >
      {/* Regular img tag instead of Next.js Image for better compatibility */}
      <img
        src={logoPath}
        alt={`${exchange} Logo`}
        width={width}
        height={height}
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%', 
          objectFit: 'contain',
          display: 'block',
        }}
        onError={(e) => {
          // On error, replace with fallback
          e.currentTarget.style.display = 'none';
          const fallbackEl = e.currentTarget.nextElementSibling;
          if (fallbackEl) {
            fallbackEl.classList.remove('hidden');
          }
        }}
      />
      
      {/* Fallback content (initially hidden) */}
      <div 
        className="hidden rounded-full overflow-hidden flex items-center justify-center"
        style={{ 
          width: '80%', 
          height: '80%',
          backgroundColor: `${color}20`, // 20% opacity of the color
          color: color,
          fontSize: Math.min(width, height) * 0.4 + 'px',
          fontWeight: 'bold'
        }}
      >
        {initial}
      </div>
    </div>
  );
};

export default ExchangeLogo; 