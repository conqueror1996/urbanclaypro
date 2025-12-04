import React from 'react';
import { Metadata } from 'next';
import OurStoryContent from '@/components/OurStoryContent';

export const metadata: Metadata = {
    title: 'Our Story | UrbanClay',
    description: 'A legacy of transforming spaces and empowering lives through sustainable terracotta.',
};

export default function OurStory() {
    return <OurStoryContent />;
}

