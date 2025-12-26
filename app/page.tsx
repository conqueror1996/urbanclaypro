import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ScrollReveal from '@/components/ScrollReveal';
import JsonLd from '@/components/JsonLd';
import { getProducts, getProjects, getHomePageData } from '@/lib/products';
import { extractSearchTerm, generateDynamicTitle } from '@/lib/search-injection';
import { Metadata } from 'next';

const KilnPreview = dynamic(() => import('@/components/KilnAnimationWrapper'));

const SignatureCollection = dynamic(() => import('@/components/SignatureCollection'));
const Architects = dynamic(() => import('@/components/Architects'));
const Projects = dynamic(() => import('@/components/Projects'));
const ProjectAtlas = dynamic(() => import('@/components/ProjectAtlas'));
const Tools = dynamic(() => import('@/components/Tools'));
const QuoteForm = dynamic(() => import('@/components/QuoteForm'));
const Footer = dynamic(() => import('@/components/Footer'));
const OurStoryTeaser = dynamic(() => import('@/components/OurStoryTeaser'));
const FAQSchema = dynamic(() => import('@/components/FAQSchema'));



export const revalidate = 60; // Revalidate every 60 seconds

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const term = extractSearchTerm(resolvedParams);
  // Only override if a term exists
  if (term) {
    return {
      title: generateDynamicTitle('Terracotta Tiles', term),
      description: `Discover premium ${term} by UrbanClay. Low efflorescence, high durability, and delivered across India. Get a free sample today.`,
      openGraph: {
        title: `Premium ${term} - UrbanClay India`,
        description: `India's trusted source for ${term}. Serving 100+ cities nationwide with premium quality.`,
      }
    }
  }
  return {};
}

export default async function Home({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const injectedKeyword = extractSearchTerm(resolvedParams);

  const products = await getProducts();
  const allProjects = await getProjects();
  const recentProjects = allProjects.slice(0, 3);
  const homePageData = await getHomePageData();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://claytile.in/#website',
        name: 'UrbanClay',
        url: 'https://claytile.in',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://claytile.in/products?search={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://claytile.in/#place',
        name: 'UrbanClay',
        legalName: 'UrbanClay',
        url: 'https://claytile.in',
        logo: 'https://claytile.in/urbanclay-logo.png',
        image: 'https://claytile.in/urbanclay-logo.png',
        description: 'Leading manufacturer and supplier of premium terracotta tiles, clay brick tiles, jaali panels, and architectural cladding across India. Serving architects, builders, and contractors nationwide.',

        // Contact Information
        telephone: '+91-8080081951',
        email: 'urbanclay@claytile.in',

        // Address
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },

        // Service Areas - Major Indian Cities
        areaServed: [
          { '@type': 'City', name: 'Mumbai', addressCountry: 'IN' },
          { '@type': 'City', name: 'Delhi', addressCountry: 'IN' },
          { '@type': 'City', name: 'Bangalore', addressCountry: 'IN' },
          { '@type': 'City', name: 'Pune', addressCountry: 'IN' },
          { '@type': 'City', name: 'Hyderabad', addressCountry: 'IN' },
          { '@type': 'City', name: 'Chennai', addressCountry: 'IN' },
          { '@type': 'City', name: 'Kolkata', addressCountry: 'IN' },
          { '@type': 'City', name: 'Ahmedabad', addressCountry: 'IN' },
          { '@type': 'City', name: 'Gurgaon', addressCountry: 'IN' },
          { '@type': 'City', name: 'Noida', addressCountry: 'IN' },
          { '@type': 'Country', name: 'India' },
        ],

        // Products/Services Offered
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Terracotta & Clay Products',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Terracotta Tiles',
                description: 'Low-efflorescence clay brick tiles for facades and interiors',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Jaali Panels',
                description: 'Decorative terracotta jaali panels for ventilation and aesthetics',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Exposed Bricks',
                description: 'Wirecut, pressed, and handmade exposed clay bricks',
              },
            },
          ],
        },

        // Social Media
        sameAs: [
          'https://www.linkedin.com/company/urbanclay',
          'https://www.instagram.com/urbanclay',
          'https://twitter.com/urbanclay',
          'https://www.facebook.com/urbanclay',
        ],

        // Contact Point
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-8080081951',
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi'],
        },

        // Price Range
        priceRange: '₹₹',

        // Opening Hours
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday'
            ],
            opens: '09:00',
            closes: '19:00',
          }
        ],

        // Aggregate Rating (SEO Rich Snippet)
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '124',
          bestRating: '5',
          worstRating: '1'
        },

        // Geo Coordinates (Mumbai)
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '19.1130',
          longitude: '72.8279'
        },
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
      <JsonLd data={jsonLd} />
      <FAQSchema />
      <Header />
      <Hero data={homePageData} injectedKeyword={injectedKeyword} />

      {/* Soft Gradient Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 opacity-40">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--terracotta)] to-transparent" />
      </div>

      {/* Signature Collections */}
      <ScrollReveal className="bg-white">
        <SignatureCollection products={products} />
      </ScrollReveal>

      {/* Our Story - Sand Background (Already set in component, but ensuring flow) */}
      <ScrollReveal>
        <OurStoryTeaser data={homePageData} />
      </ScrollReveal>

      {/* Architects - Light Terracotta Tint */}
      <ScrollReveal className="bg-[#fcf8f6]">
        <Architects />
      </ScrollReveal>

      {/* Quote Form - Moved Higher as requested */}
      <ScrollReveal className="bg-white">
        <Suspense fallback={<div className="py-20 text-center">Loading form...</div>}>
          <QuoteForm />
        </Suspense>
      </ScrollReveal>

      {/* Projects - White Background */}
      <ScrollReveal className="bg-white">
        <Projects projects={recentProjects} />
      </ScrollReveal>

      {/* Tools - Sand Background */}
      <ScrollReveal className="bg-[var(--sand)]">
        <Tools products={products} />
      </ScrollReveal>


      {/* Project Atlas - Global Reach */}
      <ScrollReveal className="bg-[var(--ink)]">
        <ProjectAtlas projects={allProjects} />
      </ScrollReveal>

      {/* Footer Section */}
      <ScrollReveal className="bg-white">
        <KilnPreview />
        <Footer />
      </ScrollReveal>
    </div>
  );
}
