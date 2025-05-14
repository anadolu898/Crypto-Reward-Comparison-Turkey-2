'use client';

import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface CounterAnimationProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  delay?: number;
}

export default function CounterAnimation({
  end,
  duration = 2.5,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  delay = 0
}: CounterAnimationProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
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

  useEffect(() => {
    if (inView && !hasPlayed) {
      setHasPlayed(true);
    }
  }, [inView, hasPlayed]);

  return (
    <div ref={ref} className={className}>
      {prefersReducedMotion ? (
        <span>{prefix}{end.toFixed(decimals)}{suffix}</span>
      ) : (
        <CountUp
          start={0}
          end={end}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          delay={delay}
          useEasing={true}
          enableScrollSpy={false}
          preserveValue={true}
          startOnMount={hasPlayed}
        />
      )}
    </div>
  );
} 