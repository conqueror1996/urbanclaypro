'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import AccessModal from '@/components/AccessModal';
import SampleModal from '@/components/SampleModal';
import ArchitectsToolkit from '@/components/ArchitectsToolkit';

interface ArchitectPageAnimateProps {
    heroImage?: string | null;
}

export default function ArchitectPageAnimate({ heroImage }: ArchitectPageAnimateProps) {
    const { scrollY } = useScroll();
    
    // Calibrated for a 'sleek and snappy' feel: responsive yet jitter-free
    const smoothScrollY = useSpring(scrollY, { damping: 40, stiffness: 180 });
    
    const heroY = useTransform(smoothScrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(smoothScrollY, [0, 400], [1, 0.4]);

    const defaultHeroImage = "/images/architect-hero-confidence.png";

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

            {/* --- HERO SECTION: Standardized Layout --- */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={heroImage || defaultHeroImage}
                        alt="Architectural Confidence - Delivered Project"
                        fill
                        className="object-cover object-center brightness-[0.4]"
                        priority
                    />
                </motion.div>

                <div className="max-w-7xl mx-auto px-6 pt-[140px] pb-16 md:pt-[192px] lg:pt-[246px] lg:pb-32 relative z-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-[60]"
                        >
                            <div className="flex justify-center mb-8 opacity-80 text-white">
                                <Breadcrumbs items={[{ name: 'Architects', href: '/architects' }]} />
                            </div>
                            
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <span className="h-[1px] w-6 bg-[var(--terracotta)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">UrbanClay Studio</span>
                                <span className="h-[1px] w-6 bg-[var(--terracotta)]" />
                            </div>

                            <h1 className="text-5xl md:text-8xl font-serif !text-white tracking-tighter leading-[1] mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                                Designed for <br />
                                <span className="italic font-light !text-white">Visionaries</span>
                            </h1>

                            <p className="text-lg md:text-[22px] font-light !text-white leading-snug max-w-2xl mx-auto mb-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                                A curated digital atelier for architects. Access high-fidelity assets, technical specifications, and bespoke manufacturing services.
                            </p>

                            <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="bg-[var(--terracotta)] text-white h-[60px] px-10 rounded-full font-semibold text-base tracking-[0.3px] shadow-lg hover:shadow-xl hover:bg-[#a85638] transition-all active:scale-95 flex items-center justify-center w-full sm:w-auto"
                                >
                                    Access Library
                                </button>
                                <button
                                    onClick={() => setSampleModalOpen(true)}
                                    className="bg-transparent text-[#EBE5E0] h-[60px] px-10 rounded-full border border-white/20 font-semibold text-base hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center font-serif italic w-full sm:w-auto backdrop-blur-sm"
                                >
                                    Request Samples
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* --- MATERIAL LIBRARY SECTION --- */}
            <section className="py-24 md:py-32 bg-[var(--background)] relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 md:mb-24"
                    >
                        <span className="text-[var(--terracotta)] font-semibold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4 block">Professional Resources</span>
                        <h2 className="text-4xl md:text-6xl font-serif text-[var(--ink)] mb-6">Material Library</h2>
                        <p className="text-[var(--foreground)]/70 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Everything you need to specify UrbanClay products with confidence and creative freedom.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {resources.map((resource, idx) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.15 }}
                                className="group flex flex-col h-full bg-white rounded-[2rem] border border-[var(--line)] shadow-[0_4px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-700 overflow-hidden"
                            >
                                {/* Resource Visual */}
                                <div className="aspect-[4/3] bg-[var(--sand)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--ink)]/10 to-transparent" />
                                    {/* Abstract Visual representation of the resource type */}
                                    <div className="absolute inset-0 flex items-center justify-center p-12">
                                        <div className="w-full h-full border border-[var(--ink)]/5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                            <div className="text-[var(--terracotta)]/40 group-hover:text-[var(--terracotta)] transition-colors duration-500">
                                                {React.cloneElement(resource.icon as React.ReactElement<any>, { className: "w-20 h-20 md:w-24 md:h-24 stroke-[1px]" })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Numbering */}
                                    <div className="absolute top-6 left-6 text-xs font-bold text-[var(--ink)]/20 font-serif italic">
                                        0{idx + 1}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 md:p-10 flex flex-col flex-grow">
                                    <h3 className="text-2xl md:text-3xl font-serif text-[var(--ink)] mb-4">{resource.title}</h3>
                                    <p className="text-[var(--foreground)]/60 text-sm leading-relaxed mb-8 flex-grow">
                                        {resource.description}
                                    </p>

                                    <div className="space-y-3 mb-10">
                                        {resource.files.slice(0, 3).map((file, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs font-medium text-[var(--ink)]/70">
                                                <span className="w-1 h-1 rounded-full bg-[var(--terracotta)]" />
                                                {file}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setModalOpen(true)}
                                        className="w-full py-4 bg-[var(--ink)] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--terracotta)] transition-colors duration-500 shadow-sm"
                                    >
                                        Access Folder
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TOOLKIT: INTERACTIVE VISUALIZER --- */}
            <ArchitectsToolkit />


            {/* --- STUDIO SERVICES / WHY SPECIFY --- */}
            <section className="py-16 md:py-32 bg-[#e2dad3] text-[#1a1512] rounded-t-[3rem] md:rounded-t-[5rem] relative overflow-hidden">
                {/* Grain Overlay */}
                <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply pointer-events-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <div>
                            <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-[10px] mb-4 block">Engineered for Excellence</span>
                            <h2 className="text-3xl md:text-6xl font-serif mb-4 md:mb-8 leading-tight">
                                Performance <br /> & Precision
                            </h2>
                            <p className="text-lg text-[#5d554f] mb-8 md:mb-12 leading-relaxed">
                                We don’t just manufacture clay bricks — we craft solutions built for performance, precision, and long-term durability.
                            </p>

                            <div className="space-y-4 md:space-y-6">
                                <Feature
                                    title="Custom-Made to Fit Your Design"
                                    desc="Every project is different. We create custom brick sizes, shapes, and patterns based on your exact drawings, so you don’t have to compromise your design vision."
                                />
                                <Feature
                                    title="Tested for Strength & Reliability"
                                    desc="Each batch goes through quality checks for strength, water absorption, and finish — ensuring you get consistent results on-site without surprises."
                                />
                                <Feature
                                    title="Built with Natural Materials"
                                    desc="Our products are made from 100% natural clay, without artificial colors. This gives you authentic textures, long-lasting color, and better thermal performance for buildings."
                                />
                            </div>
                        </div>


                        <div className="relative pl-0 md:pl-10 pt-8 md:pt-10">
                            {/* Main Detail Image with Parallax-like feel */}
                            <div className="aspect-square md:aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl relative group">
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
                                className="absolute -bottom-10 -left-4 md:-left-12 bg-[var(--background)] text-[var(--foreground)] p-8 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] max-w-xs hidden md:block border border-[var(--line)]"
                            >
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-serif text-[var(--terracotta)]">500</span>
                                    <span className="text-xl font-serif text-[var(--terracotta)]">+</span>
                                </div>
                                <div className="w-full h-px bg-[var(--line)] mb-4" />
                                <div className="text-sm font-bold uppercase tracking-widest opacity-90 mb-2">Partnered Firms</div>
                                <p className="text-xs text-[var(--foreground)]/70 leading-relaxed font-light">
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
