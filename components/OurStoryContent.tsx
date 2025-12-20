'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PortableText } from '@portabletext/react';
import { AboutPageData } from '@/lib/company';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

interface OurStoryContentProps {
    data: AboutPageData | null;
}

export default function OurStoryContent({ data }: OurStoryContentProps) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
    const imageParallax = useTransform(scrollYProgress, [0.1, 0.4], ["5%", "-5%"]);

    // Defaults
    const estYear = data?.hero.estYear || 'Est. 2006';
    const heroHeading = data?.hero.heading || 'A Legacy of Transformation';
    const heroSubheading = data?.hero.subheading || 'From a modest initiative in Mumbai to a nationwide presence, we are redefining how the world builds with earth.';

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f5f0eb] text-[#2A1E16]">

            <Header />

            {/* --- FILM GRAIN OVERLAY (Consistent with Kiln) --- */}
            <div
                className="fixed inset-0 z-50 pointer-events-none opacity-[0.08] mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <div className="pt-20">
                {/* HERO SECTION */}
                <section className="relative py-32 md:py-48 overflow-hidden w-full">
                    {/* Background Gradient Blob */}
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-[radial-gradient(circle_at_center,#e7dbd1_0%,transparent_60%)] opacity-60 pointer-events-none"
                        style={{ y: heroY }}
                    />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="text-[var(--terracotta)] font-medium tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block">
                                {estYear}
                            </span>
                            <h1 className="text-5xl md:text-8xl font-serif font-medium text-[#2A1E16] mb-8 leading-[1.1]">
                                {heroHeading}
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-lg md:text-2xl text-[#5d554f] max-w-2xl mx-auto leading-relaxed font-light"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {heroSubheading}
                        </motion.p>
                    </div>
                </section>

                {/* MAIN CONTENT */}
                <section className="py-24 bg-white border-y border-[#e5e5e5] relative z-10 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-16 items-center">

                            {/* Parallax Image */}
                            <motion.div
                                className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-[#d6cec8]"
                                    style={{ scale: 1.1, y: imageParallax }}
                                >
                                    <Image
                                        src={data?.mainContent.imageUrl || "/images/sustainability-sprout.png"}
                                        alt="UrbanClay Sustainability"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20" />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="space-y-8"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl font-serif text-[#2A1E16]">{data?.mainContent.heading || 'Rooted in Sustainability'}</h2>
                                <div className="space-y-6 text-lg text-[#5d554f] font-light leading-relaxed prose prose-p:my-4 prose-strong:font-bold">
                                    {data?.mainContent.body ? (
                                        <PortableText value={data.mainContent.body} />
                                    ) : (
                                        <>
                                            <p>
                                                UrbanClay was founded with the ambition to revolutionize the way we build, aiming to make a lasting impact on both the spaces we create and the world we live in.
                                            </p>
                                            <p>
                                                Today, we proudly serve clients across all major cities in India, including Bangalore, Hyderabad, Delhi, Maharashtra, Kerala, and Gujarat. We’ve completed over <strong>700 projects</strong>, collaborating with top architects to deliver excellence.
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="p-8 bg-[#f9f7f5] rounded-xl border border-[#e5e5e5]">
                                    <h3 className="text-xl font-serif text-[var(--terracotta)] mb-3">{data?.mainContent.promise.title || 'Our Promise'}</h3>
                                    <p className="text-[#5d554f]">
                                        {data?.mainContent.promise.text || <>For every product purchased, we plant <strong>10 trees</strong>. This initiative reflects our deep belief in giving back to the environment.</>}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* STATS SECTION (Animated Counters) */}
                <section className="py-32 bg-[#2A1E16] text-[#f5f0eb] relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--terracotta)]/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                            <StatItem value={data?.stats.yearsExperience || 17} label="Years of Experience" suffix="+" />
                            <StatItem value={data?.stats.projectsCompleted || 700} label="Projects Completed" suffix="+" />
                            <StatItem value={data?.stats.citiesCovered || 50} label="Cities Covered" suffix="+" />
                            <StatItem value={data?.stats.treesPlanted || 10} label="Trees Planted" suffix="k+" />
                        </div>
                    </div>
                </section>

                <HorizontalTimeline events={data?.timeline} />

                {/* VISION SECTION */}
                <section className="py-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[#f5f0eb] relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif text-[#2A1E16] mb-8">{data?.vision.heading || 'Empowering Lives Through Design'}</h2>
                        <p className="text-xl text-[#5d554f] leading-relaxed mb-12 font-light">
                            {data?.vision.text || 'UrbanClay is more than a company—it’s a legacy. We offer a diverse range of products, from terracotta cladding to hollow clay blocks, all crafted from 100% natural clay.'}
                        </p>
                    </motion.div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

const DEFAULT_TIMELINE = [
    { year: '2006', title: 'The Beginning', description: 'Founded in a small workshop in Mumbai with a single kiln and a vision to revive terracotta.' },
    { year: '2010', title: 'First Major Project', description: 'Commissioned for the landmark "Red Stone House" in Bangalore, putting UrbanClay on the map.' },
    { year: '2015', title: 'Innovation Lab', description: 'Launched our dedicated R&D facility to develop weather-resistant and structural clay products.' },
    { year: '2018', title: 'Pan-India Expansion', description: 'Established supply chains across 20+ cities, becoming a trusted partner for top architects.' },
    { year: '2021', title: 'Sustainability Pledge', description: 'Committed to Carbon Neutrality by 2030. Planted our 10,000th tree.' },
    { year: '2024', title: 'Global Reach', description: 'Started exporting premium facade panels to the Middle East and Southeast Asia.' },
];

function HorizontalTimeline({ events }: { events?: { year: string, title: string, description: string }[] }) {
    const timelineEvents = events && events.length > 0 ? events : DEFAULT_TIMELINE;
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

    return (
        <section ref={targetRef} className="relative h-[400vh] bg-[#2A1E16] text-[#f5f0eb]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pt-32 px-8 md:px-24">
                    <div className="relative z-10 pointer-events-none">
                        <span className="text-[var(--terracotta)] font-medium tracking-[0.3em] uppercase text-xs md:text-sm block mb-2">
                            Our Journey
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif text-white">Milestones</h2>
                    </div>
                </div>

                <motion.div style={{ x }} className="flex gap-12 md:gap-24 px-8 md:px-24 pt-32 mt-20">
                    {timelineEvents.map((event, i) => (
                        <div key={i} className="relative group min-w-[300px] md:min-w-[500px] flex flex-col justify-start">
                            {/* Line Connector */}
                            <div className="absolute top-8 left-0 w-full h-[1px] bg-white/20" />
                            <div className="absolute top-8 left-0 w-3 h-3 rounded-full bg-[var(--terracotta)] -translate-y-1/2 ring-4 ring-[#2A1E16]" />

                            <div className="pt-16">
                                <span className="text-6xl md:text-9xl font-serif font-black text-white/5 absolute -top-12 left-0 pointer-events-none select-none">
                                    {event.year}
                                </span>
                                <div className="text-3xl md:text-4xl font-serif text-[var(--terracotta)] mb-4 relative z-10">
                                    {event.year}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-serif font-medium text-white mb-4">
                                    {event.title}
                                </h3>
                                <p className="text-white/60 text-lg leading-relaxed max-w-sm font-light">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    {/* End Padding */}
                    <div className="min-w-[20vw]" />
                </motion.div>
            </div>
        </section>
    );
}

// --- Sub-Components ---

function StatItem({ value, label, suffix }: { value: number, label: string, suffix: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    // Simple counting animation
    const count = useSpring(0, { duration: 2000 });

    React.useEffect(() => {
        if (isInView) {
            count.set(value);
        }
    }, [isInView, count, value]);

    const displayValue = useTransform(count, (latest) => Math.floor(latest));

    return (
        <div ref={ref} className="flex flex-col items-center">
            <div className="text-5xl md:text-7xl font-serif font-bold text-[var(--terracotta)] mb-4 flex items-baseline">
                <motion.span>{displayValue}</motion.span>
                <span className="text-3xl md:text-5xl ml-1">{suffix}</span>
            </div>
            <div className="text-sm md:text-base text-white/60 uppercase tracking-widest font-medium">{label}</div>
        </div>
    );
}
