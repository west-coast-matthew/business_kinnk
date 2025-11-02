import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '@/styles/globals.scss';
import '@/styles/components.scss';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'knnk | Luxury Apparel for the Modern You',
  description:
    'Explore our exclusive collection of suggestive, playful apparel inspired by mystery and confidence. Celebrating freedom of expression.',
  keywords: [
    'apparel',
    'luxury fashion',
    'mystery',
    'suggestive fashion',
    'bedroom adventures',
  ],
  openGraph: {
    title: 'knnk | Luxury Apparel',
    description: 'Suggestive, playful apparel for the modern lifestyle.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="page-background"></div>
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
