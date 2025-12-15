import type { Metadata } from "next";
import { Epilogue, Inter } from "next/font/google";
import "./globals.css";
import SplashLoader from "@/components/SplashLoader";
import PageTransition from "@/components/PageTransition";
import ResourceHints from "@/components/ResourceHints";

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
    // Core Product Keywords
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

    // Expanded Product Variants
    "thin brick veneers",
    "hollow clay blocks",
    "porotherm bricks",
    "ventilated facade systems",
    "louvers and baguettes",
    "ceramic wall cladding",
    "fly ash bricks alternative",
    "red clay bricks",
    "antique brick tiles",
    "reclaimed bricks",
    "glazed terracotta",
    "terracotta louvers",
    "rainscreen cladding",

    // Broader Construction & Architecture
    "building facade materials",
    "sustainable construction materials",
    "green building products India",
    "architectural supplies",
    "exterior wall cladding",
    "interior design materials",
    "landscape pavers",
    "patio flooring",
    "elevation tiles design",
    "modern house elevation",
    "traditional indian architecture",
    "vernacular architecture materials",
    "exposed brickwork specs",
    "facade engineering",
    "building envelope solutions",
    "thermal insulation materials",
    "natural cooling materials",
    "leed certified materials",
    "igbc green building products",

    // Location Keywords - Major Cities & States
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
    "construction materials Kerala",
    "brick suppliers Goa",
    "tile showroom Chandigarh",
    "facade contractors Jaipur",
    "architects in Surat",
    "builders in Indore",

    // Application Keywords
    "office facade design",
    "hospitality architecture",
    "resort design materials",
    "cafe interior design",
    "luxury home exterior",
    "villa elevation materials",
    "compound wall cladding",
    "gate design materials",
    "living room wall texture",
    "bedroom feature wall",

    // Professional Keywords
    "architect tiles India",
    "builder resources",
    "contractor supplies",
    "premium clay products",
    "custom terracotta manufacturing",
    "bulk building materials",
    "construction material wholesaler",
    "architectural specification",
    "turnkey facade solutions",
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
    viewportFit: 'cover', // For notched devices (iPhone X+)
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F3' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1512' },
  ],
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

// ... imports

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
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
            <WebVitalsReporter />
            <GlobalSampleModal />
          </SampleProvider>
        </SecurityProvider>
      </body>
    </html>
  );
}
