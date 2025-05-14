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

  if (prefersReducedMotion) {
    return (
      <div className={`flex flex-wrap justify-center gap-8 ${className}`}>
        {logos.map((logo, index) => (
          <div key={index} className={`flex items-center justify-center ${itemClassName}`}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 120}
              height={logo.height || 40}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
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
            className={`flex items-center justify-center mx-8 ${itemClassName}`}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 120}
              height={logo.height || 40}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
} 