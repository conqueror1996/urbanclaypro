'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';

// Reusing types roughly
interface Project {
    title: string;
    slug: string;
    imageUrl: string;
    location?: string;
    category?: string; // If available, else we mock
    isFeatured?: boolean;
}

interface ProjectsPageAnimateProps {
    projects: Project[];
    AtlasComponent?: any; // The dynamic map component
}

export default function ProjectsPageAnimate({ projects, AtlasComponent }: ProjectsPageAnimateProps) {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Residential', 'Commercial', 'Institutional', 'Hospitality'];

    // Mock category assignment if missing (for demo purposes)
    const categorizedProjects = projects.map(p => ({
        ...p,
        // Deterministic mock category based on title length or generic if not present
        category: p.category || (p.title.length % 2 === 0 ? 'Residential' : 'Commercial')
    }));

    const filteredProjects = filter === 'All'
        ? categorizedProjects
        : categorizedProjects.filter(p => p.category === filter || p.location?.includes(filter));

    // Featured Project (First one)
    // Featured Project (marked in CMS or fallback to first)
    const featuredProject = categorizedProjects.find(p => p.isFeatured) || categorizedProjects[0];

    return (
        <main className="bg-[#1a1512] text-[#EBE5E0] min-h-screen selection:bg-[var(--terracotta)] selection:text-white pb-20">

            {/* --- HERO / FEATURED PROJECT --- */}
            {featuredProject && (
                <section className="relative h-[85vh] flex items-end justify-start overflow-hidden group cursor-pointer text-left">
                    <Link href={`/projects/${featuredProject.slug}`} className="absolute inset-0 z-20" aria-label={`View ${featuredProject.title}`} />

                    <motion.div
                        style={{ y: heroY, opacity: heroOpacity }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src={featuredProject.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80'}
                            alt={featuredProject.title}
                            fill
                            className="object-cover object-center transition-transform duration-[2s] group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512] via-[#1a1512]/40 to-transparent" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
                    </motion.div>

                    <div className="relative z-10 max-w-7xl w-full mx-auto px-6 pb-20 md:pb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4 mb-6 opacity-80 text-sm">
                                <span className="px-3 py-1 border border-white/20 rounded-full backdrop-blur-md uppercase tracking-widest text-[10px]">Featured Work</span>
                                <span>{featuredProject.location}</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-serif text-[#EBE5E0] leading-[0.9] mb-6 max-w-4xl">
                                {featuredProject.title}
                            </h1>
                            <div className="flex items-center gap-4 group-hover:gap-8 transition-all duration-300">
                                <span className="text-lg text-[var(--terracotta)] border-b border-[var(--terracotta)] pb-0.5">Explore Case Study</span>
                                <svg className="w-6 h-6 text-[var(--terracotta)] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* --- ATLAS SECTION --- */}
            {AtlasComponent && (
                <section className="relative z-10 -mt-12 mb-24 max-w-7xl mx-auto px-6">
                    <div className="bg-[#2A1E16] rounded-[2rem] p-1 shadow-2xl overflow-hidden border border-white/5">
                        <div className="rounded-[1.8rem] overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-500 bg-[#1a1512]">
                            {/* Atlas Container */}
                            <div className="relative">
                                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                                    <h3 className="text-xl font-bold font-serif text-[#EBE5E0]">Project Atlas</h3>
                                    <p className="text-xs text-white/40 uppercase tracking-widest">Explore across India</p>
                                </div>
                                {AtlasComponent}
                            </div>
                        </div>
                    </div>
                </section>
            )}


            {/* --- FILTER & GALLERY --- */}
            <section className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-white/10 pb-8">
                    <div>
                        <h2 className="text-4xl font-serif mb-2">Curated Portfolio</h2>
                        <p className="text-white/40 text-sm">A selection of our finest architectural collaborations.</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${filter === cat
                                    ? 'bg-[var(--terracotta)] text-white shadow-lg shadow-[var(--terracotta)]/20'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GALLERY GRID (Masonry) */}
                <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    <AnimatePresence>
                        {filteredProjects.filter(p => p !== featuredProject).map((project) => (
                            <motion.div
                                layout
                                key={project.slug}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group break-inside-avoid mb-8"
                            >
                                <Link href={`/projects/${project.slug}`} className="block">
                                    <div className="relative overflow-hidden rounded-xl bg-white/5 mb-4 group-hover:shadow-2xl transition-all duration-500">
                                        {project.imageUrl ? (
                                            <Image
                                                src={project.imageUrl}
                                                alt={project.title}
                                                width={800}
                                                height={1000} // Aspect ratio will be natural due to height-auto
                                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="aspect-[3/4] w-full flex items-center justify-center text-white/20 text-xs uppercase tracking-widest bg-[#2A1E16]">No visual</div>
                                        )}

                                        {/* Hover Overlay - "Shop The Look" Style */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <span className="px-6 py-3 bg-white text-[#1a1512] text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-[var(--terracotta)] hover:text-white transition-colors">
                                                    View Project
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-xl font-serif text-[#EBE5E0] group-hover:text-[var(--terracotta)] transition-colors">{project.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-white/50">
                                            <span>{project.location || 'India'}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="uppercase tracking-wider text-[10px] text-white/30 border border-white/10 px-2 py-0.5 rounded-full">{project.category}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

            </section>
        </main>
    );
}
