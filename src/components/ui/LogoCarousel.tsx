'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Logo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface LogoCarouselProps {
  logos: Logo[];
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
  direction?: 'left' | 'right';
}

export default function LogoCarousel({
  logos,
  speed = 25,
  pauseOnHover = true,
  className = '',
  itemClassName = '',
  direction = 'left'
}: LogoCarouselProps) {
  const [duplicatedLogos, setDuplicatedLogos] = useState<Logo[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Duplicate logos to create a seamless loop
    setDuplicatedLogos([...logos, ...logos]);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [logos]);

  const carouselVariants = {
    animate: {
      x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
      transition: {
        x: {
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop'
        }
      }
    },
    paused: {
      x: 'var(--x-position)',
      transition: {
        duration: 0.5
      }
    }
  };

  if (duplicatedLogos.length === 0) {
    return null;
  }

  // Handle SVG file extensions to use Image component properly
  const getLogoElement = (logo: Logo, index: number) => {
    const isSvg = logo.src.toLowerCase().endsWith('.svg');
    
    return (
      <div
        key={index}
        className={`flex items-center justify-center ${itemClassName}`}
      >
        {isSvg ? (
          <div 
            className="relative opacity-80 hover:opacity-100 transition-opacity duration-300 hover:scale-105 transform"
            style={{ width: logo.width || 140, height: logo.height || 50 }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              style={{ objectFit: 'contain' }}
              priority={index < 5}
            />
          </div>
        ) : (
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 140}
            height={logo.height || 50}
            className="opacity-80 hover:opacity-100 transition-opacity duration-300 hover:scale-105 transform"
            priority={index < 5}
          />
        )}
      </div>
    );
  };

  if (prefersReducedMotion) {
    return (
      <div className={`flex flex-wrap justify-center gap-12 ${className}`}>
        {logos.map((logo, index) => getLogoElement(logo, index))}
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      <motion.div
        className="flex"
        variants={carouselVariants}
        animate={isHovered ? 'paused' : 'animate'}
        style={{ '--x-position': '0%' } as any}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className={`flex items-center justify-center mx-12 ${itemClassName}`}
          >
            {getLogoElement(logo, index)}
          </div>
        ))}
      </motion.div>
    </div>
  );
