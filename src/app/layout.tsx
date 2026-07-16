import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const siteUrl = 'https://uploadflow.cloudgrids.tech';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'UploadFlow — Private Upload Toolkit',
  description: 'Move media you are authorized to use from one webpage into another website’s upload flow without downloading it first.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'UploadFlow',
    title: 'UploadFlow — Move media between websites without downloading',
    description: 'Capture an authorized media URL on one webpage and send it into another website’s file input.',
    url: '/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'UploadFlow moving media from one website to another upload flow' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UploadFlow — Move media between websites without downloading',
    description: 'Capture authorized media on one webpage and upload it on another without saving a local copy first.',
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
