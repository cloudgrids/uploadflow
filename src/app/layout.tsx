import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../components/site/ThemeProvider';
import { SESSION_FLAG_SCRIPT } from '../components/site/sessionFlag';
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF9' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0C0E' }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/*
          Settles the header's account label before the first paint, the same way next-themes settles
          the theme. Without it a signed-in reader saw "Sign in" and then watched it change its mind —
          on every page, because every navigation here is a full load.

          It reads a cookie that carries no credential and grants nothing, and it must stay in the
          head: moved below the markup it would run after the first paint and restore the flicker it
          exists to remove.
        */}
        <script dangerouslySetInnerHTML={{ __html: SESSION_FLAG_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
