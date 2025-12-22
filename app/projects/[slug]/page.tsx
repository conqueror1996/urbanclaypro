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
            url: `https://urbanclay.in/projects/${slug}`,
            siteName: 'UrbanClay',
            locale: 'en_IN',
            type: 'website',
            images: [
                {
                    url: `/api/og?type=project&slug=${slug}`,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${project.title} | UrbanClay Projects`,
            description: project.description?.slice(0, 200),
            images: [`/api/og?type=project&slug=${slug}`],
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
