import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
/* Client Animation Wrapper */
import ArchitectPageAnimate from '@/components/ArchitectPageAnimate';

export const metadata: Metadata = {
    title: 'For Architects | UrbanClay Studio',
    description: 'The digital atelier for architects. Access high-fidelity BIM assets, technical specifications, and bespoke manufacturing services.',
    keywords: [
        'architects resources',
        'terracotta bim objects',
        'clay facade specifications',
        'custom terracotta manufacturing',
        'architectural terracotta india',
        'facade engineering support'
    ],
    openGraph: {
        title: 'For Architects | UrbanClay Studio',
        description: 'BIM Assets, Technical Specs & Bespoke Manufacturing for Architects.',
        url: 'https://claytile.in/architects',
        siteName: 'UrbanClay',
        locale: 'en_IN',
        type: 'website',
        images: [
            {
                url: 'https://claytile.in/images/architect-hero-confidence.png',
                width: 1200,
                height: 630,
                alt: 'UrbanClay for Architects'
            }
        ]
    },
    alternates: {
        canonical: 'https://claytile.in/architects'
    }
};

export default function ArchitectsPage() {
    return (
        <div className="min-h-screen bg-[#1a1512] text-[#EBE5E0] selection:bg-[var(--terracotta)] selection:text-white">
            <Header />
            <ArchitectPageAnimate />
            <Footer />
        </div>
    );
}

