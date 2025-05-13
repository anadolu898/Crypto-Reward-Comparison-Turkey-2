'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-dark/90 backdrop-blur-sm shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`text-xl font-bold ${scrolled ? 'text-primary dark:text-white' : 'text-white dark:text-white'}`}>
              KriptoKarşılaştır
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/comparison" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white/90 dark:text-white/90'
              }`}
            >
              Karşılaştırma
            </Link>
            <Link 
              href="/platforms" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white/90 dark:text-white/90'
              }`}
            >
              Platformlar
            </Link>
            <Link 
              href="/news" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white/90 dark:text-white/90'
              }`}
            >
              Haberler
            </Link>
            <Link 
              href="/about" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white/90 dark:text-white/90'
              }`}
            >
              Hakkımızda
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white dark:text-white'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <Link 
              href="/login" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white/90 dark:text-white/90'
              }`}
            >
              Giriş Yap
            </Link>
            <Link href="/subscription" className="btn-accent">
              Premium
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className={`${scrolled ? 'text-gray-700 dark:text-white' : 'text-white'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 mt-4 bg-white dark:bg-dark-card rounded-large shadow-lg absolute left-4 right-4">
            <div className="px-4 py-2">
              <Link 
                href="/comparison" 
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Karşılaştırma
              </Link>
              <Link 
                href="/platforms" 
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Platformlar
              </Link>
              <Link 
                href="/news" 
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Haberler
              </Link>
              <Link 
                href="/about" 
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/login" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
                <Link 
                  href="/subscription" 
                  className="btn-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Premium
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 