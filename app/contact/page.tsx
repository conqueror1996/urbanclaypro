import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';

export const metadata = {
    title: 'Contact Us | UrbanClay',
    description: 'Get in touch with UrbanClay for premium terracotta tiles and facades. Visit our studio in Mumbai or contact us for pan-India delivery.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[var(--sand)]">
            <Header />
            <main className="pt-24 pb-20">
                {/* Header */}
                <div className="bg-[#2A1E16] text-white py-20 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="text-[var(--terracotta)] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Get in Touch</span>
                        <h1 className="font-serif text-4xl md:text-6xl mb-6">Contact Our Studio</h1>
                        <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
                            We ship nationwide. Whether you are an architect working on a large facade or a homeowner looking for statement tiles, we are here to help.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-10">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2">

                        {/* Contact Info */}
                        <div className="p-10 md:p-16 space-y-10 bg-[#FAF7F3]">
                            <div>
                                <h3 className="font-serif text-2xl text-[var(--ink)] mb-1">Mumbai HQ</h3>
                                <p className="text-[#9C8C74] text-sm uppercase tracking-wider font-bold mb-4">Experience Center</p>
                                <p className="text-[#5d554f] leading-relaxed">
                                    UrbanClay Studio<br />
                                    Laxmi Industrial Estate, Andheri West<br />
                                    Mumbai, Maharashtra 400053<br />
                                    India
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[#9C8C74] text-xs font-bold uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                                    <a href="tel:+918080081951" className="text-xl text-[var(--ink)] font-serif hover:text-[var(--terracotta)] transition-colors block">
                                        +91 80800 81951
                                    </a>
                                </div>
                                <div>
                                    <p className="text-[#9C8C74] text-xs font-bold uppercase tracking-wider mb-1">Email</p>
                                    <a href="mailto:sales@urbanclay.in" className="text-lg text-[var(--ink)] hover:text-[var(--terracotta)] transition-colors block">
                                        sales@urbanclay.in
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-serif text-2xl text-[var(--ink)] mb-4">Opening Hours</h3>
                                <ul className="space-y-2 text-[#5d554f]">
                                    <li className="flex justify-between border-b border-[#EBE5E0] pb-2">
                                        <span>Mon - Sat</span>
                                        <span>10:00 AM - 7:00 PM</span>
                                    </li>
                                    <li className="flex justify-between border-b border-[#EBE5E0] pb-2">
                                        <span>Sunday</span>
                                        <span>Closed</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Map or Image Placeholder */}
                        <div className="relative min-h-[400px] w-full bg-[#f4f1ee]">
                            {/* Simple iframe map for now */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.877026779347!2d72.8279453752066!3d19.11299998209935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9e5ce3a6773%3A0x4e61626b1424269e!2sLaxmi%20Industrial%20Estate!5e0!3m2!1sen!2sin!4v1703062363784!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(100%) contrast(1.2) opacity(0.8)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                    </div>
                </div>

                {/* Form Section */}
                <div className="mt-20">
                    <QuoteForm />
                </div>

            </main>
            <Footer />
        </div>
    );
}
