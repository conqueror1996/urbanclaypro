
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

export function generateOrganizationSchema() {
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://claytile.in/#organization',
            name: 'UrbanClay',
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
                'https://www.youtube.com/@urbanclay'
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-8080081951',
                contactType: 'sales',
                areaServed: 'IN',
                availableLanguage: ['en', 'hi']
            },
            address: {
                '@type': 'PostalAddress',
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
            }
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
            areaServed: [
                'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Telangana', 'Andhra Pradesh',
                'Gujarat', 'Rajasthan', 'Delhi', 'Uttar Pradesh', 'West Bengal', 'Punjab', 'Haryana'
            ],
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
        }
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
                value: product.specs.waterAbsorption
            },
            {
                '@type': 'PropertyValue',
                name: 'Compressive Strength',
                value: product.specs.compressiveStrength
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
        author: { '@id': 'https://claytile.in/#organization' },
        publisher: { '@id': 'https://claytile.in/#organization' },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://claytile.in/projects/${project.slug}`
        }
    };
}
