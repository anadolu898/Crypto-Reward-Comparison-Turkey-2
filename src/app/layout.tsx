import React from 'react';
import '../styles/globals.css';
import type { Metadata } from 'next';
import { Navbar, Footer, ThemeProvider } from '../components/layout';

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