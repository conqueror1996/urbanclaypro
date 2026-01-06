'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Project } from '@/lib/products';

interface ProjectDetailViewProps {
    project: Project;
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Parallax Effects
    const heroImageScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.2]);
    const heroTextY = useTransform(scrollYProgress, [0, 0.4], ["0%", "50%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    // Content Images (Parallax Shift)
    const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

    // Gallery images
    const galleryImages = project.gallery || [];

    // Split gallery for narrative flow if possible, else use all
    const mainStoryImage = galleryImages.length > 0 ? galleryImages[0] : null;
    const secondaryStoryImage = galleryImages.length > 1 ? galleryImages[1] : null;
    const remainingGallery = galleryImages.slice(2);

    return (
        <article ref={containerRef} className="bg-[#FAF8F6] min-h-screen text-[#2A1E16]">
            {/* 1. CINEMATIC HERO */}
            <section className="relative h-screen w-full overflow-hidden">
                <motion.div
                    style={{ scale: heroImageScale }}
                    className="absolute inset-0 w-full h-full"
                >
                    {project.imageUrl ? (
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                            quality={100}
                        />
                    ) : (
                        <div className="w-full h-full bg-[#d6cbb8]" />
                    )}
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                </motion.div>

                {/* Hero Title - Bottom Left Alignment for Drama */}
                <motion.div
                    style={{ y: heroTextY, opacity: opacityHero }}
                    className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-10"
                >
                    <div className="max-w-7xl mx-auto border-l-2 border-[var(--terracotta)] pl-6 md:pl-10">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-block text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4"
                        >
                            {project.type}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-5xl md:text-7xl lg:text-9xl font-serif text-white font-medium leading-[0.9] tracking-tight mb-6"
                        >
                            {project.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex items-center gap-6 text-white/80"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {project.location}
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* 2. THE FUNDAMENTALS - High-End Spec Sheet Style */}
            <section className="relative z-10 bg-[#FAF8F6]">
                <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 border-b border-[#2A1E16]/10">

                    {/* Sticky Sidebar / Project Meta */}
                    <div className="md:col-span-3 lg:col-span-3 border-r border-[#2A1E16]/10 p-8 md:p-12 md:sticky md:top-24 md:h-[calc(100vh-6rem)] flex flex-col justify-between">
                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-2"
                            >
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A1E16]/40">Typology</span>
                                <span className="block text-xl md:text-2xl font-serif text-[#2A1E16]">{project.type || "Residential"}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="space-y-2"
                            >
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A1E16]/40">Location</span>
                                <span className="block text-xl md:text-2xl font-serif text-[#2A1E16]">{project.location || "New Delhi, India"}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="space-y-2"
                            >
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A1E16]/40">Materials</span>
                                <div className="flex flex-wrap gap-2">
                                    {(project.productsUsed?.slice(0, 3) || [{ title: 'Exposed Brick' }, { title: 'Terracotta' }]).map((m: any, i: number) => (
                                        <span key={i} className="px-3 py-1 border border-[#2A1E16]/10 rounded-full text-xs text-[#2A1E16]/60">
                                            {m.title}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div className="pt-12 hidden md:block">
                            <svg className="w-12 h-12 text-[var(--terracotta)] opacity-20" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    {/* Main Narrative & Visuals */}
                    <div className="md:col-span-9 lg:col-span-9">

                        {/* A. The Statement */}
                        <div className="p-8 md:p-20 lg:p-32 border-b border-[#2A1E16]/10">
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.15] text-[#2A1E16]"
                            >
                                {project.description?.split('.')[0] || "A masterful integration of form, function, and earthy materiality."}.
                            </motion.p>
                        </div>

                        {/* B. The Editorial Flow */}
                        <div className="bg-white">
                            {/* Detailed Text Block */}
                            <div className="grid md:grid-cols-2 gap-12 p-8 md:p-20">
                                <div className="font-serif text-2xl text-[var(--terracotta)]">
                                    "Architecture should speak of its time and place, but yearn for timelessness."
                                </div>
                                <div className="text-[#5d554f] text-lg leading-relaxed space-y-6 font-light">
                                    {project.description?.split('\n').filter(p => p.length > 5).map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    )) || (
                                            <p>This project exemplifies the UrbanClay philosophy: harmonizing raw, natural materials with contemporary design lines. Every brick tells a story of craftsmanship, sustainability, and aesthetic precision.</p>
                                        )}
                                </div>
                            </div>

                            {/* Dynamic Gallery Grid */}
                            {project.gallery && project.gallery.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {project.gallery.map((img, idx) => {
                                        // Rhythmic Layout Logic
                                        const isFullWidth = idx % 3 === 0;

                                        return (
                                            <div key={idx} className={`${isFullWidth ? 'md:col-span-2' : ''} group relative overflow-hidden`}>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.8 }}
                                                    className={`relative ${isFullWidth ? 'aspect-[2.35/1]' : 'aspect-[4/5]'} w-full bg-gray-100`}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${project.title} - Architectural Detail ${idx + 1} - ${project.location}`}
                                                        fill
                                                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* C. Material Showcase */}
                        {project.productsUsed && project.productsUsed.length > 0 && (
                            <div className="bg-[#1a1512] text-[#FAF8F6] p-8 md:p-20">
                                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                                    <h2 className="text-4xl md:text-6xl font-serif">Palette</h2>
                                    <span className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2">Curated Materials</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                                    {project.productsUsed.map((p, i) => (
                                        <Link href={`/products/${p.category || 'products'}/${p.slug}`} key={i} className="group cursor-pointer">
                                            <div className="aspect-square relative bg-white/5 overflow-hidden mb-4 border border-white/5 group-hover:border-white/20 transition-colors">
                                                {p.imageUrl && (
                                                    <Image
                                                        src={p.imageUrl}
                                                        alt={p.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                                                    <span className="border border-white/80 px-4 py-2 text-[10px] uppercase tracking-widest text-white">View</span>
                                                </div>
                                            </div>
                                            <h4 className="text-sm font-serif text-white/90 group-hover:text-[var(--terracotta)] transition-colors">{p.title}</h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* D. Footer Navigation */}
                        <div className="p-12 md:p-24 bg-[#EBE5E0] flex flex-col items-center justify-center text-center space-y-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2A1E16]/40">Next Chapter</span>
                            <Link href="/projects" className="group">
                                <h3 className="text-4xl md:text-6xl font-serif text-[#2A1E16] group-hover:italic transition-all">
                                    Browse All Projects
                                </h3>
                                <div className="h-px w-0 group-hover:w-full bg-[#2A1E16] transition-all duration-500 mt-4 mx-auto opacity-20" />
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        </article>
    );
}
