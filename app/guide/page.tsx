import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import GuidePageAnimate from '@/components/GuidePageAnimate';
// import GuideContent from '@/components/GuideContent';
// import { getGuideData } from '@/lib/products';

export const metadata: Metadata = {
    title: 'Selection Guide | UrbanClay',
    description: 'Learn how to choose the right terracotta tiles and jaali panels for your project.',
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
