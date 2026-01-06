import Header from '@/components/Header';
import React from 'react';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/products';
import { Metadata } from 'next';
import ProjectDetailView from '@/components/project-page/ProjectDetailView';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';

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

    const productsUsedNames = project.productsUsed?.map(p => p.title) || [];
    const baseKeywords = [project.title, project.location, project.type, 'Architectural Facade', 'UrbanClay Projects'];
    const keywords = Array.from(new Set([...baseKeywords, ...productsUsedNames]));

    return {
        title: `${project.title} | ${project.location} | UrbanClay Case Study`,
        description: project.description?.slice(0, 160) || `Explore the architectural excellence of ${project.title} in ${project.location}, featuring premium UrbanClay materials.`,
        keywords: keywords,
        openGraph: {
            title: project.title,
            description: project.description?.slice(0, 160),
            url: `https://claytile.in/projects/${slug}`,
            siteName: 'UrbanClay',
            locale: 'en_IN',
            type: 'website',
            images: [
                {
                    url: project.imageUrl || `/api/og?type=project&slug=${slug}`,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
        alternates: {
            canonical: `https://claytile.in/projects/${slug}`
        },
        twitter: {
            card: 'summary_large_image',
            title: `${project.title} | ${project.location}`,
            description: project.description?.slice(0, 200),
            images: [project.imageUrl || `/api/og?type=project&slug=${slug}`],
        },
    };
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://claytile.in' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Projects', 'item': 'https://claytile.in/projects' },
            { '@type': 'ListItem', 'position': 3, 'name': project.title, 'item': `https://claytile.in/projects/${project.slug}` }
        ]
    };

    const projectJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        'name': project.title,
        'description': project.description || `Architectural project in ${project.location} featuring UrbanClay materials.`,
        'image': project.imageUrl,
        'contentLocation': {
            '@type': 'Place',
            'name': project.location
        },
        'author': {
            '@type': 'Organization',
            'name': 'UrbanClay'
        },
        'about': project.productsUsed?.map(p => ({
            '@type': 'Product',
            'name': p.title,
            'url': `https://claytile.in/products/${p.category || 'collection'}/${p.slug}`
        })) || []
    };

    return (
        <React.Fragment>
            <JsonLd data={[breadcrumbJsonLd, projectJsonLd]} />
            <Header />
            <main>
                <ProjectDetailView project={project} />
            </main>
            <Footer />
        </React.Fragment>
    );
}
