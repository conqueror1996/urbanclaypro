import type { Metadata } from "next";
import { Epilogue, Inter } from "next/font/google";
import "./globals.css";
import SplashLoader from "@/components/SplashLoader";
import PageTransition from "@/components/PageTransition";

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

export const metadata: Metadata = {
  metadataBase: new URL('https://urbanclay.in'),
  title: {
    default: "UrbanClay - Premium Terracotta Tiles & Jaali Panels | Pan-India Delivery",
    template: "%s | UrbanClay India"
  },
  description: "India's leading manufacturer of low-efflorescence clay brick tiles, terracotta jaali panels, and architectural cladding. Serving Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad & all major cities. Premium quality, pan-India delivery.",
  keywords: [
    // Product Keywords
    "terracotta tiles India",
    "clay brick tiles",
    "jaali panels",
    "facade tiles",
    "exposed brick tiles",
    "terracotta cladding",
    "architectural tiles",
    "brick wall tiles",
    "terracotta facade panels",
    "clay roof tiles",
    "wirecut bricks",
    "handmade bricks",
    "pressed bricks",
    "low efflorescence tiles",

    // Location Keywords - Major Cities
    "terracotta tiles Mumbai",
    "terracotta tiles Delhi",
    "terracotta tiles Bangalore",
    "terracotta tiles Pune",
    "terracotta tiles Hyderabad",
    "terracotta tiles Chennai",
    "terracotta tiles Kolkata",
    "terracotta tiles Ahmedabad",
    "terracotta tiles Gurgaon",
    "terracotta tiles Noida",

    // Use Case Keywords
    "facade cladding India",
    "architectural cladding",
    "interior brick tiles",
    "exterior wall tiles",
    "ventilation jaali",
    "decorative jaali panels",
    "sustainable building materials India",
    "eco-friendly tiles",

    // Professional Keywords
    "architect tiles India",
    "builder tiles",
    "contractor tiles",
    "premium clay products",
    "custom terracotta",
  ],
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
    url: 'https://urbanclay.in',
    siteName: 'UrbanClay',
    locale: 'en_IN',
    type: "website",
    images: [
      {
        url: 'https://urbanclaypro.vercel.app/og-image.png',
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
    images: ['https://urbanclaypro.vercel.app/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: '/',
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
    // Add your verification codes here when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

import { GoogleAnalytics } from '@next/third-parties/google';

import WebVitalsReporter from '../components/WebVitalsReporter';

import SmoothScroll from '@/components/SmoothScroll';

import { SampleProvider } from '@/context/SampleContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${epilogue.variable} font-sans antialiased`} suppressHydrationWarning>
        <SampleProvider>
          <SmoothScroll />
          <SplashLoader />
          <PageTransition>{children}</PageTransition>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
          <WebVitalsReporter />
        </SampleProvider>
      </body>
    </html>
  );
}
