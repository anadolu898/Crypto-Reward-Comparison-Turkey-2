'use client';

import React from 'react';

export default function AboutPage() {
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
              Hakkımızda
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Türkiye'nin en kapsamlı kripto para ödülleri karşılaştırma platformu
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
            {/* Our Story Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Hikayemiz</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  KriptoKarşılaştır, 2022 yılında kripto para yatırımcılarının Türkiye'deki platformlar arasındaki en iyi fırsatları kolayca bulabilmesi amacıyla kuruldu. Kripto dünyasında hızla değişen ödül oranları, kampanyalar ve staking fırsatları arasında yatırımcıların en doğru kararları verebilmesi için tarafsız bir rehber olarak hizmet veriyoruz.
                </p>
                <p>
                  Kurucu ekibimiz, kripto para ve fintech alanında uzun yıllar deneyime sahip, teknoloji ve finans sektörlerinin kesişiminde çalışan uzmanlardan oluşuyor. Misyonumuz, Türkiye'deki kripto para yatırımcılarının daha bilinçli kararlar vermesine yardımcı olmak ve kripto para ekosisteminin ülkemizdeki gelişimine katkıda bulunmaktır.
                </p>
                <p>
                  Platformumuz, sürekli güncellenen veri tabanımız sayesinde Türkiye'deki tüm önemli kripto para borsaları ve platformlarındaki staking ödülleri, kampanyalar ve promosyonlar hakkında güncel bilgiler sunmaktadır. Kullanıcı dostu arayüzümüz ve detaylı karşılaştırma araçlarımız ile yatırımcıların maksimum getiri elde etmesine yardımcı oluyoruz.
                </p>
              </div>
            </div>
            
            {/* Our Mission Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Misyonumuz ve Vizyonumuz</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-dark-card rounded-xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Misyonumuz</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Türkiye'deki kripto para yatırımcılarının daha bilinçli kararlar almasını sağlamak için tarafsız, şeffaf ve güncel bir karşılaştırma platformu sunmak. Kullanıcı dostu arayüzümüz ve kapsamlı içeriğimizle, yatırımcıların maksimum getiri elde etmesine ve riskleri en aza indirmesine yardımcı olmak.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-dark-card rounded-xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Vizyonumuz</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Türkiye'de kripto para ekosisteminin sağlıklı gelişmesine katkıda bulunmak ve yatırımcıların dijital varlık dünyasında güvenle hareket etmesini sağlamak. Sektördeki gelişmeleri yakından takip ederek, her zaman en güncel ve doğru bilgileri sunmak ve Türkiye'nin önde gelen kripto para bilgi kaynağı olmak.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Our Values Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Değerlerimiz</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Güvenilirlik</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Kullanıcılarımıza her zaman tarafsız ve doğru bilgiler sunmayı taahhüt ediyoruz.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Şeffaflık</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Platformumuzda yer alan tüm bilgilerin kaynağını ve güncellenme tarihlerini açıkça belirtiyoruz.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Yenilikçilik</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Kripto para dünyasındaki gelişmeleri takip ederek platformumuzu sürekli geliştiriyor ve iyileştiriyoruz.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Section */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6">İletişim</h2>
              
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçebilirsiniz.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">E-posta</h4>
                      <p className="text-gray-700 dark:text-gray-300">iletisim@kriptokarsilastir.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Reklam ve İşbirlikleri</h4>
                      <p className="text-gray-700 dark:text-gray-300">reklam@kriptokarsilastir.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Not:</strong> KriptoKarşılaştır, yatırım tavsiyesi vermemektedir. Sitemizde yer alan bilgiler bilgilendirme amaçlıdır.
                  Yatırım kararları tamamen kullanıcıların sorumluluğundadır. Her zaman kendi araştırmanızı yapmanızı öneririz.
                </p>
              </div>
            </div>
          </div>
          
          {/* Data Update Notice */}
          <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} KriptoKarşılaştır. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
</rewritten_file>