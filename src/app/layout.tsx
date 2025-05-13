import React from 'react';
import '../styles/globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import { AuthProvider } from '../lib/auth/AuthContext';

// Dynamically import ThemeProvider with SSR disabled
const ThemeProvider = dynamic(() => import('../components/layout/ThemeProvider').then(mod => mod.default), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Crypto Rewards Türkiye - Kripto Para Staking ve Kampanya Karşılaştırma',
  description: 'Türkiye\'deki kripto borsalarında sunulan staking, kampanya ve diğer ödül fırsatlarını karşılaştırın ve en iyi getiriyi elde edin.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 