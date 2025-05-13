import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

const ThemeProviderComponent = dynamic(() => import('./ThemeProvider').then(mod => mod.default), { ssr: false });
export { ThemeProviderComponent as ThemeProvider };
export { default as Footer } from '../Footer';
export { default as Navbar } from '../Navbar';