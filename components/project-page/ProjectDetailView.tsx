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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512]/90 via-[#1a1512]/20 to-transparent mix-blend-multiply opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                </motion.div>

                {/* Hero Title - Bottom Left Alignment for Drama */}
                <motion.div
                    style={{ y: heroTextY, opacity: opacityHero }}
                    className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:p-24 z-10"
                >
                    <div className="max-w-[1800px] mx-auto border-l-2 border-[var(--terracotta)] pl-6 md:pl-10 relative">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-block text-[var(--terracotta)] font-extrabold tracking-[0.3em] uppercase text-xs md:text-sm mb-6 bg-black/20 px-3 py-1 rounded-sm backdrop-blur-sm"
                        >
                            {project.type}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-5xl md:text-7xl lg:text-[10rem] font-serif !text-[#EBE5E0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-medium leading-[0.85] tracking-tight mb-8 max-w-6xl"
                        >
                            {project.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex items-center gap-6 text-white drop-shadow-md text-sm md:text-base font-medium tracking-wide"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {project.location}
                            </span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Animated Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-4 z-20"
                >
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">Scroll to Explore</span>
                    <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
                        <motion.div
                            className="w-full h-full bg-[var(--terracotta)] origin-top"
                            animate={{ scaleY: [0, 1, 0], translateY: ['-100%', '0%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* 2. THE FUNDAMENTALS - High-End Spec Sheet Style */}
            <section className="relative z-10 bg-[#FAF8F6] border-t border-[#2A1E16]/10">
                <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 border-b border-[#2A1E16]/10">

                    {/* Sticky Sidebar / Project Meta */}
                    <div className="md:col-span-3 lg:col-span-3 border-r border-[#2A1E16]/10 p-8 md:p-12 lg:p-16 md:sticky md:top-24 md:h-[calc(100vh-6rem)] flex flex-col justify-between bg-[#EBE5E0]/30 backdrop-blur-3xl">
                        <div className="space-y-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-3 relative"
                            >
                                <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--terracotta)]">
                                    <span className="w-4 h-[1px] bg-[var(--terracotta)]"></span> Typology
                                </span>
                                <span className="block text-xl md:text-3xl font-serif text-[#2A1E16]">{project.type || "Residential"}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="space-y-3 relative"
                            >
                                <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--terracotta)]">
                                    <span className="w-4 h-[1px] bg-[var(--terracotta)]"></span> Location
                                </span>
                                <span className="block text-xl md:text-3xl font-serif text-[#2A1E16]">{project.location || "New Delhi, India"}</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="space-y-4 relative"
                            >
                                <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--terracotta)]">
                                    <span className="w-4 h-[1px] bg-[var(--terracotta)]"></span> Materials
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {(project.productsUsed?.slice(0, 3) || [{ title: 'Exposed Brick' }, { title: 'Terracotta' }]).map((m: any, i: number) => (
                                        <Link href={m.slug ? `/products/${m.category || 'collection'}/${m.slug}` : '#'} key={i} className="px-4 py-2 border border-[#2A1E16]/15 hover:border-[var(--terracotta)] hover:bg-[var(--terracotta)] hover:text-white transition-colors duration-300 rounded-full text-xs font-semibold uppercase tracking-wider text-[#2A1E16]/70">
                                            {m.title}
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div className="pt-12 hidden md:block">
                            <motion.svg
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 text-[var(--terracotta)] opacity-20"
                                viewBox="0 0 100 100"
                            >
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
                                <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="1" />
                            </motion.svg>
                        </div>
                    </div>

                    {/* Main Narrative & Visuals */}
                    <div className="md:col-span-9 lg:col-span-9">

                        {/* A. The Statement */}
                        <div className="p-8 md:p-16 lg:p-24 border-b border-[#2A1E16]/10 relative overflow-hidden bg-white">
                            {/* Accent Background Quote */}
                            <div className="absolute -top-10 -left-6 md:-top-20 md:left-6 text-[15rem] md:text-[25rem] font-serif leading-none text-[#2A1E16]/[0.02] select-none pointer-events-none">
                                "
                            </div>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative z-10 text-3xl md:text-5xl lg:text-7xl font-serif leading-[1.15] text-[#2A1E16] text-balance"
                            >
                                {project.description?.split('.')[0] || "A masterful integration of form, function, and earthy materiality."}.
                            </motion.h2>
                        </div>

                        {/* B. The Editorial Flow */}
                        <div className="bg-[#FAF8F6]">
                            {/* Detailed Text Block */}
                            <div className="grid lg:grid-cols-12 gap-12 p-8 md:p-16 lg:p-24 relative">
                                <div className="lg:col-span-5 font-serif text-2xl md:text-3xl text-[var(--terracotta)] leading-snug lg:sticky lg:top-32 self-start">
                                    "Architecture should speak of its time and place, but yearn for timelessness."
                                </div>
                                <div className="lg:col-span-7 text-[#2A1E16]/80 text-lg md:text-xl leading-[1.8] space-y-8 font-light max-w-3xl">
                                    {project.description?.split('\n').filter(p => p.length > 5).map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    )) || (
                                            <p>This project exemplifies the UrbanClay philosophy: harmonizing raw, natural materials with contemporary design lines. Every brick tells a story of craftsmanship, sustainability, and aesthetic precision.</p>
                                        )}
                                </div>
                            </div>

                            {/* Dynamic Gallery Grid */}
                            {project.gallery && project.gallery.length > 0 && (
                                <div className="px-4 md:px-8 pb-16 md:pb-24">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                        {project.gallery.map((img, idx) => {
                                            // Rhythmic Layout Logic
                                            const isFullWidth = idx % 3 === 0;

                                            return (
                                                <div key={idx} className={`${isFullWidth ? 'md:col-span-2' : ''} group relative overflow-hidden rounded-2xl`}>
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.8 }}
                                                        className={`relative ${isFullWidth ? 'aspect-[16/9] lg:aspect-[21/9]' : 'aspect-square md:aspect-[4/5]'} w-full bg-[#EBE5E0] overflow-hidden`}
                                                    >
                                                        <Image
                                                            src={img}
                                                            alt={`${project.title} - Architectural Detail ${idx + 1} - ${project.location}`}
                                                            fill
                                                            className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
                                                        />
                                                    </motion.div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* C. Material Showcase */}
                        {project.productsUsed && project.productsUsed.length > 0 && (
                            <div className="bg-[#1a1512] text-[#FAF8F6] p-8 md:p-16 lg:p-24 relative overflow-hidden">
                                {/* Subtle Texture */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-white/10 pb-8 gap-6 relative z-10">
                                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-none">Studio <br className="hidden md:block" /><span className="text-[var(--terracotta)] italic font-light">Palette</span></h2>
                                    <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-50 flex items-center gap-3">
                                        <span className="w-8 h-[1px] bg-white/50"></span>
                                        Curated Materials
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 relative z-10">
                                    {project.productsUsed.map((p, i) => (
                                        <Link href={p.slug ? `/products/${p.category || 'collection'}/${p.slug}` : '#'} key={i} className="group cursor-pointer block">
                                            <div className="aspect-[4/5] relative bg-white/5 overflow-hidden mb-6 rounded-xl border border-white/5 group-hover:border-[var(--terracotta)]/50 transition-colors duration-500">
                                                {p.imageUrl ? (
                                                    <Image
                                                        src={p.imageUrl}
                                                        alt={p.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/20 font-serif italic text-sm">No Image Available</div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512] via-transparent to-transparent opacity-60 pointer-events-none" />

                                                {/* Hover Action */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-[2px]">
                                                    <span className="bg-white text-[#1a1512] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                        Inspect Details
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="px-1">
                                                <div className="text-[10px] text-[var(--terracotta)] font-bold uppercase tracking-[0.2em] mb-2">{p.category?.replace('-', ' ') || 'Collection'}</div>
                                                <h4 className="text-lg font-serif text-white/90 group-hover:text-white transition-colors">{p.title}</h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* D. Footer Navigation */}
                        <div className="p-12 md:p-24 lg:p-32 bg-[var(--terracotta)] flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group">
                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 pointer-events-none">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="w-24 h-8 border border-white/30 transform -rotate-45 relative translate-x-[-50%] translate-y-[-50%]" />
                                ))}
                            </div>

                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70 relative z-10 flex items-center gap-3">
                                <span className="w-4 h-4 border border-white/40 rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-white/70 rounded-full" /></span>
                                Next Chapter
                            </span>
                            <Link href="/projects" className="relative z-10 block group-hover:scale-105 transition-transform duration-700">
                                <h3 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white italic tracking-tight">
                                    Browse Portfolio
                                </h3>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        </article>
    );
}
