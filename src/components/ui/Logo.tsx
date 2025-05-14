'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  className?: string;
  linkClassName?: string;
  textClassName?: string;
}

export default function Logo({
  variant = 'auto',
  showText = true,
  className = '',
  linkClassName = '',
  textClassName = ''
}: LogoProps) {
  const logoSrc = variant === 'light' 
    ? '/kriptofaiz-logo-light.svg' 
    : variant === 'dark'
      ? '/kriptofaiz-logo-dark.svg'
      : '/kriptofaiz-logo-dark.svg'; // Default to dark variant for better visibility

  return (
    <Link href="/" className={`flex items-center ${linkClassName}`}>
      <div className={`h-10 w-32 relative ${className}`}>
        <Image 
          src={logoSrc} 
          alt="KriptoFaiz Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      {showText && (
        <span className={`text-xl font-bold ml-2 ${textClassName}`}>
          KriptoFaiz
        </span>
      )}
    </Link>
  );
} 