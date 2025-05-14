'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth/AuthContext';
import Logo from './ui/Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('#user-menu-button') && !target.closest('#user-dropdown')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      // Close dropdown
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
          <Logo 
            variant={scrolled ? 'dark' : 'light'} 
            textClassName={scrolled ? 'text-primary' : 'text-white'}
          />

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
              href="/faq" 
              className={`font-medium hover:text-primary transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              SSS
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
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  className={`flex items-center space-x-2 ${
                    scrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                  id="user-menu-button"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="font-medium">{user?.name || 'Hesabım'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div 
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  >
                    <Link 
                      href="/account/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/account/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profil Ayarları
                    </Link>
                    {user?.is_premium ? (
                      <Link 
                        href="/subscription" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Premium Üyelik
                      </Link>
                    ) : null}
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className={`font-medium hover:text-primary transition-colors ${
                  scrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                Giriş Yap
              </Link>
            )}
            
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
                href="/faq" 
                className="block py-2 text-gray-700 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                SSS
              </Link>
              <Link 
                href="/about" 
                className="block py-2 text-gray-700 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              
              {isAuthenticated ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link 
                    href="/account/dashboard" 
                    className="block py-2 text-gray-700 hover:text-primary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/account/profile" 
                    className="block py-2 text-gray-700 hover:text-primary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil Ayarları
                  </Link>
                  <button 
                    className="block w-full text-left py-2 text-red-600 font-medium"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 