import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQSchema from '@/components/FAQSchema';

export const metadata: Metadata = {
    title: 'Terracotta Tiles India | Premium Clay Facade & Brick Cladding Manufacturer',
    description: 'UrbanClay is India\'s leading manufacturer of premium terracotta tiles, brick cladding, and clay facade panels. Sustainable, eco-friendly, and delivered pan-India.',
    keywords: 'terracotta tiles India, clay facade panels India, brick cladding tiles India, terracotta jaali manufacturers, exposed wirecut bricks, sustainable building materials India',
    openGraph: {
        title: 'Terracotta Tiles & Clay Facades India | UrbanClay',
        description: 'Discover premium terracotta and clay products for modern architecture. Direct from manufacturer.',
        url: 'https://claytile.in/terracotta-tiles-india',
        siteName: 'UrbanClay',
        locale: 'en_IN',
        type: 'article',
        images: [
            {
                url: 'https://claytile.in/images/products/wirecut-texture.jpg',
                width: 1200,
                height: 630,
                alt: 'Premium Terracotta Tiles India'
            }
        ]
    },
    alternates: {
        canonical: 'https://claytile.in/terracotta-tiles-india'
    }
};

export default function TerracottaTilesIndia() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "UrbanClay",
        "url": "https://claytile.in",
        "logo": "https://claytile.in/urbanclay-logo.png",
        "description": "Manufacturer and supplier of premium terracotta tiles, brick cladding, and clay facade panels in India.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN",
            "addressLocality": "Mumbai"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-8080081951",
            "contactType": "sales",
            "areaServed": "IN"
        },
        "sameAs": [
            "https://www.instagram.com/urbanclay",
            "https://www.linkedin.com/company/urbanclay"
        ]
    };

    return (
        <div className="bg-[#fcfaf8] text-[#2A1E16] font-sans selection:bg-[var(--terracotta)] selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <FAQSchema />
            <Header />

            <main className="pt-24">
                {/* HERO SECTION */}
                <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/products/wirecut-texture.jpg" // Using existing asset as placeholder
                            alt="Premium terracotta wall tiles India background"
                            fill
                            className="object-cover opacity-90"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                            Premium Terracotta Tiles Manufacturer in India
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-100 mb-8 font-light">
                            Transforming modern Indian architecture with sustainable, high-performance clay facade panels, brick cladding, and exposed wirecut bricks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="#product-range" className="px-8 py-4 bg-[var(--terracotta)] hover:bg-[#c0562e] text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Explore Products
                            </Link>
                            <Link href="#contact" className="px-8 py-4 bg-white text-[var(--ink)] hover:bg-gray-100 rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Request Samples
                            </Link>
                        </div>
                    </div>
                </section>

                {/* INTRODUCTION */}
                <section className="py-20 px-6 max-w-4xl mx-auto text-center">
                    <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-4 block">The UrbanClay Advantage</span>
                    <h2 className="text-3xl md:text-4xl font-serif mb-8">Redefining Earthy Aesthetics for Indian Homes</h2>
                    <div className="prose prose-lg mx-auto text-[#5d554f]">
                        <p>
                            As a premier <strong>terracotta tiles manufacturer in India</strong>, UrbanClay bridges the gap between traditional craftsmanship and modern architectural needs. In a market flooded with synthetic alternatives, we bring you the authentic warmth, breathability, and timeless appeal of natural clay.
                        </p>
                        <p>
                            Whether you are an architect designing a sustainable facade in Bangalore, a homeowner looking for <strong>exposed brick cladding in Delhi</strong>, or a developer seeking eco-friendly materials in Mumbai, our pan-India supply chain ensures that premium quality reaches your doorstep. Our products are fired at high temperatures (approx. 1200°C) to ensure low water absorption, high compressive strength, and zero efflorescence.
                        </p>
                    </div>
                </section>

                {/* PRODUCT RANGE */}
                <section id="product-range" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-serif mb-4">Our Comprehensive Product Range</h2>
                            <p className="text-[#5d554f] max-w-2xl mx-auto">From sleek facade panels to rustic handmade bricks, explore India's finest collection of clay products.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Card 1: Brick Tiles */}
                            <div className="group border border-[var(--line)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="aspect-[4/3] relative bg-gray-100">
                                    <Image
                                        src="/images/products/pressed-texture.jpg"
                                        alt="Brick cladding tiles India"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-serif mb-3">Brick Cladding Tiles</h3>
                                    <p className="text-[#5d554f] mb-6 text-sm leading-relaxed">
                                        Thin, lightweight, and easy to install. Our <strong>brick tiles</strong> are perfect for interior feature walls and exterior facades, offering the look of full bricks without the structural weight.
                                    </p>
                                    <Link href="/products/brick-wall-tiles" className="text-[var(--terracotta)] font-medium hover:underline flex items-center gap-2">
                                        View Collection <span>→</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Card 2: Facade Panels */}
                            <div className="group border border-[var(--line)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="aspect-[4/3] relative bg-gray-100">
                                    <Image
                                        src="/images/products/wirecut-texture.jpg"
                                        alt="Clay facade panels India"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-serif mb-3">Clay Facade Panels</h3>
                                    <p className="text-[#5d554f] mb-6 text-sm leading-relaxed">
                                        Engineered for modern high-rises. Our <strong>terracotta facade panels</strong> provide excellent thermal insulation, acoustic performance, and a sleek, contemporary aesthetic.
                                    </p>
                                    <Link href="/products/clay-facade-panels" className="text-[var(--terracotta)] font-medium hover:underline flex items-center gap-2">
                                        View Specifications <span>→</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Card 3: Jaali */}
                            <div className="group border border-[var(--line)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="aspect-[4/3] relative bg-gray-100">
                                    <Image
                                        src="/images/products/handmade-texture.jpg"
                                        alt="Terracotta jaali manufacturers India"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-serif mb-3">Terracotta Jaali</h3>
                                    <p className="text-[#5d554f] mb-6 text-sm leading-relaxed">
                                        Sustainable passive cooling solutions. Our <strong>terracotta jaali blocks</strong> allow natural light and ventilation while reducing solar heat gain, ideal for India's tropical climate.
                                    </p>
                                    <Link href="/products/terracotta-jaali" className="text-[var(--terracotta)] font-medium hover:underline flex items-center gap-2">
                                        Explore Patterns <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHY CHOOSE US */}
                <section className="py-20 bg-[#2A1E16] text-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif mb-6">Why Architects Choose UrbanClay</h2>
                                <p className="text-gray-300 mb-8 text-lg">
                                    With over 17 years of expertise in the clay industry, we understand the nuances of material science and architectural requirements.
                                </p>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <div className="p-2 bg-white/10 rounded-lg shrink-0">
                                            <svg className="w-6 h-6 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Pan-India Delivery</h4>
                                            <p className="text-gray-400 text-sm mt-1">From Kashmir to Kanyakumari, our logistics network ensures timely delivery to your site.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="p-2 bg-white/10 rounded-lg shrink-0">
                                            <svg className="w-6 h-6 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Batch Consistency</h4>
                                            <p className="text-gray-400 text-sm mt-1">Automated firing processes ensure uniform color and texture across large orders, crucial for large-scale facades.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="p-2 bg-white/10 rounded-lg shrink-0">
                                            <svg className="w-6 h-6 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Eco-Friendly Manufacturing</h4>
                                            <p className="text-gray-400 text-sm mt-1">We use natural clay and sustainable firing methods to minimize carbon footprint.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/10">
                                <Image
                                    src="/images/products/handmade-texture.jpg"
                                    alt="Sustainable terracotta manufacturing India"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* TECHNICAL SPECS */}
                <section className="py-20 px-6 max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Technical Superiority</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-[var(--terracotta)]">
                                    <th className="py-4 px-6 font-bold text-lg">Property</th>
                                    <th className="py-4 px-6 font-bold text-lg">UrbanClay Standard</th>
                                    <th className="py-4 px-6 font-bold text-lg text-gray-500">Industry Avg</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--line)]">
                                <tr>
                                    <td className="py-4 px-6 font-medium">Water Absorption</td>
                                    <td className="py-4 px-6 text-[var(--terracotta)] font-bold">&lt; 10%</td>
                                    <td className="py-4 px-6 text-gray-500">15-20%</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-6 font-medium">Compressive Strength</td>
                                    <td className="py-4 px-6 text-[var(--terracotta)] font-bold">&ge; 40 kg/cm²</td>
                                    <td className="py-4 px-6 text-gray-500">25 kg/cm²</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-6 font-medium">Efflorescence</td>
                                    <td className="py-4 px-6 text-[var(--terracotta)] font-bold">Nil / Slight</td>
                                    <td className="py-4 px-6 text-gray-500">Moderate</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-6 font-medium">Firing Temperature</td>
                                    <td className="py-4 px-6 text-[var(--terracotta)] font-bold">~1200°C</td>
                                    <td className="py-4 px-6 text-gray-500">~900°C</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* PAN-INDIA NETWORK */}
                <section className="py-20 bg-gray-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif mb-4">Serving Major Locations Across India</h2>
                            <p className="text-[#5d554f]">UrbanClay delivers to 100+ cities. Find your local representative.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                            {/* Ideally, we map this from CITIES if imported. Since I can't easily add the import in this block without messing up top of file, 
                                I will hardcode the key ones or assume CITIES is available if I added the import. 
                                Actually, I should add the import first. But for this single edit, I will manually add the links based on the known locations to be safe and fast.
                             */}
                            <Link href="/mumbai" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Mumbai</Link>
                            <Link href="/delhi" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Delhi NCR</Link>
                            <Link href="/bangalore" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Bangalore</Link>
                            <Link href="/pune" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Pune</Link>
                            <Link href="/hyderabad" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Hyderabad</Link>
                            <Link href="/chennai" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Chennai</Link>
                            <Link href="/ahmedabad" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Ahmedabad</Link>
                            <Link href="/surat" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Surat</Link>
                            <Link href="/goa" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Goa</Link>
                            <Link href="/kerala" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Kerala</Link>
                            <Link href="/maharashtra" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Maharashtra</Link>
                            <Link href="/gujarat" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Gujarat</Link>
                            <Link href="/karnataka" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Karnataka</Link>
                            <Link href="/tamil-nadu" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Tamil Nadu</Link>
                            <Link href="/rajasthan" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Rajasthan</Link>
                            <Link href="/telangana" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Telangana</Link>
                            <Link href="/andhra-pradesh" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Andhra Pradesh</Link>
                            <Link href="/madhya-pradesh" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Madhya Pradesh</Link>
                            <Link href="/uttar-pradesh" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Uttar Pradesh</Link>
                            <Link href="/west-bengal" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">West Bengal</Link>
                            <Link href="/odisha" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Odisha</Link>
                            <Link href="/punjab" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Punjab</Link>
                            <Link href="/haryana" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Haryana</Link>
                            <Link href="/bihar" className="p-3 bg-white rounded-lg shadow-sm hover:text-[var(--terracotta)] hover:shadow-md transition-all text-center">Bihar</Link>
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section id="contact" className="py-24 bg-[#f0e8e2]">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-serif mb-6">Ready to Build with Earth?</h2>
                        <p className="text-lg text-[#5d554f] mb-10 max-w-2xl mx-auto">
                            Get a custom quote for your project. We offer bulk pricing for architects, builders, and developers across India.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <a
                                href="mailto:urbanclay@claytile.in"
                                className="px-10 py-5 bg-[var(--ink)] text-white rounded-full font-bold text-lg hover:bg-[#4a3e36] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                            >
                                Request Quote
                            </a>
                            <a
                                href="https://wa.me/918080081951"
                                className="px-10 py-5 bg-white text-[#25D366] border border-[#25D366] rounded-full font-bold text-lg hover:bg-[#25D366] hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                WhatsApp Us
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
