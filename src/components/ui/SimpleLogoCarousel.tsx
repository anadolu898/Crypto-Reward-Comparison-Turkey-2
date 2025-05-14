'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SimpleLogoProps {
  logos: string[];  // Array of direct paths to logo image files
  width?: number;
  height?: number;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

const SimpleLogoCarousel: React.FC<SimpleLogoProps> = ({
  logos,
  width = 120,
  height = 40,
  speed = 25,
  pauseOnHover = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Duplicate logos for seamless looping
  const duplicatedLogos = [...logos, ...logos];

  // Animation variants
  const carouselVariants = {
    animate: {
      x: ['0%', '-50%'],
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
      x: '0%',
      transition: { duration: 0.5 }
    }
  };

  return (
    <div 
      className={`overflow-hidden w-full ${className}`}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      <motion.div
        className="flex items-center"
        variants={carouselVariants}
        animate={isHovered ? 'paused' : 'animate'}
      >
        {duplicatedLogos.map((logo, index) => (
          <div 
            key={index} 
            className="mx-6 flex-shrink-0"
            style={{ minWidth: `${width}px` }}
          >
            <img
              src={logo}
              alt={`Platform logo ${index % logos.length + 1}`}
              width={width}
              height={height}
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              className="transition-opacity duration-300 hover:opacity-100 opacity-80"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SimpleLogoCarousel; 