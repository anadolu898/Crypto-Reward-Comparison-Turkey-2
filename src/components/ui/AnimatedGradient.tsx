'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedGradientProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
  opacity?: number;
  fromDirection?: 'top' | 'right' | 'bottom' | 'left';
  toDirection?: 'top' | 'right' | 'bottom' | 'left';
}

export default function AnimatedGradient({
  children,
  className = '',
  colors = ['#0CD4B5', '#220D53', '#0CD4B5'],
  duration = 15,
  opacity = 1,
  fromDirection = 'left',
  toDirection = 'right'
}: AnimatedGradientProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const getDirection = () => {
    const directions: Record<string, string> = {
      'top-bottom': 'to bottom',
      'right-left': 'to left',
      'bottom-top': 'to top',
      'left-right': 'to right',
      'top-right': '45deg',
      'right-bottom': '135deg',
      'bottom-left': '225deg',
      'left-top': '315deg'
    };

    return directions[`${fromDirection}-${toDirection}`] || 'to right';
  };

  const colorString = colors.join(', ');
  const direction = getDirection();
  
  const gradientStyle = prefersReducedMotion 
    ? {
        background: `linear-gradient(${direction}, ${colorString})`,
        opacity
      } 
    : {
        backgroundImage: `linear-gradient(${direction}, ${colorString})`,
        backgroundSize: '200% 200%',
        animation: `gradientMovement ${duration}s ease infinite`,
        opacity
      };

  return (
    <div 
      className={className}
      style={gradientStyle}
    >
      {children}
    </div>
  );
} 