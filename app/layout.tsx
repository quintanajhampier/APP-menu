import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dragon Menu — Sabor Oriental Premium',
  description: 'La experiencia gastronómica oriental definitiva. Escanea, explora y ordena desde tu mesa.',
  openGraph: {
    title: 'Dragon Menu',
    description: 'Experiencia gastronómica oriental premium',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.className} bg-[#0A0A0A] text-white min-h-screen antialiased`}
        style={{ backgroundColor: '#0A0A0A' }}
      >
        {children}
      </body>
    </html>
  );
}
