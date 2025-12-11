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

            {/* 2. ELEGANT METADATA BAR */}
            <div className="bg-[#2A1E16] text-white py-6 md:py-8 sticky top-0 z-40 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-6">
                    <div className="flex gap-12 text-sm uppercase tracking-widest font-medium text-white/60">
                        <div className="hidden md:block">
                            <span className="block text-[10px] opacity-50 mb-1">Project</span>
                            <span className="text-white">{project.title}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] opacity-50 mb-1">Location</span>
                            <span className="text-white">{project.location}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] opacity-50 mb-1">Type</span>
                            <span className="text-white">{project.type}</span>
                        </div>
                    </div>
                    {/* CTA on the bar */}
                    <Link href="/#quote" className="text-xs font-bold text-[var(--terracotta)] hover:text-white transition-colors border-b border-[var(--terracotta)] hover:border-white pb-0.5 uppercase tracking-wider">
                        Request Similar
                    </Link>
                </div>
            </div>

            {/* 3. NARRATIVE FLOW - Editorial Style */}
            <section className="py-24 md:py-32 px-4 md:px-8 max-w-[1600px] mx-auto overflow-hidden">
                {/* Intro Text - Centered & Wide */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center mb-32"
                >
                    <svg className="w-12 h-12 text-[var(--terracotta)] mx-auto mb-8 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                    <p className="font-serif text-3xl md:text-5xl leading-snug text-[#2A1E16]">
                        {project.description?.split('.')[0] || "A masterpiece designed with nature in mind."}.
                    </p>
                </motion.div>

                {/* Narrative Block 1: Image Left, Text Right */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-[4/5] bg-gray-200 rounded-sm overflow-hidden"
                    >
                        {mainStoryImage ? (
                            <Image src={mainStoryImage} alt="Project detail" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#EBE5E0]" />
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2A1E16]">
                            Perspective
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--terracotta)]">The Vision</h3>
                        <div className="text-lg text-[#5d554f] leading-relaxed space-y-6 font-light">
                            {/* Render description paragraphs */}
                            {project.description?.split('\n').filter(p => p.length > 5).slice(0, 2).map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                            {!project.description && <p>This project exemplifies the perfect blend of traditional craftsmanship and modern architectural needs. The use of natural clay textures provides warmth to the structure.</p>}
                        </div>
                    </motion.div>
                </div>

                {/* Narrative Block 2: Full Width Break (if 2nd image exists) */}
                {secondaryStoryImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative w-full aspect-video md:aspect-[2.35/1] overflow-hidden mb-32 group"
                    >
                        <motion.div style={{ y: yParallax }} className="absolute inset-0 h-[120%] w-full">
                            <Image src={secondaryStoryImage} alt="Architectural detail" fill className="object-cover" />
                        </motion.div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </motion.div>
                )}

                {/* Narrative Block 3: Text Left, Specs Right */}
                <div className="grid md:grid-cols-12 gap-12 mb-24">
                    <div className="md:col-span-5 md:col-start-2">
                        <h3 className="font-serif text-3xl mb-6">Materiality & Texture</h3>
                        <p className="text-[#5d554f] leading-relaxed">
                            {project.description?.split('\n').filter(p => p.length > 5).slice(2).join(' ') ||
                                "The selection of materials was crucial to the project's identity. By integrating locally sourced terracotta, the building breathes and ages gracefully with time."}
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. PRODUCTS USED - "SHOP THE LOOK" */}
            {project.productsUsed && project.productsUsed.length > 0 && (
                <section className="bg-white py-24 border-t border-[#f0ebe6]">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2 block">Curated Materials</span>
                            <h2 className="text-3xl font-serif text-[#2A1E16]">Featured Products</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {project.productsUsed.map((p, i) => (
                                <Link
                                    key={i}
                                    href={`/products/${p.category || 'products'}/${p.slug}`}
                                    className="group block"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-[#F5EEE7] mb-6 border border-[#e9e2da]">
                                        {/* Product Image */}
                                        {p.imageUrl ? (
                                            <Image
                                                src={p.imageUrl}
                                                alt={p.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-gray-300">
                                                <span>No Image</span>
                                            </div>
                                        )}
                                        {/* Overlay CTA */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="text-white border border-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                                                View Product
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-serif text-[#2A1E16] mb-1 group-hover:text-[var(--terracotta)] transition-colors text-center">{p.title}</h4>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider text-center">UrbanClay Collection</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. IMMERSIVE GALLERY (The "Mosaic") */}
            {remainingGallery.length > 0 && (
                <section className="py-24 bg-[#1a1a18] text-white">
                    <div className="max-w-[1800px] mx-auto px-4">
                        <div className="flex justify-between items-end mb-16 px-4">
                            <h2 className="text-3xl md:text-5xl font-serif">Visual Archive</h2>
                            <div className="bg-white/10 h-px w-32 md:w-64 mb-4"></div>
                        </div>

                        {/* Mosaic Grid */}
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {remainingGallery.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6 }}
                                    className="break-inside-avoid relative mb-6 group cursor-pointer"
                                >
                                    <div className="relative overflow-hidden">
                                        <Image
                                            src={img}
                                            alt={`Gallery image ${idx}`}
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 6. NEXT PROJECT NAV - Sticky FooterNav */}
            <section className="bg-white py-12 border-t border-gray-100 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Continue Exploring</p>
                <Link href="/projects" className="inline-flex items-center gap-4 text-2xl font-serif text-[#2A1E16] hover:text-[var(--terracotta)] transition-colors group">
                    <span className="group-hover:-translate-x-2 transition-transform">←</span>
                    Back to All Projects
                </Link>
            </section>
        </article>
    );
}
