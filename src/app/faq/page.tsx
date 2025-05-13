'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Define the FAQ item interface
interface FaqItem {
  question: string;
  answer: string;
  category: 'general' | 'staking' | 'platform' | 'security';
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'staking' | 'platform' | 'security'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  // Toggle a question's expanded state
  const toggleQuestion = (index: number) => {
    const newExpandedQuestions = new Set(expandedQuestions);
    if (expandedQuestions.has(index)) {
      newExpandedQuestions.delete(index);
    } else {
      newExpandedQuestions.add(index);
    }
    setExpandedQuestions(newExpandedQuestions);
  };

  // FAQ data
  const faqItems: FaqItem[] = [
    // General questions
    {
      question: 'Kripto para nedir?',
      answer: 'Kripto para, şifreleme teknolojisi kullanılarak güvenliği sağlanan, genellikle merkezi bir otoriteye bağlı olmayan dijital veya sanal bir para birimidir. Bitcoin, ilk ve en bilinen kripto para birimidir, ancak günümüzde Ethereum, Ripple, Litecoin gibi binlerce alternatif kripto para birimi mevcuttur.',
      category: 'general'
    },
    {
      question: 'Kripto para yatırımı yapmak güvenli mi?',
      answer: 'Kripto para yatırımları yüksek volatilite içerebilir ve risk taşır. Güvenli yatırım için güvenilir platformlar kullanmak, risk yönetimi yapmak, çeşitlendirme stratejisi uygulamak ve yalnızca kaybetmeyi göze alabileceğiniz miktarı yatırmak önemlidir. Her yatırım kararından önce kapsamlı araştırma yapmanızı ve gerekirse finansal danışmanlardan yardım almanızı öneririz.',
      category: 'general'
    },
    {
      question: 'Hangi kripto paraları satın alabilirim?',
      answer: 'Türkiye\'deki kripto para borsalarında Bitcoin (BTC), Ethereum (ETH), Ripple (XRP), Litecoin (LTC), Cardano (ADA), Solana (SOL), Binance Coin (BNB) gibi popüler kripto paraların yanı sıra, yerli ve yabancı birçok alternatif kripto para birimi bulunmaktadır. Her platformun sunduğu kripto para çeşidi farklılık gösterebilir, bu nedenle ilgilendiğiniz kripto paraları hangi platformların desteklediğini kontrol etmelisiniz.',
      category: 'general'
    },
    
    // Staking questions
    {
      question: 'Staking nedir?',
      answer: 'Staking, belirli bir kripto parayı cüzdanınızda tutarak ağın güvenliğine ve işlemlerine katkıda bulunmanız ve karşılığında ödül kazanmanız sürecidir. Proof of Stake (PoS) mekanizmasını kullanan blokzincirlerinde yaygındır. Staking yaparak, sahip olduğunuz kripto paraların değerini artırabilirsiniz.',
      category: 'staking'
    },
    {
      question: 'APY ne anlama gelir?',
      answer: 'APY (Annual Percentage Yield), yıllık yüzde getiri anlamına gelir ve bir yıl içinde kazanabileceğiniz toplam getiriyi, birleşik faiz dahil gösterir. Örneğin, %10 APY, 1000 birimlik bir yatırımın bir yıl sonunda 1100 birime ulaşacağı anlamına gelir. APY, farklı platformlardaki staking fırsatlarını karşılaştırmak için kullanılan önemli bir metriktir.',
      category: 'staking'
    },
    {
      question: 'Staking süresi bittiğinde ne olur?',
      answer: 'Staking süresi sona erdiğinde, stake ettiğiniz kripto paralar ve kazandığınız ödüller genellikle hesabınıza serbest bırakılır. Bu aşamada, stake ettiğiniz paraları çekebilir, satabilir veya yeniden stake edebilirsiniz. Bazı platformlar, staking süresinin sonunda otomatik yenileme seçeneği de sunabilir.',
      category: 'staking'
    },
    {
      question: 'Flexible staking nedir?',
      answer: 'Flexible staking (esnek staking), belirli bir kilitleme süresi olmadan, istediğiniz zaman stake ettiğiniz kripto paraları çekebilmenizi sağlayan bir seçenektir. Sabit süreli staking ürünlerine göre genellikle daha düşük APY sunar, ancak kripto paralarınıza her an erişebilme esnekliği sağlar.',
      category: 'staking'
    },
    {
      question: 'Staking yaparken riskler nelerdir?',
      answer: 'Staking\'in ana riskleri arasında kripto para fiyatlarındaki volatilite, platform riskleri (güvenlik açıkları veya hack olayları), likidite riski (özellikle uzun kilitleme sürelerinde) ve teknik riskler (ağ sorunları, yazılım hataları) bulunur. Ayrıca, bazı PoS kripto paralarında \"slashing\" adı verilen, belirli kurallara uyulmadığında ceza uygulanabilen durumlar da olabilir.',
      category: 'staking'
    },
    
    // Platform questions
    {
      question: 'Hangi kripto para platformunu seçmeliyim?',
      answer: 'En iyi platform seçimi, yatırım hedeflerinize, risk toleransınıza ve ihtiyaçlarınıza bağlıdır. Ücretler, desteklenen kripto paralar, güvenlik önlemleri, kullanıcı arayüzü, müşteri desteği ve sunulan hizmetler (staking, borç verme, ticaret seçenekleri) gibi faktörleri değerlendirmelisiniz. Platformumuz, farklı borsaları bu faktörlere göre karşılaştırmanıza yardımcı olur.',
      category: 'platform'
    },
    {
      question: 'Kripto para platformları nasıl para kazanır?',
      answer: 'Kripto para platformları genellikle işlem ücretleri, para yatırma/çekme ücretleri, spread (alış-satış fiyatı arasındaki fark), abonelik ücretleri, listeleme ücretleri (yeni kripto paraları listelemek için) ve premium hizmetler gibi çeşitli gelir kaynaklarına sahiptir. Bazı platformlar ayrıca kendi token\'larını çıkararak ek gelir elde edebilir.',
      category: 'platform'
    },
    {
      question: 'Platformlar güvenli mi?',
      answer: 'Güvenilir kripto para platformları, çift faktörlü kimlik doğrulama (2FA), soğuk depolama (cold storage), düzenli güvenlik denetimleri ve sigorta fonları gibi güvenlik önlemlerini uygular. Ancak, hiçbir platform %100 güvenli değildir. Platformların güvenlik geçmişini, kullanıcı yorumlarını ve düzenleyici uyumluluğunu araştırmanız önemlidir. Ayrıca, büyük miktarda kripto paranızı uzun süre merkezi borsalarda tutmak yerine, kendi cüzdanınızda saklamanız da bir güvenlik önlemidir.',
      category: 'platform'
    },
    {
      question: 'Platforma para yatırma ve çekme nasıl çalışır?',
      answer: 'Çoğu platform TL ile para yatırma için banka havalesi, EFT veya kredi kartı seçenekleri sunar. Kripto para yatırma işlemi için platformun size sağladığı cüzdan adresine transfer yapmanız gerekir. Para çekme işlemleri için platformdaki hesabınızdan çekmek istediğiniz miktarı belirtip, banka hesabınıza veya kripto cüzdanınıza transferi başlatabilirsiniz. Her platform için farklı limitler, ücretler ve işlem süreleri olabilir.',
      category: 'platform'
    },
    
    // Security questions
    {
      question: 'Kripto paramı nasıl güvende tutarım?',
      answer: 'Kripto paralarınızı güvende tutmak için: güvenilir bir cüzdan kullanın (donanım cüzdanları en güvenlidir), güçlü ve benzersiz şifreler oluşturun, iki faktörlü kimlik doğrulamayı (2FA) etkinleştirin, şüpheli bağlantılara tıklamayın, ağ ücretleri veya adres doğrulaması için küçük test işlemleri yapın ve özel anahtarlarınızı asla paylaşmayın.',
      category: 'security'
    },
    {
      question: 'Phishing saldırılarından nasıl korunabilirim?',
      answer: 'Phishing saldırılarından korunmak için: URL\'leri her zaman kontrol edin, platform veya cüzdan sitelerine doğrudan gitmek için yer imlerini kullanın, e-postalardaki veya sosyal medyadaki bağlantılara tıklamaktan kaçının, şüpheli mesajları bildirin, kripto platformlarının resmi hesaplarını takip edin ve platform web sitelerinin SSL sertifikalarının olduğundan emin olun (adres çubuğunda kilit simgesi arayın).',
      category: 'security'
    },
    {
      question: 'Türkiye\'de kripto para regülasyonları nelerdir?',
      answer: 'Türkiye\'de 2021 yılında yürürlüğe giren bir düzenleme ile kripto varlıkların ödemelerde kullanılması yasaklanmıştır. Ayrıca, kripto para hizmet sağlayıcıları için MASAK (Mali Suçları Araştırma Kurulu) tarafından kayıt ve müşterini tanı (KYC) gereksinimleri getirilmiştir. Kripto para alım satımı ise yasal olmaya devam etmektedir. Düzenlemeler değişebileceği için güncel bilgiler için resmi kaynakları takip etmenizi öneririz.',
      category: 'security'
    }
  ];

  // Filter FAQ items based on the active category
  const filteredFaqs = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

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
              Sık Sorulan Sorular
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Kripto para yatırımları ve staking hakkında merak ettiğiniz her şey
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
          <div className="max-w-4xl mx-auto">
            {/* Category tabs */}
            <div className="flex flex-wrap justify-center mb-10 gap-2">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory('all')}
              >
                Tümü
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'general' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory('general')}
              >
                Genel
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'staking' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory('staking')}
              >
                Staking
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'platform' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory('platform')}
              >
                Platformlar
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'security' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory('security')}
              >
                Güvenlik
              </button>
            </div>
            
            {/* FAQ items */}
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleQuestion(index)}
                  >
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <svg 
                      className={`w-5 h-5 transition-transform ${expandedQuestions.has(index) ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div 
                    className={`px-6 pb-6 transition-all duration-300 ${
                      expandedQuestions.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <p className="text-gray-700 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Not finding what you're looking for section */}
            <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Aradığınızı bulamadınız mı?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Kripto para dünyası ile ilgili başka sorularınız varsa, bizimle iletişime geçmekten çekinmeyin. 
                Uzman ekibimiz size yardımcı olmaktan memnuniyet duyacaktır.
              </p>
              <Link 
                href="/about#contact" 
                className="btn-primary"
              >
                İletişime Geçin
              </Link>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="max-w-2xl mx-auto">
              <strong>Uyarı:</strong> Bu sayfada verilen bilgiler yalnızca eğitim ve bilgilendirme amaçlıdır ve herhangi bir
              finansal tavsiye olarak yorumlanmamalıdır. Kripto para yatırımları yüksek risk taşıyabilir. Her zaman kendi araştırmanızı yapmanızı
              ve gerekirse profesyonel finansal danışmanlık almanızı öneririz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 