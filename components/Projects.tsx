'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Project } from '@/lib/products';

interface ProjectsProps {
    projects?: Project[];
    showLink?: boolean;
    layoutMode?: 'default' | 'mixed';
}

const ParallaxProjectCard = ({ project, index, isMixed, isLarge }: { project: Project, index: number, isMixed: boolean, isLarge: boolean }) => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <Link
            href={`/projects/${project.slug || '#'}`}
            className={`
                ${isMixed
                    ? `block h-full ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`
                    : 'block min-w-[85vw] sm:min-w-0 snap-center h-full'
                }
            `}
        >
            <motion.article
                ref={ref}
                className="group cursor-pointer h-full flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
                <div className="aspect-[4/3] bg-[#e7dbd1] rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-xl transition-all duration-500 transform-gpu">
                    {project.imageUrl ? (
                        <motion.div style={{ y, scale: 1.1 }} className="absolute inset-0 w-full h-full">
                            <Image
                                src={project.imageUrl}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-700" // Removed hover scale here to avoid conflict with parallax
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#a89f99] bg-[#f5f0eb]">
                            <span className="font-serif italic">Project Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                    {/* Floating Tag */}
                    <div className="absolute top-4 left-4">
                        <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 bg-white/90 backdrop-blur-sm text-[#2A1E16] rounded-full shadow-sm">
                            {project.type}
                        </span>
                    </div>
                </div>

                <div className="mt-6 px-2 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-serif text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors duration-300">
                            {project.title}
                        </h3>
                    </div>
                    <p className="text-sm font-medium text-[#7a6f66] uppercase tracking-wide mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {project.location}
                    </p>
                    <p className="text-[#5d554f] line-clamp-2 leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                        {project.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-[#e9e2da] flex items-center text-sm font-medium text-[var(--terracotta)] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        View Project <span className="ml-2">→</span>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
};

export default function Projects({ projects = [], showLink = true, layoutMode = 'default' }: ProjectsProps) {
    // Mixed Layout: 1 Large (2 cols), 2 Small (1 col each)
    // Pattern repeats every 3 items.
    const isMixed = layoutMode === 'mixed';

    return (
        <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            {/* HEADER */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-3 block">Execution Proof</span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#2A1E16]">Commercial & Premium <br className="hidden md:block" /> Residential Archive</h2>
            </motion.div>

            <div className={`
                mt-12 
                ${isMixed
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6' // Mixed: Stacked on mobile, 2-col on desktop
                    : 'flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 scrollbar-hide' // Default: Carousel on mobile
                }
            `}>
                {projects.map((p, index) => {
                    // Calculate span for mixed layout
                    const isLarge = isMixed && (index % 3 === 0);
                    return <ParallaxProjectCard key={index} project={p} index={index} isMixed={isMixed} isLarge={isLarge} />;
                })}
            </div>

            {showLink && (
                <div className="text-center mt-16">
                    <Link href="/projects" className="btn-link-dotted text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                        View All Projects
                        <span>→</span>
                    </Link>
                </div>
            )}
        </section>
    );
}
