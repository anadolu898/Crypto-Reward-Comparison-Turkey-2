'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'tilt' | 'glow' | 'none';
  backgroundOpacity?: number;
  borderWidth?: number;
  borderGradient?: boolean;
  expandable?: boolean;
  expandedContent?: React.ReactNode;
}

export default function GlassCard({
  children,
  className = '',
  hoverEffect = 'lift',
  backgroundOpacity = 0.2,
  borderWidth = 1,
  borderGradient = false,
  expandable = false,
  expandedContent
}: GlassCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getHoverVariants = () => {
    switch (hoverEffect) {
      case 'lift':
        return {
          rest: { y: 0, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
          hover: { y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }
        };
      case 'tilt':
        return {
          rest: { rotateX: 0, rotateY: 0 },
          hover: { rotateX: 10, rotateY: 10 }
        };
      case 'glow':
        return {
          rest: { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
          hover: { boxShadow: '0 0 25px 5px rgba(12, 212, 181, 0.3)' }
        };
      default:
        return { rest: {}, hover: {} };
    }
  };

  const variants = getHoverVariants();

  const baseStyle = `
    backdrop-filter backdrop-blur-lg 
    bg-white/75 dark:bg-dark-card/${backgroundOpacity}
    rounded-xl p-6 transition-all duration-300
  `;

  const borderStyle = borderGradient
    ? 'border-transparent bg-clip-padding bg-origin-border'
    : 'border-gray-200 dark:border-gray-700';

  const borderWidthClass = `border-${borderWidth}`;

  const expandedVariants = {
    collapsed: { height: 'auto' },
    expanded: { height: 'auto' }
  };

  const contentVariants = {
    collapsed: { opacity: 0, height: 0, overflow: 'hidden' },
    expanded: { opacity: 1, height: 'auto', overflow: 'visible' }
  };

  return (
    <motion.div
      className={`${baseStyle} ${borderWidthClass} ${borderStyle} ${className}`}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      variants={variants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => expandable && setIsExpanded(!isExpanded)}
      style={borderGradient ? {
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), linear-gradient(to right, #0CD4B5, #220D53)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      } : {}}
    >
      {children}

      {expandable && expandedContent && (
        <motion.div
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={contentVariants}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          {expandedContent}
        </motion.div>
      )}

      {expandable && (
        <div className="flex justify-center mt-2">
          <motion.button
            className="text-primary focus:outline-none"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
} 