import React from 'react';
import { getProjects } from '@/lib/products';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectsPageAnimate from '@/components/ProjectsPageAnimate';
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
        url: 'https://claytile.in/projects',
        siteName: 'UrbanClay',
        type: 'website',
        locale: 'en_IN',
        images: ['https://claytile.in/images/premium-terracotta-facade.png'],
    },
    alternates: {
        canonical: 'https://claytile.in/projects'
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
        <div className="bg-[#1a1512]">
            <Header />
            <ProjectsPageAnimate
                projects={projects}
                AtlasComponent={<ProjectAtlas projects={projects} />}
            />
            <Footer />
        </div>
    );
}
