import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Terms of Use | UrbanClay',
    description: 'Terms and conditions for using the UrbanClay website and purchasing our products.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--sand)]">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--ink)] mb-8">Terms of Use</h1>
                <p className="text-[#5d554f] mb-12">Last Updated: December 2025</p>

                <div className="prose prose-stone prose-lg max-w-none text-[#5d554f]">
                    <h3>1. Agreement to Terms</h3>
                    <p>By accessing our website, purchasing our products, or using our services, you agree to be bound by these Terms of Use and our Privacy Policy.</p>

                    <h3>2. Products & Availability</h3>
                    <p>All products shown on this website are subject to availability. As our products are made from natural clay, slight variations in color, texture, and size are inherent characteristics and are not considered defects.</p>

                    <h3>3. Orders & Payments</h3>
                    <p>We reserve the right to refuse any order you place with us. For bulk orders, shipping timelines will be confirmed upon payment. Prices are subject to change without notice.</p>

                    <h3>4. Intellectual Property</h3>
                    <p>The content, design, and imagery on this site are owned by UrbanClay. specialized kiln-firing techniques and product designs are proprietary.</p>

                    <h3>5. Governing Law</h3>
                    <p>These terms shall be governed by and defined following the laws of India. UrbanClay and yourself irrevocably consent that the courts of Mumbai, Maharashtra shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.</p>

                    <hr className="my-10 border-[var(--line)]" />

                    <p className="text-sm italic">For any legal concerns, please contact us at legal@claytile.in</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
