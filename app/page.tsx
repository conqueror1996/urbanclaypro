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
const HomeSEOContent = dynamic(() => import('@/components/HomeSEOContent'));

// New UX Strategy Components
const TrustBar = dynamic(() => import('@/components/TrustBar'));
const TechnicalEdge = dynamic(() => import('@/components/TechnicalEdge'));
const Sustainability = dynamic(() => import('@/components/Sustainability'));
const TechnicalFAQ = dynamic(() => import('@/components/TechnicalFAQ'));



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

  return {
    title: "UrbanClay® | Terracotta Tiles, Brick Cladding & Jaali India",
    description: "Buy premium clay floor tiles, terracotta wall cladding & exposed wirecut bricks. Sustainable, low-efflorescence & pan-India delivery. UrbanClay® - The Architect's Choice.",
    openGraph: {
      title: "UrbanClay® | Premium Terracotta Tiles, Cladding & Jaali",
      description: "India's trusted manufacturer of clay floor tiles, wall cladding & jaali panels. 100% Natural & Sustainable. Pan-India Delivery.",
    },
    alternates: {
      canonical: 'https://claytile.in',
    }
  };
}

export default async function Home({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const injectedKeyword = extractSearchTerm(resolvedParams);

  const products = await getProducts()
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
                image: 'https://claytile.in/images/premium-terracotta-facade.png',
                brand: {
                  '@type': 'Brand',
                  name: 'UrbanClay'
                },
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'INR',
                  price: '45',
                  availability: 'https://schema.org/InStock',
                  url: 'https://claytile.in/products'
                }
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Jaali Panels',
                description: 'Decorative terracotta jaali panels for ventilation and aesthetics',
                image: 'https://claytile.in/images/breeze-block-interior.png',
                brand: {
                  '@type': 'Brand',
                  name: 'UrbanClay'
                },
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'INR',
                  price: '120',
                  availability: 'https://schema.org/InStock',
                  url: 'https://claytile.in/products'
                }
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Exposed Bricks',
                description: 'Wirecut, pressed, and handmade exposed clay bricks',
                image: 'https://claytile.in/images/commercial-facade-cladding.png',
                brand: {
                  '@type': 'Brand',
                  name: 'UrbanClay'
                },
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'INR',
                  price: '85',
                  availability: 'https://schema.org/InStock',
                  url: 'https://claytile.in/products'
                }
              },
            },
          ],
        },

        // Social Media & Knowledge Graph
        sameAs: [
          'https://www.linkedin.com/company/urbanclay',
          'https://www.instagram.com/urbanclay.in', // Corrected handle
          'https://www.facebook.com/urbanclay.in', // Corrected handle
          'https://www.youtube.com/@urbanclay', // Added YouTube for Video SEO
          'https://in.pinterest.com/urbanclay_in', // Added Pinterest for Visual Search
        ],

        // Price Range
        priceRange: '₹₹',

        // Opening Hours
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '19:00',
          }
        ],

        // Aggregate Rating (SEO Rich Snippet)
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '156',
          bestRating: '5',
          worstRating: '1'
        },

        // Geo Coordinates (Mumbai HQ)
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '19.1130',
          longitude: '72.8279'
        },

        // Detailed Contact Point
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-8080081951',
          contactType: 'sales',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi']
        },
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
      <JsonLd data={jsonLd} />
      <FAQSchema />
      <Header />

      {/* 1. IDENTITY HERO - System vs. Product Positioning */}
      <Hero data={homePageData} injectedKeyword={injectedKeyword} />

      {/* 2. THE FAILURE PROTOCOL - Eliminating Architectural Pain Points */}
      {/* Strategic placement: Solving for Efflorescence/Warpage before browsing collection */}
      <ScrollReveal>
        <TechnicalEdge />
      </ScrollReveal>

      {/* 2.5 TECHNICAL DEEP DIVE - Knowledge for Specifiers */}
      <ScrollReveal>
        <TechnicalFAQ />
      </ScrollReveal>

      {/* 3. PEER VALIDATION - National Scale & Trusted Partnerships */}
      <TrustBar firms={homePageData?.trustedFirms} />

      {/* 4. SYSTEM ARCHITECTURES - Application-Based Discovery */}
      <ScrollReveal className="bg-white">
        <SignatureCollection products={products} />
      </ScrollReveal>

      {/* 5. EXECUTION ARCHIVE - Commercial & Luxury Residential Proof */}
      <ScrollReveal className="bg-white">
        <Projects projects={recentProjects} />
      </ScrollReveal>

      {/* 6. THE SPECIFIER TOOLKIT - BIM, CAD & Design Utilities */}
      <ScrollReveal className="bg-[var(--sand)]">
        <Tools products={products} />
      </ScrollReveal>

      {/* 7. THE TECHNICAL DESK - Project-Specific Consultation */}
      <ScrollReveal className="bg-white" id="quote">
        <Suspense fallback={<div className="py-20 text-center">Loading form...</div>}>
          <QuoteForm />
        </Suspense>
      </ScrollReveal>

      {/* FOOTER & LOGISTICS BADGE */}
      <ScrollReveal className="bg-white">
        <KilnPreview />
        <Footer />
      </ScrollReveal>
    </div>
  );
}
