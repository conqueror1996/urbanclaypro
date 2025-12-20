import React from 'react';
import { Metadata } from 'next';
import OurStoryContent from '@/components/OurStoryContent';

export const metadata: Metadata = {
    title: 'Our Story | UrbanClay',
    description: 'A legacy of transforming spaces and empowering lives through sustainable terracotta.',
};

import { getAboutPageData } from '@/lib/company';

export default async function OurStory() {
    const data = await getAboutPageData();
    return <OurStoryContent data={data} />;
}

