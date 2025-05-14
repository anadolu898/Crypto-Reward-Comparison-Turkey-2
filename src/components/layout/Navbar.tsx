'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          ? 'bg-white/90 backdrop-blur-sm shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`text-xl font-bold ${scrolled ? 'text-primary' : 'text-white'}`}>
              KriptoFaiz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/comparison" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              Karşılaştırma
            </Link>
            <Link 
              href="/platforms" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              Platformlar
            </Link>
            <Link 
              href="/news" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              Haberler
            </Link>
            <Link 
              href="/about" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              Hakkımızda
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white/90'
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
              className={`${scrolled ? 'text-gray-700' : 'text-white'}`}
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
          <div className="md:hidden py-4 mt-4 bg-white rounded-large shadow-lg absolute left-4 right-4">
            <div className="px-4 py-2">
              <Link 
                href="/comparison" 
                className="block py-2 text-gray-700 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Karşılaştırma
              </Link>
              <Link 
                href="/platforms" 
                className="block py-2 text-gray-700 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Platformlar
              </Link>
              <Link 
                href="/news" 
                className="block py-2 text-gray-700 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Haberler
              </Link>
              <Link 
                href="/about" 
                className="block py-2 text-gray-700 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
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