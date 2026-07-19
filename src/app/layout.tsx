import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const siteUrl = 'https://uploadflow.cloudgrids.tech';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'UploadFlow — Move Media Between Websites Without Downloading',
  description:
    'Capture authorized images and videos from one website, prepare them privately in your browser, and deliver them to another upload field without cluttering Downloads.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'UploadFlow',
    title: 'UploadFlow — Move Media Between Websites Without Downloading',
    description: 'Capture media on one site, prepare it privately, and deliver it to another website’s upload field.',
    url: '/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'UploadFlow moving media from one website to another upload flow' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UploadFlow — Move Media Between Websites Without Downloading',
    description: 'Capture media on one site, prepare it privately, and deliver it to another website’s upload field.',
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
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
