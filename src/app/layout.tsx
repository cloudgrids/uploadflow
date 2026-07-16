import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const siteUrl = 'https://uploadflow.cloudgrids.tech';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'UploadFlow — Private Upload Toolkit',
  description: 'UploadFlow intercepts files before upload so you can optimize, redact, watermark, and review them privately in your browser.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'UploadFlow',
    title: 'UploadFlow — Own every file before it uploads',
    description: 'A private browser toolkit to optimize and protect files before they reach the web.',
    url: '/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'UploadFlow private upload toolkit preview' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UploadFlow — Own every file before it uploads',
    description: 'Optimize and protect files privately before they reach the web.',
    images: ['/og-image.png']
  },
  icons: { icon: '/favicon.svg' }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0d0f'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
