import React from 'react';
import '../styles/globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthProvider } from '../lib/auth/AuthContext';

export const metadata: Metadata = {
  title: 'KriptoFaiz - Kripto Para Staking ve Kampanya Karşılaştırma',
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
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 