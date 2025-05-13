import React from 'react';
import Link from 'next/link';

export default function Home() {
  // Sample data for the table
  const cryptoAssets = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', rewardRate: '4.5%', price: '57,490 ₺', stakingMin: '0.01 BTC', platform: 'BtcTurk' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', rewardRate: '7.5%', price: '3,270 ₺', stakingMin: '0.1 ETH', platform: 'Paribu' },
    { id: 3, name: 'BNB', symbol: 'BNB', rewardRate: '9.2%', price: '560 ₺', stakingMin: '0.1 BNB', platform: 'Binance TR' },
    { id: 4, name: 'Solana', symbol: 'SOL', rewardRate: '6.3%', price: '175 ₺', stakingMin: '1 SOL', platform: 'BtcTurk' },
    { id: 5, name: 'Cardano', symbol: 'ADA', rewardRate: '8.2%', price: '4.50 ₺', stakingMin: '100 ADA', platform: 'Paribu' },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section with Split Design */}
      <section className="relative min-h-screen flex flex-col md:flex-row">
        {/* Background elements */}
        <div className="absolute inset-0 bg-dark dark:bg-gradient-to-br dark:from-dark dark:to-secondary z-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-primary/5 to-transparent"></div>
        </div>

        {/* Left content */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-8 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="gradient-text">%20 Daha Fazla</span><br/>
              <span className="text-white">Kripto Getiriniz Olsun</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-xl">
              Türkiye'deki en iyi staking fırsatlarını karşılaştırın ve kripto yatırımlarınızı optimize edin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/comparison" className="btn-accent">
                Ödülleri Karşılaştır
              </Link>
              <Link href="/subscription" className="btn-secondary">
                Premium Üyelik
              </Link>
            </div>
            
            <div className="mt-16 hidden md:block">
              <p className="text-gray-400 mb-4">Güvenilir Platformlar</p>
              <div className="flex space-x-8">
                <img src="/btcturk-logo.png" alt="BtcTurk" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                <img src="/paribu-logo.png" alt="Paribu" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                <img src="/binance-logo.png" alt="Binance" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* Right content - Card with top assets */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-8">
          <div className="card w-full max-w-xl bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">En İyi Staking Varlıkları</h2>
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
                  {cryptoAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark/50">
                      <td className="py-4">{asset.id}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <span className="font-medium">{asset.name}</span>
                          <span className="text-gray-500 ml-2 text-sm">{asset.symbol}</span>
                        </div>
                      </td>
                      <td className="py-4 text-accent font-semibold">{asset.rewardRate}</td>
                      <td className="py-4">{asset.platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <Link href="/comparison" className="text-primary hover:text-secondary font-medium">
                Tüm varlıkları görüntüle →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-20 bg-light dark:bg-dark">
        <div className="container">
          <h2 className="section-title dark:text-white">
            <span className="gradient-text">Neden</span> Bizi Tercih Etmelisiniz?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Güncel Veri</h3>
              <p className="text-gray-600 dark:text-gray-300">En güncel staking oranları, minimum yatırım miktarları ve daha fazlası.</p>
            </div>
            <div className="card">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Detaylı Karşılaştırma</h3>
              <p className="text-gray-600 dark:text-gray-300">Farklı platformlar arasında en iyi staking fırsatlarını kolayca karşılaştırın.</p>
            </div>
            <div className="card">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Premium Özellikler</h3>
              <p className="text-gray-600 dark:text-gray-300">Gerçek zamanlı uyarılar, gelişmiş filtreleme ve daha fazlası için premium üyelik.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Platforms Section */}
      <section className="py-20 bg-white dark:bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="container relative z-10">
          <h2 className="section-title dark:text-white">Öne Çıkan Platformlar</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <span className="text-blue-600 font-bold">BT</span>
                  </div>
                  <h3 className="text-xl font-semibold dark:text-white">BtcTurk</h3>
                </div>
                <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
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
                <Link href="/platform/btcturk" className="btn-secondary w-full text-center flex justify-center">
                  İncele
                </Link>
              </div>
            </div>
            
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <span className="text-purple-600 font-bold">PB</span>
                  </div>
                  <h3 className="text-xl font-semibold dark:text-white">Paribu</h3>
                </div>
                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
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
                <Link href="/platform/paribu" className="btn-secondary w-full text-center flex justify-center">
                  İncele
                </Link>
              </div>
            </div>
            
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                    <span className="text-yellow-600 font-bold">BN</span>
                  </div>
                  <h3 className="text-xl font-semibold dark:text-white">Binance TR</h3>
                </div>
                <div className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300">
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
                <Link href="/platform/binance" className="btn-secondary w-full text-center flex justify-center">
                  İncele
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/platforms" className="btn-primary">
              Tüm Platformları Gör
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient Background */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Kripto Yatırımlarınızı Optimize Edin
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-white/90">
            Premium üyelik ile en iyi fırsatları yakalayın ve kripto yatırımlarınızdan maksimum getiri elde edin.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/subscription" className="btn-accent">
              Premium Üyeliğe Geç
            </Link>
            <Link href="/comparison" className="text-white border border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 px-5 py-3 rounded-md font-semibold text-sm transition-all">
              Ödülleri Karşılaştır
            </Link>
          </div>
          
          <div className="mt-16 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm text-white/80">Kripto Varlık</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm text-white/80">Platform</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">%20</div>
                <div className="text-sm text-white/80">Daha Fazla Getiri</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 