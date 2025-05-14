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
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const normalizedName = exchange.toLowerCase().replace(' ', '-');
  
  // Path options for finding the logo
  const pathOptions = [
    `/images/exchanges/${normalizedName}-logo.svg`,  // Primary path in images/exchanges
    `/logos/${normalizedName}-logo.svg`,             // Secondary path in /logos
    `/images/exchanges/${normalizedName}-logo.png`,  // PNG fallback in images/exchanges
    `/logos/${normalizedName}-logo.png`,             // PNG fallback in /logos
    `/${normalizedName}-logo.png`,                   // Root directory fallback
  ];
  
  // Handle error and try the next path option
  const handleError = () => {
    if (!currentPath) {
      // First error, try the first path
      setCurrentPath(pathOptions[0]);
      return;
    }
    
    // Find the current index and try the next option
    const currentIndex = pathOptions.indexOf(currentPath);
    if (currentIndex < pathOptions.length - 1) {
      setCurrentPath(pathOptions[currentIndex + 1]);
    } else {
      // We've tried all options, show the fallback
      setError(true);
    }
  };
  
  // Get the exchange initial and color for fallback
  const initial = exchange.charAt(0);
  const color = EXCHANGE_COLORS[exchange] || '#6c757d'; // Default gray if not defined
  
  // If error loading all logo options, show a styled fallback
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
  
  // The path to try
  const logoPath = currentPath || pathOptions[0];
  
  // Show the image with the current path attempt
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