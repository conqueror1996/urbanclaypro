import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
    title: string;
    slug: string;
    imageUrl: string;
    location?: string;
}

interface ProductShowcaseProps {
    projects: Project[];
}

export default function ProductShowcase({ projects }: ProductShowcaseProps) {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="mt-16 md:mt-24">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2A1E16]">
                        See it in Action
                    </h2>
                    <p className="text-[#5d554f] mt-2">
                        Real-world applications and design inspiration.
                    </p>
                </div>
                {/* Optional: View All Projects Link */}
                {/* <Link href="/projects" className="text-[var(--terracotta)] font-medium hover:underline">
                    View All Projects →
                </Link> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--line)] hover:shadow-md transition-all"
                    >
                        <div className="aspect-[4/3] relative overflow-hidden bg-[#e7dbd1]">
                            {project.imageUrl ? (
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#a89f99]">
                                    No Image
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <p className="text-xs font-medium uppercase tracking-wider opacity-90 mb-1">
                                    {project.location || 'Project'}
                                </p>
                                <h3 className="text-lg font-bold leading-tight">
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
