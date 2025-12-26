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

export default async function OurStory() {
    const data = await getAboutPageData();
    return <OurStoryContent data={data} />;
}

