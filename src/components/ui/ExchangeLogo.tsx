'use client';

import { useState } from 'react';
import Image from 'next/image';

export type ExchangeName = 
  | 'Binance' 
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
  'BtcTurk': '#0C36B5',   // BtcTurk Blue
  'Paribu': '#6A1BA5',    // Paribu Purple
  'Bitexen': '#19A5DA',   // Bitexen Light Blue
  'Bitci': '#FF6B00',     // Bitci Orange
  'CoinTR': '#EC1C24',    // Red
  'ICRYPEX': '#0066CC',   // Blue
  'Bitay': '#28A745',     // Green
};

const ExchangeLogo: React.FC<ExchangeLogoProps> = ({ 
  exchange, 
  width = 150, 
  height = 50,
  className = ''
}) => {
  const [error, setError] = useState(false);
  const normalizedName = exchange.toLowerCase().replace(' ', '-');
  
  // Direct path to SVG logo in logos directory
  const logoPath = `/logos/${normalizedName}-logo.svg`;
  
  // Fallback display for exchanges without logos
  const handleError = () => {
    setError(true);
  };

  // Get the exchange initial and color for fallback
  const initial = exchange.charAt(0);
  const color = EXCHANGE_COLORS[exchange] || '#6c757d'; // Default gray if not defined
  
  // If error loading the logo or no logo exists, show a styled fallback
  if (error) {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-full overflow-hidden bg-gray-100 ${className}`}
        style={{ 
          width, 
          height,
          backgroundColor: `${color}20`, // 20% opacity of the color
        }}
      >
        <span style={{ color: color }} className="text-xl font-bold">
          {initial}
        </span>
      </div>
    );
  }
  
  // Otherwise show the image
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={logoPath}
        alt={`${exchange} Logo`}
        fill
        style={{ objectFit: 'contain' }}
        onError={handleError}
        priority
      />
    </div>
  );
};

export default ExchangeLogo; 