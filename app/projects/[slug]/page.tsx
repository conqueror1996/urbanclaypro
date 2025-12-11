import Header from '@/components/Header';
import React from 'react';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/products';
import { Metadata } from 'next';
import ProjectDetailView from '@/components/project-page/ProjectDetailView';
import Footer from '@/components/Footer';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return {
            title: 'Project Not Found | UrbanClay',
        };
    }

    return {
        title: `${project.title} | UrbanClay Projects`,
        description: project.description?.slice(0, 160) || `Check out ${project.title} by UrbanClay.`,
        openGraph: {
            title: project.title,
            description: project.description?.slice(0, 160),
            images: project.imageUrl ? [project.imageUrl] : [],
        },
    };
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return (
        <React.Fragment>
            <Header />
            <main>
                <ProjectDetailView project={project} />
            </main>
            <Footer />
        </React.Fragment>
    );
}
