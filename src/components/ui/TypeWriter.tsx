'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface TypeWriterProps {
  text: string | string[];
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorStyle?: string;
  cursorColor?: string;
  loop?: boolean;
  onComplete?: () => void;
  startOnVisible?: boolean;
}

export default function TypeWriter({
  text,
  className = '',
  speed = 70,
  delay = 1500,
  cursor = true,
  cursorStyle = '|',
  cursorColor = 'text-primary',
  loop = false,
  onComplete,
  startOnVisible = true
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const textArray = Array.isArray(text) ? text : [text];
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: !loop
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
    if (!inView && startOnVisible) return;
    
    if (prefersReducedMotion) {
      setDisplayText(textArray[currentTextIndex]);
      if (onComplete) onComplete();
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const currentText = textArray[currentTextIndex];

    if (isTyping) {
      if (currentIndex < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(prevText => prevText + currentText[currentIndex]);
          setCurrentIndex(prevIndex => prevIndex + 1);
        }, speed);
      } else {
        setIsTyping(false);
        timeoutRef.current = setTimeout(() => {
          if (loop) {
            setIsTyping(false);
          }
        }, delay);
      }
    } else {
      if (currentIndex > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(prevText => prevText.slice(0, -1));
          setCurrentIndex(prevIndex => prevIndex - 1);
        }, speed / 2);
      } else {
        setIsTyping(true);
        const nextTextIndex = (currentTextIndex + 1) % textArray.length;
        setCurrentTextIndex(nextTextIndex);
        
        if (nextTextIndex === 0 && !loop) {
          if (onComplete) onComplete();
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    currentIndex, 
    isTyping, 
    currentTextIndex, 
    textArray, 
    speed, 
    delay, 
    loop, 
    onComplete, 
    inView, 
    startOnVisible, 
    prefersReducedMotion
  ]);

  return (
    <span ref={ref} className={className}>
      {prefersReducedMotion ? textArray[0] : displayText}
      {cursor && !prefersReducedMotion && (
        <span className={`animate-blink ${cursorColor}`}>{cursorStyle}</span>
      )}
    </span>
  );
} 