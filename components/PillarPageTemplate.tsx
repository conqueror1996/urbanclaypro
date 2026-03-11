'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Product, Project, getHomePageData } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';
import PremiumProductCard from '@/components/PremiumProductCard';
import JsonLd from '@/components/JsonLd';
import { ShieldCheck, FileText, Maximize2, Layers, MessageCircle, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

interface PillarPageTemplateProps {
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    specifierToolkitImage?: string;
    keyword: string;
    slug: string;
    products: Product[];
    projects?: Project[];
    faqs: { q: string, a: string }[];
    metrics?: { label: string, val: string, detail: string }[];
}

export default function PillarPageTemplate({
    title,
    subtitle,
    description,
    heroImage,
    specifierToolkitImage,
    keyword,
    slug,
    products,
    projects = [],
    faqs,
    metrics = [
        { label: "Fire Rating", val: "Non-Combustible", detail: "A1 Certified" },
        { label: "Durability", val: "1000 Years+", detail: "Natural Clay" },
        { label: "HVAC Energy", val: "30% Lower", detail: "Thermal Buffer" },
        { label: "Installation", val: "Dry Install", detail: "Self-Drainage" }
    ]
}: PillarPageTemplateProps) {
    const firstProductImage = products?.[0]?.imageUrl || products?.[0]?.variants?.[0]?.imageUrl;
    const [specifierImage, setSpecifierImage] = useState<string>(specifierToolkitImage || firstProductImage || "/images/technical-detail.png");
    const { setBoxOpen } = useSampleBox();

    useEffect(() => {
        const loadData = async () => {
            if (specifierToolkitImage || firstProductImage) return; // Prioritize the specific one passed as prop or product image

            const data = await getHomePageData();
            if (data?.specifierToolkitImageUrl) {
                setSpecifierImage(data.specifierToolkitImageUrl);
            }
        };
        loadData();
    }, [specifierToolkitImage, firstProductImage]);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': title,
        'description': description,
        'url': `https://claytile.in/${slug}`,
        'mainEntity': {
            '@type': 'ItemList',
            'itemListElement': products.slice(0, 10).map((p, i) => ({
                '@type': 'ListItem',
                'position': i + 1,
                'url': `https://claytile.in/products/${p.category?.slug || 'collection'}/${p.slug}`
            }))
        }
    };

    const faqToRender = faqs.slice(0, 3);

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqToRender.map(faq => ({
            '@type': 'Question',
            'name': faq.q,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.a
            }
        }))
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://claytile.in'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': title,
                'item': `https://claytile.in/${slug}`
            }
        ]
    };

    const [showDock, setShowDock] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If specify section is in view, hide the fixed dock
                setShowDock(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        const specifySection = document.getElementById('specify');
        if (specifySection) {
            observer.observe(specifySection);
        }

        return () => {
            if (specifySection) {
                observer.unobserve(specifySection);
            }
        };
    }, []);

    return (
        <main className="bg-[var(--background)] min-h-screen text-[var(--foreground)] selection:bg-[var(--terracotta)] selection:text-white font-sans overflow-x-hidden">
            <JsonLd data={[jsonLd, faqJsonLd, breadcrumbJsonLd]} />
            <Header hideAnnouncement={true} />

            {/* HERO SECTION - Architectural Authority (Compact & Punchy) */}
            <section className="relative w-full min-h-[85vh] flex items-center pt-32 pb-16 px-6 overflow-hidden bg-gradient-to-b from-[var(--sand)] to-[var(--background)]">
                <div className="max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Left: Engineering Content */}
                    <div className="relative z-10 flex flex-col items-start lg:col-span-7 pr-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-flex items-center gap-2 py-2 px-5 border border-[var(--terracotta)]/40 bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-8 backdrop-blur-sm rounded-full">
                                <span className="w-2 h-2 rounded-full bg-[var(--terracotta)] animate-pulse" />
                                {keyword} Engineering
                            </span>

                            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-serif leading-[0.9] text-[var(--foreground)] tracking-tighter mb-8 text-balance">
                                Higher <span className="text-[var(--terracotta)] italic">Performance</span>, <br className="hidden md:block" /> Zero Failures.
                            </h1>

                            <p className="text-lg md:text-2xl text-[var(--foreground)]/70 font-light max-w-2xl mb-12 leading-tight">
                                {description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto mb-16">
                                <motion.button
                                    onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="group relative w-full sm:w-auto px-12 py-5 bg-[var(--ink)] text-white font-bold text-sm tracking-widest uppercase overflow-hidden transition-all shadow-xl hover:bg-[var(--terracotta)]"
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Explore Collection <ChevronDown className="w-4 h-4 animate-bounce" />
                                    </span>
                                </motion.button>

                                <button
                                    onClick={() => document.getElementById('specify')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="btn-link-dotted text-xs font-bold uppercase tracking-widest px-4 cursor-pointer"
                                >
                                    Speak to Consultant
                                </button>
                            </div>

                            {/* Rapid Metrics - Scannable */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-[var(--line)] w-full max-w-3xl">
                                {metrics.map((stat, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-[var(--foreground)]/40 mb-1">{stat.label}</span>
                                        <span className="text-base font-serif font-bold text-[var(--foreground)]">{stat.val}</span>
                                        <span className="text-[10px] uppercase font-bold text-[var(--terracotta)]/70">{stat.detail}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Architectural Image Container */}
                    <div className="relative h-[60vh] lg:h-[80vh] w-full lg:col-span-5 hidden lg:block">
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full w-full rounded-[40px] overflow-hidden shadow-2xl relative border-8 border-white/5"
                        >
                            <img
                                src={heroImage || "/images/engineered-facade-masterpiece.png"}
                                alt={`${keyword} System - UrbanClay India`}
                                className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/40 to-transparent" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
                                <span className="text-[200px] font-black italic select-none">URBANCLAY</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STRATEGY: MOVE PRODUCTS SECTION TO TOP FOLD */}
            <section id="products-section" className="py-24 bg-[var(--background)]">
                <div className="max-w-[1800px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-6">
                        <div className="max-w-2xl">
                            <span className="text-[var(--terracotta)] font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Specifiable Library</span>
                            <h2 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] tracking-tight">Available Systems <br /> & Finishes</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/products" className="btn-link-dotted text-[10px] font-black uppercase tracking-[0.2em]">
                                Full Catalog <span>→</span>
                            </Link>
                        </div>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                            {products.flatMap((product) => {
                                if (product.variants && product.variants.length > 0) {
                                    return product.variants.map((variant) => ({ product, variant }));
                                }
                                return [{ product, variant: { name: 'Standard', imageUrl: product.imageUrl } }];
                            }).slice(0, 8).map(({ product, variant }, i) => (
                                <PremiumProductCard
                                    key={`${product._id}-${i}`}
                                    product={product}
                                    variant={variant}
                                    index={i}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center border border-[var(--line)] rounded-3xl">
                            <h3 className="text-2xl font-serif text-[var(--foreground)]/40 italic">Technical Library Syncing...</h3>
                            <p className="text-[var(--foreground)]/30 mt-2 uppercase tracking-widest text-[10px] font-black">Updating Specification Documentation</p>
                        </div>
                    )}
                </div>
            </section>

            {/* INTEGRATED SYSTEM & DOWNLOADS - The Technical Hub */}
            <section id="downloads" className="py-24 bg-[var(--sand)] border-y border-[var(--line)] px-6">
                <div className="max-w-[1800px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative aspect-square lg:aspect-video bg-[var(--background)] rounded-3xl p-12 flex items-center justify-center shadow-inner overflow-hidden border border-[var(--line)]">
                        <img
                            src={specifierImage}
                            alt="Terracotta Rainscreen System Details"
                            className="w-full h-full object-contain mix-blend-multiply opacity-80"
                        />
                        <div className="absolute inset-0 bg-[var(--terracotta)]/5 pointer-events-none" />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[var(--terracotta)] font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Specifier Toolkit</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-8 leading-tight">Fast-Track Your <br /> Technical Specification</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {[
                                { title: "Technical Data Sheet", format: "PDF", type: "Specs & Tests", icon: FileText },
                                { title: "CAD Blocks Library", format: "DWG", type: "2D Detail Views", icon: Maximize2 },
                                { title: "BIM / Revit Library", format: "RFA", type: "3D Digital Twins", icon: Layers },
                                { title: "Specification BOQ", format: "DOCS", type: "Bidding Reference", icon: FileText }
                            ].map((item, i) => (
                                <button key={i} className="flex items-center gap-4 p-5 bg-[var(--background)] border border-[var(--line)] rounded-2xl hover:border-[var(--terracotta)] transition-all group text-left shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--sand)] flex items-center justify-center text-[var(--terracotta)] group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/40">{item.format} | {item.type}</p>
                                        <h4 className="text-sm font-bold leading-tight group-hover:text-[var(--terracotta)] transition-colors">{item.title}</h4>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/40"><ShieldCheck className="w-4 h-4" /> ASTM Tested</span>
                            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/40"><Layers className="w-4 h-4" /> IGBC Compliant</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROJECT SHOWCASE - Real Field Evidence from Sanity */}
            <section className="py-24 bg-[var(--background)] border-b border-[var(--line)] px-6">
                <div className="max-w-[1800px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-8">
                        <div>
                            <span className="text-[var(--terracotta)] font-black tracking-[0.2em] uppercase text-[10px] mb-4 block">Field Evidence</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] italic tracking-tight">Built Across India.</h2>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <p className="text-[var(--foreground)]/40 max-w-sm text-sm uppercase font-bold tracking-widest">High-rise & large-scale implementations.</p>
                            {projects.length > 0 && (
                                <Link href="/projects" className="text-[10px] font-black uppercase tracking-widest text-[var(--terracotta)] hover:underline underline-offset-4">
                                    View All Projects →
                                </Link>
                            )}
                        </div>
                    </div>

                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {projects.slice(0, 3).map((project, i) => (
                                <Link key={i} href={`/projects/${project.slug}`} className="group cursor-pointer">
                                    <div className="aspect-[16/10] overflow-hidden rounded-[32px] mb-6 border border-[var(--line)] group-hover:border-[var(--terracotta)]/40 transition-all duration-700 bg-[var(--sand)] relative">
                                        {project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-[var(--foreground)]/20 font-serif text-2xl italic">No Image</span>
                                            </div>
                                        )}
                                        {project.isFeatured && (
                                            <span className="absolute top-4 left-4 bg-[var(--terracotta)] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                                Featured
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="flex items-center gap-1 text-white text-[10px] font-black uppercase tracking-widest">View Case Study <ArrowRight className="w-3 h-3" /></span>
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <h4 className="text-[var(--foreground)] group-hover:text-[var(--terracotta)] transition-colors font-serif text-2xl mb-1 leading-tight">{project.title}</h4>
                                        <p className="text-[var(--foreground)]/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                            {project.location}{project.type ? ` | ${project.type}` : ''}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center border border-dashed border-[var(--line)] rounded-3xl">
                            <p className="text-[var(--foreground)]/30 text-sm uppercase tracking-widest font-bold">Projects Coming Soon</p>
                            <p className="text-[var(--foreground)]/20 text-xs mt-2">Tag projects with the "{keyword}" category in Sanity Studio.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* PERSISTENT SALES HERO CTA DOCK */}
            <AnimatePresence>
                {showDock && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl md:w-auto">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="bg-white/80 backdrop-blur-2xl border border-[var(--line)] rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl"
                        >
                            <div className="hidden md:flex px-4 py-2 flex-col leading-none border-r border-[var(--line)]">
                                <span className="text-[9px] font-black uppercase text-[var(--foreground)]/40 mb-1">Pillar Inquiry</span>
                                <span className="text-[11px] font-serif font-bold text-[var(--ink)]">Technical Support Ready</span>
                            </div>
                            <button
                                onClick={() => document.getElementById('specify')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex-1 md:flex-none px-8 py-4 bg-[var(--terracotta)] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[var(--ink)] transition-all shadow-lg text-center"
                            >
                                Request Sample Kit
                            </button>
                            <a
                                href="https://wa.me/918080081951"
                                target="_blank"
                                className="w-12 h-12 md:w-auto md:px-6 bg-[#25D366] text-white rounded-full flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-lg"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.2em]">WhatsApp Expert</span>
                            </a>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* COLUMN: COMPARISON STRIP - Fast Decision Logic */}
            <section className="py-24 bg-[var(--background)] px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center">
                        <span className="text-[var(--terracotta)] font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Specification Guidance</span>
                        <h2 className="text-3xl md:text-5xl font-serif">Why Architects Switch to UrbanClay</h2>
                    </div>

                    <div className="overflow-hidden border border-[var(--line)] rounded-3xl bg-[var(--sand)]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--line)] bg-[var(--ink)]/5">
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Performance Factor</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Standard Brick</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[var(--terracotta)]">UrbanClay {keyword}</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium">
                                {[
                                    { factor: "Installation Speed", std: "Slow (Wet Bind)", uc: "3x Faster (Dry Mechanical)" },
                                    { factor: "Dead Load", std: "Heavy (Structural Strain)", uc: "Lightweight (Facade Only)" },
                                    { factor: "Water Absorption", std: "High (Efflorescence)", uc: "Near Zero (Glazed/Dense)" },
                                    { factor: "Thermal Buffer", std: "None (Heat Sink)", uc: "Advanced (Ventilated)" }
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-[var(--line)] last:border-0 hover:bg-white/50 transition-colors">
                                        <td className="p-6 font-bold">{row.factor}</td>
                                        <td className="p-6 text-[var(--foreground)]/40">{row.std}</td>
                                        <td className="p-6 text-[var(--terracotta)] font-black">{row.uc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQs - Minimal Technical */}
            <section className="py-24 px-6 max-w-4xl mx-auto border-t border-[var(--line)]">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-1">
                        <h2 className="text-3xl font-serif text-[var(--foreground)]">Technical <br /> Verification</h2>
                        <p className="mt-4 text-[var(--foreground)]/40 text-xs font-bold uppercase tracking-widest">Rapid Q&A for Lead Architects.</p>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        {faqToRender.map((faq, i) => (
                            <div key={i} className="group">
                                <h4 className="text-lg font-serif mb-2 text-[var(--ink)] flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)]" />
                                    {faq.q}
                                </h4>
                                <p className="text-[var(--foreground)]/60 text-sm leading-relaxed pl-4 border-l border-[var(--line)]">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LOCAL INQUIRY FORM */}
            <section id="specify" className="py-24 bg-[var(--sand)] px-6 border-t border-[var(--line)]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[var(--terracotta)] text-[10px] font-black tracking-[0.3em] uppercase mb-4 block">Direct Project Inquiry</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6">Specify {keyword}</h2>
                        <p className="text-[var(--foreground)]/60 max-w-2xl mx-auto">Get technical support, custom quotes, or arrange for sample delivery for your current project.</p>
                    </div>

                    {/* Embedded form - we pass a prop to clean up its internal padding/border */}
                    <QuoteForm isEmbedded={true} />
                </div>
            </section>

            <Footer />
        </main>
    );
}

import QuoteForm from '@/components/QuoteForm';
