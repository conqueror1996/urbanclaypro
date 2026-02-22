import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialShare from '@/components/SocialShare';
import JsonLd from '@/components/JsonLd';
import { SEO_KEYWORDS } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Why Bricks Fail in Indian Monsoon | The UrbanClay Technical Report",
    description: "An investigative report on why standard wirecut and handmade bricks suffer from efflorescence and algae during Indian monsoons, and how to prevent facade failure.",
    keywords: [
        "Brick efflorescence solution",
        "Facade waterproofing India",
        "Monsoon proof construction",
        "Algae on brick walls",
        "High quality wirecut bricks",
        ...SEO_KEYWORDS
    ],
    openGraph: {
        title: "Why Bricks Fail in Indian Monsoon",
        description: "The root causes of white patches and green algae on brick facades.",
        type: 'article',
        authors: ['UrbanClay Technical Team'],
        publishedTime: new Date().toISOString(),
    }
};

const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: "Why Bricks Fail in Indian Monsoon: A Technical Analysis",
    image: [
        "https://claytile.in/images/monsoon-damage-hero.jpg"
    ],
    author: {
        '@type': 'Organization',
        name: 'UrbanClay Technical Team'
    },
    publisher: {
        '@type': 'Organization',
        name: 'UrbanClay'
    },
    datePublished: new Date().toISOString(),
    description: "Detailed analysis of moisture absorption, salt crystallization, and biotic growth on clay facades in tropical climates.",
    articleBody: "Every July, thousands of pristine brick facades across India turn into a canvas of white patches and green moss...",
};

export default function MonsoonFailurePage() {
    return (
        <div className="bg-[#fcfbf9] min-h-screen text-[#2A1E16]">
            <JsonLd data={articleJsonLd} />
            <Header />

            {/* 1. Hero Section - stark and problem-focused */}
            <header className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center">
                <span className="inline-block px-4 py-1.5 bg-red-50 text-red-800 border-red-100 border text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-8">
                    Technical Report
                </span>
                <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-8">
                    Why Bricks Fail in <br /> <span className="text-red-800">The Indian Monsoon.</span>
                </h1>
                <p className="text-xl text-gray-500 font-light leading-relaxed">
                    It starts with a white patch. Then green moss. Finally, the plaster peels. <br className="hidden md:block" />
                    Here is the physics behind facade failure and how to engineer it out.
                </p>
            </header>

            {/* 2. Visual Evidence */}
            <div className="w-full max-w-5xl mx-auto px-4 md:px-8 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200">
                        {/* Placeholder for Efflorescence Image */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500 font-bold uppercase tracking-widest">
                            Fig A: Efflorescence
                        </div>
                    </div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200">
                        {/* Placeholder for Algae Image */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500 font-bold uppercase tracking-widest">
                            Fig B: Algal Bloom
                        </div>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-400 mt-4 italic">Common failures seen in standard 'Export Quality' bricks after 2 monsoon cycles.</p>
            </div>

            {/* 3. Article Content */}
            <article className="max-w-3xl mx-auto px-6 prose prose-lg prose-stone mb-32">
                <h2 className="font-serif text-3xl text-[#2A1E16]">The Water Absorption Trap</h2>
                <p>
                    The primary metric that defines a brick's longevity is <strong>Water Absorption</strong>.
                    Local clamp-burned bricks often have an absorption rate of <strong>15% to 25%</strong>.
                </p>
                <p>
                    During a heavy Mumbai or Kerala monsoon, these bricks act like stiff sponges. They soak up litres of water.
                    When the sun comes out, this water evaporates, but it leaves behind dissolved salts from the clay and mortar.
                    These salts crystallize on the surface, creating the ugly white powder known as <strong>Efflorescence</strong>.
                </p>

                <div className="bg-red-50 border-l-4 border-red-800 p-6 my-8 not-prose">
                    <h3 className="text-red-900 font-bold text-lg mb-2">The UrbanClay Standard</h3>
                    <p className="text-red-900/80 m-0">
                        We engineer our clay body to have <strong>&lt; 8% absorption</strong>. By firing at 1150°C, we vitrify the silica,
                        closing the pores that usually suck in water. No water in = No salts out.
                    </p>
                </div>

                <h2 className="font-serif text-3xl text-[#2A1E16] mt-12">The 'Green Wall' Phenomenon (Algae)</h2>
                <p>
                    If a brick remains damp for more than 48 hours, it becomes a breeding ground for cyanobacteria and algae.
                    This is why north-facing walls in humid zones turn green/black.
                    Soft, porous bricks provide the perfect micro-crevices for algae roots to take hold.
                </p>
                <p>
                    <strong>The Fix:</strong> A high-density, extruded surface. The smoother and denser the "skin" of the brick,
                    the harder it is for spores to latch on. Our machine-extruded wirecut bricks have a density of &gt; 2.2 g/cc,
                    making them naturally resistant to biotic growth without chemical sealers.
                </p>

                <h2 className="font-serif text-3xl text-[#2A1E16] mt-12">The Hidden Danger: Thermal Shock</h2>
                <p>
                    Indian climate is extreme. A facade can go from 25°C (rain) to 45°C (sun) in hours.
                    This rapid expansion and contraction creates micro-cracks in low-fired bricks.
                    Over 5 years, these micro-cracks join up, leading to structural spalling (face of the brick falling off).
                </p>

                <div className="my-12 p-8 bg-[#2A1E16] text-white rounded-2xl not-prose text-center">
                    <h3 className="font-serif text-2xl mb-4">Don't risk your facade.</h3>
                    <p className="text-white/70 mb-8">
                        Switch to industrial-grade systems designed for the tropics.
                    </p>
                    <Link href="/comparison" className="inline-block bg-[var(--terracotta)] text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-[#c25e3b] transition-all">
                        See Technical Comparison
                    </Link>
                </div>
            </article>

            {/* 4. Footer */}
            <Footer />
        </div>
    );
}
