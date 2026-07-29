import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '700', '800'],
});

export const metadata: Metadata = {
  title: 'The Global Scam Economy — Understanding Fraud and Its Impact Worldwide',
  description:
    'A single, definitive report on how modern scam networks operate worldwide, who they target, and what stops them — researched, sourced, and delivered instantly.',
  openGraph: {
    title: 'The Global Scam Economy',
    description:
      'Understanding fraud and its impact worldwide — a single, definitive report, delivered instantly.',
    type: 'website',
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
