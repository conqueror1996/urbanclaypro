import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import GuidePageAnimate from '@/components/GuidePageAnimate';
// import GuideContent from '@/components/GuideContent';
// import { getGuideData } from '@/lib/products';

export const metadata: Metadata = {
    title: 'Selection Guide & Maintenance | UrbanClay',
    description: 'Expert guide on choosing the right terracotta tiles, brick patterns, and maintenance tips for architectural projects.',
    keywords: [
        'terracotta selection guide',
        'brick laying patterns',
        'terracotta maintenance',
        'clay tile installation tips',
        'efflorescence prevention',
        'facade weatherproofing'
    ],
    openGraph: {
        title: 'Terracotta Selection & Maintenance Guide',
        description: 'Complete guide to choosing and caring for your clay surfaces.',
        url: 'https://claytile.in/guide',
        siteName: 'UrbanClay',
        locale: 'en_IN',
        type: 'article',
        images: [
            {
                url: 'https://claytile.in/images/guide-cover.jpg',
                width: 1200,
                height: 630,
                alt: 'UrbanClay Selection Guide'
            }
        ]
    },
    alternates: {
        canonical: 'https://claytile.in/guide'
    }
};

export const revalidate = 60;

export default async function SelectionGuide() {
    // const guideData = await getGuideData(); // Removed old data fetch as new component handles static editorial content

    return (
        <div className="bg-[#1a1512]">
            <Header />
            <GuidePageAnimate />
            <Footer />
        </div>
    );
}
