import type { Metadata, Viewport } from "next";
import { Epilogue, Inter } from "next/font/google";
import "./globals.css";
import SplashLoader from "@/components/SplashLoader";
import PageTransition from "@/components/PageTransition";
import ResourceHints from "@/components/ResourceHints";
import { SpeedInsights } from "@vercel/speed-insights/next";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover', // For notched devices (iPhone X+)
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F3' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1512' },
  ],
};

import { SEO_KEYWORDS } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL('https://claytile.in'),
  title: {
    default: "UrbanClay® | Premium Terracotta Facades & Bricks",
    template: "%s | UrbanClay India"
  },
  description: "India's finest terracotta tiles, brick cladding & jaali. Sustainable, high-precision clay products for architects. Request free samples today!",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "UrbanClay" }],
  creator: "UrbanClay",
  publisher: "UrbanClay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "UrbanClay - Premium Terracotta Tiles & Jaali Panels | Pan-India",
    description: "India's trusted source for low-efflorescence terracotta tiles, jaali panels & architectural cladding. Serving 100+ cities nationwide with premium quality.",
    url: 'https://claytile.in',
    siteName: 'UrbanClay',
    locale: 'en_IN',
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UrbanClay - Premium Terracotta Tiles & Jaali Panels India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrbanClay - Premium Terracotta Tiles India',
    description: 'Low-efflorescence clay brick tiles & jaali panels. Pan-India delivery to all major cities.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'M3QQNfOSKQ4nnCku83gLqX_Q35z6Lf8eGnjSa1q77fc',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'UrbanClay',
  },
};

import { GoogleAnalytics } from '@next/third-parties/google';

import WebVitalsReporter from '../components/WebVitalsReporter';

import SmoothScroll from '@/components/SmoothScroll';

import { SampleProvider } from '@/context/SampleContext';

import GlobalSampleModal from '@/components/GlobalSampleModal';

// ... imports

import SecurityProvider from "@/components/SecurityProvider";
import SmartExitPopup from "@/components/SmartExitPopup";


// ... imports

import FootprintTracker from "@/components/FootprintTracker";
import FloatingSampleBadge from "@/components/FloatingSampleBadge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ResourceHints />
      </head>
      <body className={`${inter.variable} ${epilogue.variable} font-sans antialiased`} suppressHydrationWarning>
        <SecurityProvider>
          <SampleProvider>
            <SmoothScroll />
            <SplashLoader />
            <PageTransition>{children}</PageTransition>
            <FootprintTracker />
            <WebVitalsReporter />
            <GlobalSampleModal />
            <SmartExitPopup />
            <FloatingSampleBadge />
          </SampleProvider>
        </SecurityProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <SpeedInsights />
      </body>
    </html>
  );
}
