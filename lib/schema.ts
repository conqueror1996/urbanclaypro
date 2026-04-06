
import { Product, Project } from "./types";

export function generateGlobalSchema() {
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': 'https://claytile.in/#website',
            name: 'UrbanClay',
            url: 'https://claytile.in',
            publisher: { '@id': 'https://claytile.in/#organization' },
            potentialAction: {
                '@type': 'SearchAction',
                target: 'https://claytile.in/products?q={search_term_string}',
                'query-input': 'required name=search_term_string'
            }
        },
        ...generateOrganizationSchema()
    ];
}

import { CITIES } from './locations';

export function generateOrganizationSchema() {
    const regionalOffices = Object.values(CITIES).map(city => ({
        '@type': 'LocalBusiness',
        'name': `UrbanClay ${city.name}`,
        'image': 'https://claytile.in/urbanclay-logo.png',
        'telephone': '+91-8080081951',
        'url': `https://claytile.in/${city.slug}`,
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': city.name,
            'addressRegion': city.region,
            'addressCountry': 'IN'
        },
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': city.coordinates.lat,
            'longitude': city.coordinates.lng
        },
        'areaServed': city.areasServed.map(a => ({ '@type': 'Place', 'name': a }))
    }));

    return [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://claytile.in/#organization',
            name: 'UrbanClay',
            legalName: 'UrbanClay India Private Limited',
            url: 'https://claytile.in',
            logo: {
                '@type': 'ImageObject',
                url: 'https://claytile.in/urbanclay-logo.png',
                width: 112,
                height: 112
            },
            sameAs: [
                'https://www.instagram.com/urbanclay.in',
                'https://www.linkedin.com/company/urbanclay',
                'https://www.facebook.com/urbanclay.in',
                'https://in.pinterest.com/urbanclay_in',
                'https://www.youtube.com/@urbanclay',
                'https://twitter.com/urbanclay_in'
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-8080081951',
                contactType: 'sales',
                areaServed: 'IN',
                availableLanguage: ['en', 'hi', 'mr', 'kn', 'ta', 'gu']
            },
            subOrganization: regionalOffices.slice(0, 5), // Include top 5 as sub-orgs
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Mumbai',
                addressRegion: 'Maharashtra',
                postalCode: '400053',
                addressCountry: 'IN'
            },
            serviceArea: {
                '@type': 'Country',
                name: 'India'
            },
            areaServed: {
                '@type': 'Country',
                name: 'India',
                '@id': 'https://en.wikipedia.org/wiki/India'
            },
            foundingDate: '2018-05-15',
            knowsAbout: [
                'Terracotta Facades',
                'Flexible Brick Tiles',
                'Sustainable Architecture',
                'Clay Building Materials',
                'Rainscreen Cladding'
            ]
        },
        {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://claytile.in/#localbusiness',
            name: 'UrbanClay Manufacturer India',
            image: 'https://claytile.in/urbanclay-logo.png',
            telephone: '+91-8080081951',
            url: 'https://claytile.in',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Mumbai',
                addressRegion: 'Maharashtra',
                addressCountry: 'IN'
            },
            areaServed: Object.values(CITIES).map(city => ({
                '@type': 'AdministrativeArea',
                name: city.name,
                addressCountry: 'IN'
            })),
            geo: {
                '@type': 'GeoCoordinates',
                latitude: '19.1130',
                longitude: '72.8279'
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '156'
            },
            priceRange: '₹₹',
            openingHoursSpecification: [
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    opens: '09:00',
                    closes: '19:00'
                }
            ]
        },
        ...regionalOffices.slice(5) // Spread the rest as individual local businesses
    ];
}

export function generateProductSchema(product: Product, canonicalUrl: string) {
    const images = [
        product.imageUrl,
        ...(product.images || []),
        ...(product.variants?.map(v => v.imageUrl) || [])
    ].filter(Boolean);

    // Dynamic price logic based on category/tier
    let lowPrice = 45;
    let highPrice = 1500; // Expanded for large format panels

    if (product.priceRange === '$$') { lowPrice = 85; highPrice = 450; }
    if (product.priceRange === '$$$') { lowPrice = 450; highPrice = 2500; }

    // Specific category handling
    const categoryTitle = product.category?.title?.toLowerCase() || '';
    if (categoryTitle.includes('panel')) { lowPrice = 1200; highPrice = 5000; }
    if (categoryTitle.includes('jali')) { lowPrice = 120; highPrice = 800; }

    const variantOffers = product.variants?.map((v: any) => ({
        '@type': 'Offer',
        name: `${v.name} - ${product.title}`,
        priceCurrency: 'INR',
        lowPrice: lowPrice, // Assuming global for now, but can be variant-specific
        highPrice: highPrice,
        availability: 'https://schema.org/InStock',
        image: v.imageUrl || product.imageUrl,
        color: v.color,
        itemCondition: 'https://schema.org/NewCondition',
        url: `${canonicalUrl}?variant=${encodeURIComponent(v.name)}`,
        seller: { '@id': 'https://claytile.in/#organization' }
    })) || [];

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${canonicalUrl}/#product`,
        name: product.title,
        description: product.seo?.metaDescription || product.description,
        image: images,
        sku: product.sku || product._id,
        brand: {
            '@type': 'Brand',
            name: 'UrbanClay'
        },
        material: 'Kiln-fired Natural Terracotta Clay',
        manufacturer: {
            '@type': 'Organization',
            '@id': 'https://claytile.in/#organization'
        },
        offers: {
            '@type': 'AggregateOffer',
            url: canonicalUrl,
            priceCurrency: 'INR',
            lowPrice: lowPrice,
            highPrice: highPrice,
            offerCount: product.variants?.length || 1,
            availability: 'https://schema.org/InStock',
            offers: variantOffers.length > 0 ? variantOffers : [{
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: lowPrice,
                availability: 'https://schema.org/InStock',
                itemCondition: 'https://schema.org/NewCondition',
                url: canonicalUrl,
                seller: { '@id': 'https://claytile.in/#organization' }
            }],
            seller: { '@id': 'https://claytile.in/#organization' }
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            bestRating: '5',
            reviewCount: '156'
        },
        additionalProperty: [
            {
                '@type': 'PropertyValue',
                name: 'Water Absorption',
                value: product.specs?.waterAbsorption || 'Low'
            },
            {
                '@type': 'PropertyValue',
                name: 'Compressive Strength',
                value: product.specs?.compressiveStrength || 'High'
            },
            {
                '@type': 'PropertyValue',
                name: 'Fire Rating',
                value: 'Class A1 Non-Combustible'
            },
            {
                '@type': 'PropertyValue',
                name: 'Sustainability',
                value: '100% Recyclable Natural Clay'
            }
        ]
    };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `https://claytile.in${crumb.item.startsWith('/') ? crumb.item : `/${crumb.item}`}`
        }))
    };
}

export function generateProjectSchema(project: Project) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `https://claytile.in/projects/${project.slug}/#project`,
        headline: project.title,
        name: project.title,
        description: project.description,
        image: project.imageUrl,
        contentLocation: {
            '@type': 'Place',
            name: project.location
        },
        mentions: project.productsUsed?.map((p: any) => ({
            '@type': 'Product',
            name: p.title,
            url: `https://claytile.in/products/${p.category || 'collection'}/${p.slug}`
        })),
        author: { '@id': 'https://claytile.in/#organization' },
        publisher: { '@id': 'https://claytile.in/#organization' },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://claytile.in/projects/${project.slug}`
        }
    };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}

export function generateServiceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': 'https://claytile.in/#service-facade',
        serviceType: 'Facade Engineering & Supply',
        provider: { '@id': 'https://claytile.in/#organization' },
        areaServed: { '@id': 'https://en.wikipedia.org/wiki/India' },
        description: 'Professional supply and technical consultancy for terracotta rainscreen facades and thin-brick cladding systems.',
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Architectural Services',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Facade Technical Consulting',
                        description: 'Wind load analysis, thermal calculation, and shop drawing preparation for clay facade systems.'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Custom Product Development',
                        description: 'Bespoke clay body formulation and custom profile extrusion for large-scale architectural projects.'
                    }
                }
            ]
        }
    };
}
