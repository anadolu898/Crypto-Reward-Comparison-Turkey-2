import React from 'react';
import '../styles/globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';

// Dynamically import ThemeProvider with SSR disabled
const ThemeProvider = dynamic(() => import('../components/layout/ThemeProvider').then(mod => mod.default), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Crypto Rewards Comparison - Turkey',
  description: 'Compare staking, campaign, and other rewards offered by crypto exchanges and DeFi programs available in Turkey.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 