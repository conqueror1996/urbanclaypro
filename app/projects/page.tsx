import React from 'react';
import { getProjects } from '@/lib/products';
import Projects from '@/components/Projects';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyBar from '@/components/StickyBar';
import { Metadata } from 'next';

import dynamic from 'next/dynamic';

const ProjectAtlas = dynamic(() => import('@/components/ProjectAtlas'), {
    loading: () => <div className="h-[600px] bg-[#2A1E16] animate-pulse" />
});

export const metadata: Metadata = {
    title: 'Our Projects | UrbanClay',
    description: 'See how architects and builders are using UrbanClay products to create stunning, sustainable structures.',
};

export const revalidate = 60;

export default async function ProjectsPage() {
    const projects = await getProjects();

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

                <Projects projects={projects} showLink={false} layoutMode="mixed" />
            </div>
            <Footer />
        </div>
    );
}
