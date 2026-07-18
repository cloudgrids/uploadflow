import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const siteUrl = 'https://uploadflow.cloudgrids.tech';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'UploadFlow — Capture, Prepare, and Upload Media',
  description: 'Capture authorized media on one website, prepare it in a private popup, side panel, or editor, and hand it to another website’s upload flow.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'UploadFlow',
    title: 'UploadFlow — Capture, prepare, and move media between websites',
    description: 'A local-first media shelf and preparation workspace for cross-site upload handoff.',
    url: '/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'UploadFlow moving media from one website to another upload flow' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UploadFlow — Capture, prepare, and move media between websites',
    description: 'Capture authorized media, prepare it privately, and hand it to another website without a permanent local copy first.',
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
