'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the News article type
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
  category: 'news' | 'analysis' | 'guide';
  tags: string[];
}

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'analysis' | 'guides'>('all');
  
  // Mock news data
  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Türkiye\'de Kripto Para Vergilendirmesi 2023',
      summary: 'Türkiye\'de kripto para yatırımcılarını ilgilendiren son vergi düzenlemeleri ve yapılması gerekenler.',
      content: 'Lorem ipsum dolor sit amet...',
      date: '2023-05-10',
      author: 'Ahmet Yılmaz',
      imageUrl: '/images/news/placeholder.svg',
      category: 'news',
      tags: ['vergi', 'düzenleme', 'kripto']
    },
    {
      id: '2',
      title: 'BTC Türk ve Paribu Staking Fırsatları Karşılaştırması',
      summary: 'Türkiye\'nin iki büyük borsasının staking ödülleri ve şartları detaylı olarak karşılaştırıldı.',
      content: 'Lorem ipsum dolor sit amet...',
      date: '2023-05-05',
      author: 'Zeynep Kaya',
      imageUrl: '/images/news/placeholder.svg',
      category: 'analysis',
      tags: ['staking', 'btcturk', 'paribu', 'karşılaştırma']
    },
    {
      id: '3',
      title: 'Ethereum Staking Rehberi: Nasıl Başlanır?',
      summary: 'Ethereum stake etmek isteyenler için adım adım kapsamlı bir rehber.',
      content: 'Lorem ipsum dolor sit amet...',
      date: '2023-04-28',
      author: 'Mehmet Demir',
      imageUrl: '/images/news/placeholder.svg',
      category: 'guide',
      tags: ['ethereum', 'staking', 'rehber']
    },
    {
      id: '4',
      title: 'Kripto Para Sektöründe Yeni Düzenlemeler Geliyor',
      summary: 'BDDK ve SPK\'nın kripto para sektörüne yönelik hazırladığı yeni düzenlemeler hakkında bilgiler.',
      content: 'Lorem ipsum dolor sit amet...',
      date: '2023-04-20',
      author: 'Ayşe Yıldız',
      imageUrl: '/images/news/placeholder.svg',
      category: 'news',
      tags: ['düzenleme', 'bddk', 'spk']
    },
    {
      id: '5',
      title: 'Binance vs FTX: Hangi Platform Türk Kullanıcılar İçin Daha Avantajlı?',
      summary: 'İki büyük uluslararası kripto para borsasının Türkiye\'deki kullanıcılar için sunduğu avantajlar ve dezavantajlar.',
      content: 'Lorem ipsum dolor sit amet...',
      date: '2023-04-15',
      author: 'Kemal Özgür',
      imageUrl: '/images/news/placeholder.svg',
      category: 'analysis',
      tags: ['binance', 'ftx', 'karşılaştırma']
    },
    {
      id: '6',
      title: 'DeFi Platformlarında Kazanç Sağlama Rehberi',
      summary: 'Merkeziyetsiz finans (DeFi) platformlarında nasıl kazanç sağlanacağına dair detaylı bir rehber.',
      content: 'Lorem ipsum dolor sit amet...',
      date: '2023-04-10',
      author: 'Can Aydın',
      imageUrl: '/images/news/placeholder.svg',
      category: 'guide',
      tags: ['defi', 'yield farming', 'rehber']
    },
    {
      id: '7',
      title: 'Avax ve Solana Ağlarında Staking: Hangisi Daha Kârlı?',
      summary: 'Avax ve Solana blockchain ağlarında staking yapmanın kârlılık ve risk analizi.',
      content: 'Lorem ipsum dolor sit amet...',
      date: '2023-04-05',
      author: 'Burcu Yılmaz',
      imageUrl: '/images/news/placeholder.svg',
      category: 'analysis',
      tags: ['avax', 'solana', 'staking']
    },
    {
      id: '8',
      title: 'Türk Lirası ile Kripto Para Alım Satımı: En İyi Platformlar',
      summary: 'TL ile kripto para alıp satmak isteyenler için en uygun platform önerileri.',
      content: 'Lorem ipsum dolor sit amet...',
      date: '2023-03-30',
      author: 'Deniz Koç',
      imageUrl: '/images/news/placeholder.svg',
      category: 'guide',
      tags: ['türk lirası', 'alım satım', 'rehber']
    }
  ];
  
  // Filter articles based on the active tab
  const filteredArticles = activeTab === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => {
        if (activeTab === 'news') return article.category === 'news';
        if (activeTab === 'analysis') return article.category === 'analysis';
        if (activeTab === 'guides') return article.category === 'guide';
        return true;
      });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-dark pb-6">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-alt opacity-30"></div>
          <div className="absolute inset-0 bg-hero-pattern"></div>
        </div>
        <div className="relative pt-32 pb-20 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Kripto Para Haberleri
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Kripto para dünyasındaki son gelişmeler, analizler ve rehberler
            </p>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-12 fill-light dark:fill-dark">
            <path d="M0,96L48,80C96,64,192,32,288,26.7C384,21,480,43,576,58.7C672,75,768,85,864,80C960,75,1056,53,1152,48C1248,43,1344,53,1392,58.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="py-14 bg-light dark:bg-dark">
        <div className="container mx-auto px-4">
          
          {/* Category tabs */}
          <div className="flex flex-wrap items-center justify-center mb-10 gap-2">
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              Tümü
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'news' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('news')}
            >
              Haberler
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'analysis' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('analysis')}
            >
              Analizler
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'guides' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('guides')}
            >
              Rehberler
            </button>
          </div>
          
          {/* Featured article (first item) */}
          {filteredArticles.length > 0 && (
            <div className="mb-16">
              <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 relative h-64 md:h-auto">
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <Image 
                        src={filteredArticles[0].imageUrl} 
                        alt={filteredArticles[0].title} 
                        width={600} 
                        height={400} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8">
                    <div className="flex items-center mb-4">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                        filteredArticles[0].category === 'news' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                          : filteredArticles[0].category === 'analysis'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {filteredArticles[0].category === 'news' 
                          ? 'Haber' 
                          : filteredArticles[0].category === 'analysis' 
                            ? 'Analiz' 
                            : 'Rehber'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                        {new Date(filteredArticles[0].date).toLocaleDateString('tr-TR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{filteredArticles[0].title}</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">{filteredArticles[0].summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-2">
                          {filteredArticles[0].author.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{filteredArticles[0].author}</span>
                      </div>
                      <Link 
                        href={`/news/${filteredArticles[0].id}`} 
                        className="text-primary hover:text-primary-dark font-medium text-sm"
                      >
                        Devamını Oku
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Grid of articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(1).map(article => (
              <div key={article.id} className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="p-4 h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <Image 
                    src={article.imageUrl} 
                    alt={article.title} 
                    width={300} 
                    height={200} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <div className="flex items-center mb-3">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      article.category === 'news' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                        : article.category === 'analysis'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {article.category === 'news' 
                        ? 'Haber' 
                        : article.category === 'analysis' 
                          ? 'Analiz' 
                          : 'Rehber'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {new Date(article.date).toLocaleDateString('tr-TR', { 
                        day: 'numeric', 
                        month: 'long'
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3">{article.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{article.summary}</p>
                </div>
                <div className="px-6 pb-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{article.author}</span>
                    <Link 
                      href={`/news/${article.id}`} 
                      className="text-primary hover:text-primary-dark font-medium text-sm"
                    >
                      Devamını Oku
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Newsletter sign-up */}
          <div className="mt-20 bg-gradient-to-r from-primary to-secondary rounded-large shadow-xl p-8 text-white overflow-hidden relative">
            <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4 opacity-30">
              <svg className="w-64 h-64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="md:flex items-center justify-between relative z-10">
              <div className="mb-6 md:mb-0 md:mr-12">
                <h2 className="text-2xl font-bold mb-3">Haftalık Bültenimize Abone Olun</h2>
                <p className="text-white/80 max-w-2xl">
                  En güncel kripto para haberleri, analiz ve rehberleri için haftalık bültenimize abone olun. 
                  Premium içerikler ve özel fırsatlardan ilk siz haberdar olun.
                </p>
              </div>
              <div className="flex items-stretch">
                <input 
                  type="email" 
                  placeholder="E-posta adresiniz" 
                  className="bg-white/10 border border-white/20 text-white placeholder-white/60 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[200px]"
                />
                <button className="bg-accent hover:bg-opacity-90 text-dark font-semibold px-6 py-3 rounded-r-lg transition-all duration-200">
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
          
          {/* Popular tags */}
          <div className="mt-16">
            <h3 className="text-xl font-bold mb-4 text-center">Popüler Etiketler</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from(new Set(newsArticles.flatMap(article => article.tags))).map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Data Update Notice */}
          <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Son güncelleme: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mt-1 max-w-2xl mx-auto">
              Bu içerikler bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımaz.
              Her zaman kendi araştırmanızı yapmanızı öneririz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 