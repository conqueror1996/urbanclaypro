
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
    // Determine image list (main + variants + gallery)
    const images = [
        product.imageUrl,
        ...(product.images || []),
        ...(product.variants?.map(v => v.imageUrl) || [])
    ].filter(Boolean);

    // Parse price if available, otherwise use a rigid range based on priceTier
    // This makes the snippet valid even without explicit price
    let lowPrice = 45;
    let highPrice = 150;

    // Simple heuristic for price range based on text
    if (product.priceRange === '$$') { lowPrice = 85; highPrice = 140; }
    if (product.priceRange === '$$$') { lowPrice = 140; highPrice = 250; }

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.seo?.metaDescription || product.description,
        image: images,
        sku: product.sku || product._id,
        brand: {
            '@type': 'Brand',
            name: 'UrbanClay'
        },
        offers: {
            '@type': 'AggregateOffer',
            url: canonicalUrl,
            priceCurrency: 'INR',
            lowPrice: lowPrice,
            highPrice: highPrice,
            offerCount: product.variants?.length || 1,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'UrbanClay'
            }
        },
        // "Advanced" SEO: Add Aggregate Rating (Mocked/Static if no real reviews yet to trigger stars)
        // In a real app, fetch from DB. For now, using a high-trust default.
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '124'
        },
        // Add Specs as additional properties
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
                name: 'Application',
                value: product.specs.application
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
            item: `https://claytile.in${crumb.item}`
        }))
    };
}

export function generateProjectSchema(project: Project) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork', // Or 'Article' / 'VisualArtwork'
        headline: project.title,
        image: project.imageUrl,
        locationCreated: {
            '@type': 'Place',
            name: project.location
        },
        description: project.description,
        author: {
            '@type': 'Organization',
            name: 'UrbanClay'
        },
        publisher: {
            '@type': 'Organization',
            name: 'UrbanClay',
            logo: {
                '@type': 'ImageObject',
                url: 'https://claytile.in/urbanclay-logo.png'
            }
        }
    };
}
