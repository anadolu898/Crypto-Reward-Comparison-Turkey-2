'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type AnimationWrapperProps = {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoom' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
  damping?: number;
  stiffness?: number;
};

export const presetAnimations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  slideLeft: {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  slideRight: {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  zoom: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  }
};

export default function AnimationWrapper({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  className = '',
  threshold = 0.1,
  once = true,
  damping = 10,
  stiffness = 100
}: AnimationWrapperProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: once
  });

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

  if (prefersReducedMotion || animation === 'none') {
    return <div className={className}>{children}</div>;
  }

  const selectedAnimation = presetAnimations[animation];
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        delay,
        duration,
        type: 'spring',
        damping,
        stiffness
      }}
      variants={selectedAnimation}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Export a component that wraps its children in multiple animation wrappers
export function StaggeredAnimationWrapper({
  children,
  animation = 'fadeIn',
  staggerDelay = 0.1,
  parentDelay = 0,
  className = '',
  childClassName = '',
  threshold = 0.1
}: {
  children: React.ReactNode[];
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoom' | 'none';
  staggerDelay?: number;
  parentDelay?: number;
  className?: string;
  childClassName?: string;
  threshold?: number;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimationWrapper
          animation={animation}
          delay={parentDelay + index * staggerDelay}
          className={childClassName}
          threshold={threshold}
        >
          {child}
        </AnimationWrapper>
      ))}
    </div>
  );
} 