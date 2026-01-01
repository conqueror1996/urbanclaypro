import React from 'react';
import { Metadata } from 'next';
import OurStoryContent from '@/components/OurStoryContent';

export const metadata: Metadata = {
    title: 'Our Story & Heritage | UrbanClay',
    description: 'Discover our legacy of transforming spaces through sustainable terracotta. From traditional firing to modern precision engineering.',
    keywords: [
        'urbanclay history',
        'terracotta heritage',
        'sustainable building materials',
        'clay craftsmanship',
        'ethical manufacturing',
        'made in india'
    ],
    openGraph: {
        title: 'The UrbanClay Story',
        description: 'A journey of earth, fire, and architectural innovation.',
        url: 'https://claytile.in/our-story',
        siteName: 'UrbanClay',
        locale: 'en_IN',
        type: 'website',
        images: [
            {
                url: 'https://claytile.in/images/kiln-firing-process.jpg',
                width: 1200,
                height: 630,
                alt: 'Traditional Kiln Firing Process'
            }
        ]
    },
    alternates: {
        canonical: 'https://claytile.in/our-story'
    }
};

import { getAboutPageData } from '@/lib/company';

import JsonLd from '@/components/JsonLd';

export default async function OurStory() {
    const data = await getAboutPageData();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        mainEntity: {
            '@type': 'Organization',
            name: 'UrbanClay',
            foundingDate: '2020',
            description: 'UrbanClay is India’s leading manufacturer of sustainable, high-precision terracotta cladding and jaali systems.',
            url: 'https://claytile.in',
            logo: 'https://claytile.in/urbanclay-logo.png',
            sameAs: [
                'https://www.linkedin.com/company/urbanclay',
                'https://www.instagram.com/urbanclay.in',
                'https://www.youtube.com/@urbanclay'
            ]
        }
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <OurStoryContent data={data} />
        </>
    );
}

