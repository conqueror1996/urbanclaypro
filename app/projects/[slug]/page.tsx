import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductImageGallery from '@/components/ProductImageGallery';
import { getProject } from '@/lib/products';

import { Metadata } from 'next';

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
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
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

    // Combine main image and gallery into a single list for the carousel
    const rawImages = [project.imageUrl, ...(project.gallery || [])].filter((img): img is string => !!img);
    // Remove duplicates
    const allImages = Array.from(new Set(rawImages));

    return (
        <div className="bg-[#F5EEE7] text-[#2A1E16] min-h-screen">
            <Header />

            <main className="max-w-6xl mx-auto px-4 pt-24 sm:pt-28 pb-28">
                <Breadcrumbs />
                {/* HERO SECTION */}
                <div className="grid md:grid-cols-2 gap-10 items-start">
                    {/* Carousel */}
                    <div className="w-full">
                        <ProductImageGallery
                            images={allImages}
                            title={project.title}
                        />
                    </div>

                    {/* Details */}
                    <div>
                        <span className="text-[var(--terracotta)] text-sm font-bold tracking-widest uppercase mb-2 block">
                            {project.type}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif mb-6">{project.title}</h1>

                        <div className="space-y-4 text-[#5d554f] mb-8">
                            <p className="flex items-center gap-2">
                                <span className="w-5 h-5 bg-[#d2a58f] rounded-full flex items-center justify-center text-white text-xs">📍</span>
                                {project.location}
                            </p>
                            {project.productsUsed && project.productsUsed.length > 0 && (
                                <p className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-[#d2a58f] rounded-full flex items-center justify-center text-white text-xs">🧱</span>
                                    Products: <span className="font-medium text-[#2A1E16]">{project.productsUsed.join(', ')}</span>
                                </p>
                            )}
                        </div>

                        <div className="prose prose-stone max-w-none">
                            <p className="text-lg leading-relaxed">{project.description}</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER CTA */}
            <footer className="fixed bottom-0 left-0 w-full bg-white py-4 border-t flex justify-center gap-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <p className="hidden md:block self-center text-sm text-gray-500 mr-4">Inspired by this project?</p>
                <Link href="/#quote" className="bg-[var(--terracotta)] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-200">
                    Get a Quote
                </Link>
                <a
                    href="https://wa.me/918080081951?text=Hi%20UrbanClay,%20I'm%20interested%20in%20your%20projects."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#E7ECEF] text-[#2A1E16] px-6 py-2 rounded-full font-medium hover:bg-[#dbe2e6] transition-colors"
                >
                    WhatsApp
                </a>
            </footer>
        </div>
    );
}
