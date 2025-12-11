import React from 'react';
import { getProjects } from '@/lib/products';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyBar from '@/components/StickyBar';
import ProductShowcase from '@/components/ProductShowcase';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ProjectAtlas = dynamic(() => import('@/components/ProjectAtlas'), {
    loading: () => <div className="h-[600px] bg-[#2A1E16] animate-pulse" />
});

export const metadata: Metadata = {
    title: 'Architectural Projects & Case Studies | UrbanClay India',
    description: 'Explore our portfolio of terracotta facades, exposed brick houses, and commercial projects across India. See how architects use UrbanClay.',
    keywords: [
        'architectural projects india',
        'terracotta facade case studies',
        'exposed brick house designs',
        'modern indian architecture',
        'sustainable building projects',
        'urbanclay portfolio',
        'facade design ideas'
    ],
    openGraph: {
        title: 'Architectural Projects | UrbanClay Portfolio',
        description: 'Showcasing the best terracotta and clay architecture in India.',
        url: 'https://urbanclay.in/projects',
        type: 'website',
        locale: 'en_IN',
        images: ['https://urbanclay.in/og-projects.jpg'], // Assuming you might have a general OG image or will use one of the projects
    }
};

export const revalidate = 60;

export default async function ProjectsPage() {
    const rawProjects = await getProjects();

    // Type Safety Fix: ensure imageUrl is string
    const projects = rawProjects.map(p => ({
        ...p,
        imageUrl: p.imageUrl || '' // Fallback to empty string if undefined
    }));

    return (
        <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
            <StickyBar />
            <Header />
            <div className="pt-20">
                <div className="bg-[#E7ECEF] py-16 px-4 text-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex justify-center">
                        <Breadcrumbs />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2A1E16] mb-4">Featured Projects</h1>
                    <p className="text-lg text-[#5d554f] max-w-2xl mx-auto">
                        A showcase of architectural excellence using our clay products.
                    </p>
                </div>

                {/* INTERACTIVE MAP */}
                <ProjectAtlas projects={projects} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                    <ProductShowcase projects={projects} />
                </div>
            </div>
            <Footer />
        </div>
    );
}
