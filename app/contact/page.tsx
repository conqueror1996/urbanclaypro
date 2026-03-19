import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const metadata = {
    title: 'Contact Us | UrbanClay Experience Center',
    description: 'Visit our Mumbai studio or contact us for pan-India delivery of premium terracotta tiles and facades. Phone: +91 80800 81951.',
    keywords: [
        'contact urbanclay',
        'terracotta tiles mumbai',
        'clay tile showroom',
        'buy terracotta tiles',
        'urbanclay address',
        'facade suppliers india'
    ],
    openGraph: {
        title: 'Contact UrbanClay | Experience Center & Studio',
        description: 'Visit our studio in Mumbai or get in touch for projects nationwide.',
        url: 'https://claytile.in/contact',
        siteName: 'UrbanClay',
        locale: 'en_IN',
        type: 'website',
        images: [
            {
                url: 'https://claytile.in/images/studio-entrance.jpg',
                width: 1200,
                height: 630,
                alt: 'UrbanClay Studio Entrance'
            }
        ]
    },
    alternates: {
        canonical: 'https://claytile.in/contact'
    }
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FAF9F6] selection:bg-[var(--terracotta)] selection:text-white">
            <Header hideAnnouncement={true} />

            <main>
                {/* HERO SECTION */}
                <section className="relative pt-32 pb-40 md:pt-48 md:pb-48 px-6 bg-[#1a1512] overflow-hidden">
                    {/* Background Texture & Gradient */}
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('/images/clay-texture.png')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a1512] via-transparent to-[#1a1512] opacity-80"></div>
                    <div className="absolute right-0 top-0 w-[800px] h-[800px] bg-[var(--terracotta)]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="max-w-7xl mx-auto relative z-10 text-center">
                        <span className="inline-block py-1.5 px-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8">
                            Get in Touch
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight">
                            Contact Our <i className="text-[var(--terracotta)]">Studio</i>
                        </h1>
                        <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light">
                            We ship nationwide. Whether you are an architect working on a large facade or a homeowner looking for statement tiles, we are here to help.
                        </p>
                    </div>
                </section>

                {/* CONTACT INFO & MAP (Overlapping Hero) */}
                <section className="max-w-7xl mx-auto px-6 relative z-20 -mt-24 md:-mt-32 mb-24">
                    <div className="grid lg:grid-cols-5 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-black/5">

                        {/* Info Column */}
                        <div className="lg:col-span-2 p-10 md:p-16 bg-[#FAF9F6] flex flex-col justify-between relative overflow-hidden">
                            {/* Decorative background circle */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--terracotta)]/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3"></div>

                            <div className="relative z-10">
                                <h3 className="font-serif text-3xl text-[var(--ink)] mb-10">Mumbai HQ</h3>

                                <div className="space-y-10">
                                    <div className="flex gap-5 group">
                                        <div className="w-12 h-12 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--terracotta)] transition-colors duration-500">
                                            <MapPin className="w-5 h-5 text-[var(--ink)] group-hover:text-white transition-colors duration-500" />
                                        </div>
                                        <div>
                                            <p className="text-[#9C8C74] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Experience Center</p>
                                            <p className="text-[var(--ink)]/80 text-sm md:text-base leading-relaxed">
                                                UrbanClay Studio<br />
                                                Laxmi Industrial Estate, Andheri West<br />
                                                Mumbai, Maharashtra 400053<br />
                                                India
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-5 group">
                                        <div className="w-12 h-12 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--terracotta)] transition-colors duration-500">
                                            <Phone className="w-5 h-5 text-[var(--ink)] group-hover:text-white transition-colors duration-500" />
                                        </div>
                                        <div>
                                            <p className="text-[#9C8C74] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Phone / WhatsApp</p>
                                            <a href="tel:+918080081951" className="text-lg md:text-xl text-[var(--ink)] font-serif hover:text-[var(--terracotta)] transition-colors block">
                                                +91 80800 81951
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-5 group">
                                        <div className="w-12 h-12 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--terracotta)] transition-colors duration-500">
                                            <Mail className="w-5 h-5 text-[var(--ink)] group-hover:text-white transition-colors duration-500" />
                                        </div>
                                        <div>
                                            <p className="text-[#9C8C74] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Email</p>
                                            <a href="mailto:urbanclay@claytile.in" className="text-base text-[var(--ink)]/80 hover:text-[var(--terracotta)] transition-colors block">
                                                urbanclay@claytile.in
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-5 group">
                                        <div className="w-12 h-12 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--terracotta)] transition-colors duration-500">
                                            <Clock className="w-5 h-5 text-[var(--ink)] group-hover:text-white transition-colors duration-500" />
                                        </div>
                                        <div className="w-full">
                                            <p className="text-[#9C8C74] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Opening Hours</p>
                                            <div className="space-y-2 text-sm text-[var(--ink)]/80 w-full">
                                                <div className="flex justify-between border-b border-black/5 pb-2">
                                                    <span>Mon - Sat</span>
                                                    <span>10:00 AM - 7:00 PM</span>
                                                </div>
                                                <div className="flex justify-between pt-1 text-[var(--ink)]/50">
                                                    <span>Sunday</span>
                                                    <span>Closed</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Column */}
                        <div className="lg:col-span-3 relative min-h-[400px] lg:min-h-full w-full bg-[#EBE5E0]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.877026779347!2d72.8279453752066!3d19.11299998209935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9e5ce3a6773%3A0x4e61626b1424269e!2sLaxmi%20Industrial%20Estate!5e0!3m2!1sen!2sin!4v1703062363784!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(100%) contrast(1.1) opacity(0.9)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full"
                            />
                            {/* Overlay shadow for border blending */}
                            <div className="absolute inset-0 pointer-events-none border-l border-black/5 shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,0.1)]"></div>
                        </div>

                    </div>
                </section>

                <section id="partner" className="py-24 max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif text-[#2A1E16] mb-4">Project Inquiry</h2>
                        <p className="text-gray-500">Submit your BOQ or Requirements.</p>
                    </div>
                    <QuoteForm isEmbedded={true} />
                </section>
            </main>
            <Footer />
        </div>
    );
}
