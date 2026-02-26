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
    default: "UrbanClay® | Flexible Brick Tiles, Terracotta Panels, Exposed Bricks & Handmade Brick Tiles",
    template: "%s | UrbanClay India"
  },
  description: "India's premier manufacturer of high-precision clay facades. We provide flexible brick tiles, large format terracotta panels, architectural exposed bricks, and bespoke handmade brick tiles engineered for zero-failure performance in Indian climates.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "UrbanClay", url: "https://claytile.in" }],
  creator: "UrbanClay",
  publisher: "UrbanClay",
  alternates: {
    languages: {
      'en-IN': '/',
      'en-US': '/en-US',
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "UrbanClay® | High-Precision Clay Facade Systems & Brick Tiles",
    description: "Discover architectural mastery with ultra-lightweight flexible brick tiles and high-performance terracotta panels. Engineered for zero-failure facade integrity. Trusted by global architects.",
    url: 'https://claytile.in',
    siteName: 'UrbanClay',
    locale: 'en_IN',
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UrbanClay - Industrial Clay Facade Manufacturer India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrbanClay® | Engineered Clay Facade Systems & Brick Tiles',
    description: 'Transforming Indian architecture with high-precision flexible brick tiles and large-format terracotta panels. Pan-India delivery.',
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
    other: {
      'p:domain_verify': '8b9f75c2a32f30d64cb6e272756b6886',
    },
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
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Toaster } from 'sonner';
import JsonLd from "@/components/JsonLd";
import { generateOrganizationSchema } from "@/lib/schema";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <ResourceHints />
      </head>
      <body className={`${inter.variable} ${epilogue.variable} font-sans antialiased`} suppressHydrationWarning>
        <SecurityProvider>
          <SampleProvider>
            <SmoothScroll />
            <SplashLoader />
            <JsonLd data={generateOrganizationSchema()} />
            <PageTransition>{children}</PageTransition>
            <FootprintTracker />
            <WebVitalsReporter />
            <GlobalSampleModal />
            <SmartExitPopup />
            <FloatingSampleBadge />
            <WhatsAppFloat />
            <Toaster position="top-right" richColors />
          </SampleProvider>
        </SecurityProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <SpeedInsights />
      </body>
    </html>
  );
}
