'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimationWrapper, { StaggeredAnimationWrapper } from '../components/ui/AnimationWrapper';
import CounterAnimation from '../components/ui/CounterAnimation';
import GlassCard from '../components/ui/GlassCard';
import ParticleBackground from '../components/ui/ParticleBackground';
import TypeWriter from '../components/ui/TypeWriter';
import LogoCarousel from '../components/ui/LogoCarousel';
import AnimatedGradient from '../components/ui/AnimatedGradient';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Sample data for the table
  const cryptoAssets = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', rewardRate: '4.5%', price: '57,490 ₺', stakingMin: '0.01 BTC', platform: 'BtcTurk' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', rewardRate: '7.5%', price: '3,270 ₺', stakingMin: '0.1 ETH', platform: 'Paribu' },
    { id: 3, name: 'BNB', symbol: 'BNB', rewardRate: '9.2%', price: '560 ₺', stakingMin: '0.1 BNB', platform: 'Binance TR' },
    { id: 4, name: 'Solana', symbol: 'SOL', rewardRate: '6.3%', price: '175 ₺', stakingMin: '1 SOL', platform: 'BtcTurk' },
    { id: 5, name: 'Cardano', symbol: 'ADA', rewardRate: '8.2%', price: '4.50 ₺', stakingMin: '100 ADA', platform: 'Paribu' },
  ];

  // Data for platform logos
  const platformLogos = [
    { src: '/btcturk-logo.png', alt: 'BtcTurk Logo', width: 140, height: 40 },
    { src: '/paribu-logo.png', alt: 'Paribu Logo', width: 140, height: 40 },
    { src: '/binance-logo.png', alt: 'Binance Logo', width: 140, height: 40 },
    { src: '/kucoin-logo.png', alt: 'Kucoin Logo', width: 140, height: 40 },
    { src: '/trust-logo.png', alt: 'Trust Wallet Logo', width: 140, height: 40 },
  ];

  // Stats for animated counters
  const stats = [
    { value: 1200000, prefix: '₺', suffix: '+', label: 'İzlenen Staking' },
    { value: 10, suffix: '+', label: 'Platform' },
    { value: 100, suffix: '+', label: 'Kripto Varlık' },
    { value: 20, suffix: '%', label: 'Daha Fazla Getiri' },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section with Animated Elements */}
      <section className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Background elements */}
        <AnimatedGradient 
          className="absolute inset-0 z-0"
          colors={['#220D53', '#21234A', '#220D53']}
          fromDirection="left"
          toDirection="right"
          duration={20}
        >
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        </AnimatedGradient>
        
        {/* Particle effect */}
        <ParticleBackground
          particleCount={prefersReducedMotion ? 0 : 70}
          interactive={true}
          className="z-10"
        />

        {/* Floating geometric shapes */}
        {!prefersReducedMotion && (
          <>
            <motion.div 
              className="absolute top-20 left-[10%] w-20 h-20 rounded-full bg-primary/20 blur-xl z-0"
              animate={{ 
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut"  
              }}
            />
            <motion.div 
              className="absolute bottom-32 right-[15%] w-32 h-32 rounded-full bg-secondary/20 blur-xl z-0"
              animate={{ 
                y: [0, 40, 0],
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1 
              }}
            />
            <motion.div 
              className="absolute top-1/3 right-[30%] w-16 h-16 rounded-full bg-accent/30 blur-lg z-0"
              animate={{ 
                x: [0, 30, 0],
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2 
              }}
            />
          </>
        )}

        {/* Left content with animated text */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-8 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <AnimationWrapper animation="slideUp" delay={0.2}>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                <TypeWriter 
                  text={["%20 Daha Fazla", "Daha Akıllı", "Daha Güvenli"]}
                  className="gradient-text inline-block"
                  speed={80}
                  delay={2000}
                  loop={true}
                />
                <br/>
                <span className="text-white">Kripto Getiriniz Olsun</span>
              </h1>
            </AnimationWrapper>
            
            <AnimationWrapper animation="fadeIn" delay={0.5}>
              <p className="text-xl text-gray-300 mb-10 max-w-xl">
                Türkiye'deki en iyi staking fırsatlarını karşılaştırın ve kripto yatırımlarınızı optimize edin.
              </p>
            </AnimationWrapper>
            
            <AnimationWrapper animation="slideUp" delay={0.7}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/comparison" className="btn-accent inline-block">
                    Ödülleri Karşılaştır
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/subscription" className="btn-secondary inline-block border-white/30 bg-white/10 text-white hover:bg-white/20">
                    Premium Üyelik
                  </Link>
                </motion.div>
              </div>
            </AnimationWrapper>
            
            <AnimationWrapper animation="fadeIn" delay={1}>
              <div className="mt-16 hidden md:block">
                <p className="text-gray-400 mb-4">Güvenilir Platformlar</p>
                <LogoCarousel 
                  logos={platformLogos}
                  speed={35}
                  pauseOnHover={true}
                />
              </div>
            </AnimationWrapper>
          </div>
        </div>

        {/* Right content - Animated Card with top assets */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-8">
          <AnimationWrapper animation="slideUp" delay={0.4}>
            <GlassCard
              className="w-full max-w-xl"
              hoverEffect="lift"
              backgroundOpacity={0.15}
              borderGradient={true}
            >
              <AnimationWrapper animation="fadeIn" delay={0.6}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold dark:text-white">En İyi Staking Varlıkları</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-primary">
                      <CounterAnimation
                        end={cryptoAssets.length}
                        suffix="+"
                        className="font-bold"
                      />
                      <span className="ml-1">Varlık</span>
                    </span>
                  </div>
                </div>
              </AnimationWrapper>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3">#</th>
                      <th className="pb-3">Kripto</th>
                      <th className="pb-3">Ödül Oranı</th>
                      <th className="pb-3">Platform</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoAssets.map((asset, index) => (
                      <motion.tr 
                        key={asset.id} 
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark/50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + (index * 0.1) }}
                        whileHover={{ backgroundColor: 'rgba(12, 212, 181, 0.05)' }}
                      >
                        <td className="py-4">{asset.id}</td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="font-medium">{asset.name}</span>
                            <span className="text-gray-500 ml-2 text-sm">{asset.symbol}</span>
                          </div>
                        </td>
                        <td className="py-4 text-accent font-semibold">{asset.rewardRate}</td>
                        <td className="py-4">{asset.platform}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <AnimationWrapper animation="fadeIn" delay={1.2}>
                <div className="mt-6">
                  <Link href="/comparison" className="text-primary hover:text-secondary font-medium group flex items-center">
                    <span>Tüm varlıkları görüntüle</span>
                    <motion.span 
                      className="inline-block ml-1"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </AnimationWrapper>
            </GlassCard>
          </AnimationWrapper>
        </div>
      </section>

      {/* Features Section with Animated Cards */}
      <section className="py-20 bg-light dark:bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative z-10">
          <AnimationWrapper animation="fadeIn">
            <h2 className="section-title dark:text-white">
              <span className="gradient-text">Neden</span> Bizi Tercih Etmelisiniz?
            </h2>
          </AnimationWrapper>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StaggeredAnimationWrapper
              animation="slideUp"
              staggerDelay={0.15}
              parentDelay={0.3}
            >
              <GlassCard hoverEffect="lift" className="h-full">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Güncel Veri</h3>
                <p className="text-gray-600 dark:text-gray-300">En güncel staking oranları, minimum yatırım miktarları ve daha fazlası.</p>
              </GlassCard>

              <GlassCard hoverEffect="lift" className="h-full">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Detaylı Karşılaştırma</h3>
                <p className="text-gray-600 dark:text-gray-300">Farklı platformlar arasında en iyi staking fırsatlarını kolayca karşılaştırın.</p>
              </GlassCard>

              <GlassCard hoverEffect="lift" className="h-full">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">Premium Özellikler</h3>
                <p className="text-gray-600 dark:text-gray-300">Gerçek zamanlı uyarılar, gelişmiş filtreleme ve daha fazlası için premium üyelik.</p>
              </GlassCard>
            </StaggeredAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Featured Platforms Section with Animated Cards */}
      <section className="py-20 bg-white dark:bg-dark relative overflow-hidden">
        <AnimatedGradient 
          className="absolute inset-0" 
          colors={['rgba(12, 212, 181, 0.03)', 'rgba(34, 13, 83, 0.05)', 'rgba(12, 212, 181, 0.03)']}
          duration={15}
        />
        
        <div className="container relative z-10">
          <AnimationWrapper animation="fadeIn">
            <h2 className="section-title dark:text-white">Öne Çıkan Platformlar</h2>
          </AnimationWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimationWrapper animation="slideUp" delay={0.2}>
              <GlassCard hoverEffect="lift" className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-blue-600 font-bold">BT</span>
                    </div>
                    <h3 className="text-xl font-semibold dark:text-white">BtcTurk</h3>
                  </div>
                  <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 animated-border-gradient">
                    En Yüksek APY
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">USDT Staking</span>
                    <span className="font-semibold text-accent">%8 APY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">BTC Staking</span>
                    <span className="font-semibold text-accent">%4.5 APY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Minimum Miktar</span>
                    <span className="font-semibold dark:text-white">100 USDT</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link href="/platform/btcturk" className="btn-secondary w-full text-center flex justify-center">
                      İncele
                    </Link>
                  </motion.div>
                </div>
              </GlassCard>
            </AnimationWrapper>
            
            <AnimationWrapper animation="slideUp" delay={0.4}>
              <GlassCard hoverEffect="lift" className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <span className="text-purple-600 font-bold">PB</span>
                    </div>
                    <h3 className="text-xl font-semibold dark:text-white">Paribu</h3>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 animated-border-gradient">
                    En Çok Tercih Edilen
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">ETH Staking</span>
                    <span className="font-semibold text-accent">%7.5 APY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">DOT Staking</span>
                    <span className="font-semibold text-accent">%12 APY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Minimum Miktar</span>
                    <span className="font-semibold dark:text-white">0.1 ETH</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link href="/platform/paribu" className="btn-secondary w-full text-center flex justify-center">
                      İncele
                    </Link>
                  </motion.div>
                </div>
              </GlassCard>
            </AnimationWrapper>
            
            <AnimationWrapper animation="slideUp" delay={0.6}>
              <GlassCard hoverEffect="lift" className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                      <span className="text-yellow-600 font-bold">BN</span>
                    </div>
                    <h3 className="text-xl font-semibold dark:text-white">Binance TR</h3>
                  </div>
                  <div className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300 animated-border-gradient">
                    En Fazla Varlık
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">BNB Staking</span>
                    <span className="font-semibold text-accent">%9.2 APY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">AVAX Staking</span>
                    <span className="font-semibold text-accent">%9.0 APY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Minimum Miktar</span>
                    <span className="font-semibold dark:text-white">0.1 BNB</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link href="/platform/binance" className="btn-secondary w-full text-center flex justify-center">
                      İncele
                    </Link>
                  </motion.div>
                </div>
              </GlassCard>
            </AnimationWrapper>
          </div>

          <AnimationWrapper animation="fadeIn" delay={0.8}>
            <div className="text-center mt-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link href="/platforms" className="btn-primary">
                  Tüm Platformları Gör
                </Link>
              </motion.div>
            </div>
          </AnimationWrapper>
        </div>
      </section>

      {/* CTA Section with Animated Gradient and Counters */}
      <section className="py-20 relative overflow-hidden">
        <AnimatedGradient 
          className="absolute inset-0 z-0"
          colors={['#0CD4B5', '#220D53']}
          fromDirection="left"
          toDirection="right"
          duration={15}
        >
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        </AnimatedGradient>
        
        <div className="container relative z-10 text-center">
          <AnimationWrapper animation="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Kripto Yatırımlarınızı Optimize Edin
            </h2>
          </AnimationWrapper>
          
          <AnimationWrapper animation="slideUp" delay={0.3}>
            <p className="text-xl mb-10 max-w-3xl mx-auto text-white/90">
              Premium üyelik ile en iyi fırsatları yakalayın ve kripto yatırımlarınızdan maksimum getiri elde edin.
            </p>
          </AnimationWrapper>
          
          <AnimationWrapper animation="fadeIn" delay={0.5}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/subscription" className="btn-accent">
                  Premium Üyeliğe Geç
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/comparison" className="text-white border border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 px-5 py-3 rounded-md font-semibold text-sm transition-all">
                  Ödülleri Karşılaştır
                </Link>
              </motion.div>
            </div>
          </AnimationWrapper>
          
          <AnimationWrapper animation="fadeIn" delay={0.7}>
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      <CounterAnimation
                        end={stat.value}
                        prefix={stat.prefix || ''}
                        suffix={stat.suffix || ''}
                        duration={2}
                        delay={index * 0.2}
                        decimals={0}
                      />
                    </div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimationWrapper>
          
          <AnimationWrapper animation="fadeIn" delay={1}>
            <div className="mt-12 text-center">
              <GlassCard
                className="inline-block max-w-lg mx-auto py-3 px-4"
                backgroundOpacity={0.1}
                borderGradient={true}
              >
                <p className="text-sm text-white/90">
                  <span className="text-accent font-bold mr-1">✓</span> Tamamen güvenli, anında iptal, otomatik yenileme yok
                </p>
              </GlassCard>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </main>
  );
}