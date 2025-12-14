'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import AccessModal from '@/components/AccessModal';
import SampleModal from '@/components/SampleModal';

export default function ArchitectPageAnimate() {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

    const [modalOpen, setModalOpen] = React.useState(false);
    const [sampleModalOpen, setSampleModalOpen] = React.useState(false);

    // Resources Data
    const resources = [
        {
            id: 'catalogues',
            title: 'Digital Catalogues',
            description: 'Comprehensive guides featuring our full range of textures, colors, and technical specifications.',
            files: ['2025 General Catalogue', 'Facade Systems Guide', 'Brick Tile Collection'],
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            id: 'technical',
            title: 'Technical Documentation',
            description: 'Detailed performance metrics, installation guidelines, and third-party test reports.',
            files: ['Installation Manual (PDF)', 'Test Certificates (ASTM)', 'LEED Compliance Data'],
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            id: 'bim',
            title: 'BIM & 3D Assets',
            description: 'High-fidelity Revit families and 4K seamless textures for visualization.',
            files: ['Revit Families (.rfa)', 'SketchUp Models (.skp)', '4K Textures (.jpg)'],
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        }
    ];

    return (
        <main className="relative z-10">
            <AccessModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            <SampleModal isOpen={sampleModalOpen} onClose={() => setSampleModalOpen(false)} />

            {/* --- HERO SECTION --- */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/images/architect-hero-confidence.png"
                        alt="Architectural Confidence - Delivered Project"
                        fill
                        className="object-cover object-center brightness-[0.4]"
                        priority
                    />
                    <div className="absolute inset-0 bg-[#1a1512]/60 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512] via-transparent to-transparent" />
                </motion.div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex justify-center mb-8 opacity-60">
                            <Breadcrumbs />
                        </div>
                        <span className="text-[var(--terracotta)] font-medium tracking-[0.4em] uppercase text-xs mb-6 block">
                            UrbanClay Studio
                        </span>
                        <h1 className="text-5xl md:text-8xl font-serif text-[#EBE5E0] leading-[1.1] mb-8">
                            Designed for <br />
                            <span className="italic font-light text-white/50">Visionaries</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#EBE5E0]/60 max-w-2xl mx-auto leading-relaxed font-light mb-12">
                            A curated digital atelier for architects. Access high-fidelity assets, technical specifications, and bespoke manufacturing services.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setModalOpen(true)}
                                className="px-8 py-4 bg-[var(--terracotta)] text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#a85638] transition-colors min-w-[200px]"
                            >
                                Access Library
                            </button>
                            <button
                                onClick={() => setSampleModalOpen(true)}
                                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-colors min-w-[200px] backdrop-blur-sm"
                            >
                                Request Samples
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>


            {/* --- MATERIAL LIBRARY SECTION --- */}
            <section className="py-32 bg-[#1a1512] relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-20 border-b border-white/10 pb-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif text-[#EBE5E0] mb-4">Material Library</h2>
                            <p className="text-white/40 max-w-md">Everything you need to specify UrbanClay products with confidence.</p>
                        </div>
                        <div className="hidden md:block text-right">
                            <div className="text-[var(--terracotta)] text-5xl font-serif">03</div>
                            <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Resource Categories</div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {resources.map((resource, idx) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group relative bg-white/5 border border-white/5 hover:border-[var(--terracotta)]/50 rounded-2xl p-8 md:p-12 transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 group-hover:translate-x-0">
                                    <div className="w-12 h-12 bg-[var(--terracotta)] rounded-full flex items-center justify-center text-white">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
                                    <div className="md:col-span-1 text-white/20 group-hover:text-[var(--terracotta)] transition-colors">
                                        {resource.icon}
                                    </div>
                                    <div className="md:col-span-5">
                                        <h3 className="text-2xl font-serif text-[#EBE5E0] mb-2 group-hover:text-white transition-colors">{resource.title}</h3>
                                        <p className="text-white/40 text-sm leading-relaxed">{resource.description}</p>
                                    </div>
                                    <div className="md:col-span-6 flex flex-wrap gap-3 justify-start md:justify-end">
                                        {resource.files.map((file, i) => (
                                            <span key={i} className="px-4 py-2 bg-black/20 rounded-lg text-xs font-medium text-white/60 border border-white/5 group-hover:border-white/10 transition-colors">
                                                {file}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="absolute inset-0 w-full h-full z-20 cursor-pointer"
                                    aria-label={`Access ${resource.title}`}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* --- STUDIO SERVICES / WHY SPECIFY --- */}
            <section className="py-32 bg-[#e2dad3] text-[#1a1512] rounded-t-[3rem] md:rounded-t-[5rem] relative overflow-hidden">
                {/* Grain Overlay */}
                <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply pointer-events-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-6 block">Engineered for Excellence</span>
                            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
                                Bespoke <br /> Manufacturing
                            </h2>
                            <p className="text-lg text-[#5d554f] mb-12 leading-relaxed">
                                We don't just sell standard bricks. Our R&D facility in Mumbai specializes in custom mold development, glaze matching, and structural clay solutions for complex facades.
                            </p>

                            <div className="space-y-8">
                                <Feature
                                    title="Custom Forms"
                                    desc="From parametric jaalis to non-standard brick dimensions, we build molds to your exact CAD specifications."
                                />
                                <Feature
                                    title="Performance Tested"
                                    desc="Every batch comes with comprehensive lab reports for water absorption, efflorescence, and compressive strength."
                                />
                                <Feature
                                    title="Sustainable Core"
                                    desc="100% natural clay with 0% artificial pigments. High thermal mass products ideal for passive cooling strategies."
                                />
                            </div>
                        </div>


                        <div className="relative pl-10 pt-10">
                            {/* Main Detail Image with Parallax-like feel */}
                            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl relative group">
                                <Image
                                    src="/images/bespoke-precision.png"
                                    alt="Precision Engineering - Caliper on Clay"
                                    fill
                                    className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                                />

                                {/* Overlay Gradient - Subtle cinematic feel */}
                                <div className="absolute inset-0 bg-black/40" />

                                {/* Interactive Loupe/Focus Ring Effect */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/30 rounded-full backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none flex items-center justify-center">
                                    <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                                </div>

                                <div className="absolute top-10 left-8 right-8 text-white">
                                    <div className="w-12 h-[1px] bg-[var(--terracotta)] mb-6" />
                                    <p className="font-serif text-3xl italic leading-tight mb-4 text-[#f0ebe6]">"God is in the details"</p>
                                    <div className="flex items-center gap-3 opacity-80">
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Ludwig Mies van der Rohe</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-32 h-32 border border-[#2A1E16]/10 rounded-full -z-10 animate-[spin_10s_linear_infinite]" />
                            <div className="absolute top-20 -left-6 text-[var(--terracotta)]/20 font-serif text-9xl leading-none -z-10 select-none">"</div>

                            {/* Floating Stats Card - Refined */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="absolute -bottom-10 -left-4 md:-left-12 bg-[#2A1E16] text-[#EBE5E0] p-8 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] max-w-xs hidden md:block border border-white/5"
                            >
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-serif text-[var(--terracotta)]">500</span>
                                    <span className="text-xl font-serif text-[var(--terracotta)]">+</span>
                                </div>
                                <div className="w-full h-px bg-white/10 mb-4" />
                                <div className="text-sm font-bold uppercase tracking-widest opacity-90 mb-2">Partnered Firms</div>
                                <p className="text-xs text-white/50 leading-relaxed font-light">
                                    Empowering India's leading architects with precision-crafted terracotta solutions since 2006.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function Feature({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="w-12 h-12 rounded-full border border-[#1a1512]/10 flex items-center justify-center text-[var(--terracotta)] shrink-0 group-hover:bg-[var(--terracotta)] group-hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
                <h4 className="font-bold text-[#1a1512] mb-1">{title}</h4>
                <p className="text-sm text-[#5d554f] leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
