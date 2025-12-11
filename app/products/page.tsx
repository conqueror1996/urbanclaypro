import React from 'react';
import { getProducts } from '@/lib/products';
import Products from '@/components/Products';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyBar from '@/components/StickyBar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terracotta Tiles & Clay Bricks Collection | UrbanClay India',
    description: 'Browse India\'s widest range of low-efflorescence terracotta tiles, exposed wirecut bricks, jaali panels, and facade cladding systems.',
    keywords: [
        'period terracotta tiles',
        'clay brick tile suppliers',
        'terracotta jaali price',
        'exposed brick wall cost',
        'facade cladding materials',
        'roof tiles manufacturers',
        'floor tiles india',
        'urbanclay catalog'
    ],
    openGraph: {
        title: 'Premium Terracotta Collection | UrbanClay',
        description: 'Sustainable, handcrafted clay products for modern architecture.',
        url: 'https://urbanclay.in/products',
        type: 'website',
        locale: 'en_IN',
    }
};

export const revalidate = 60;

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
            <StickyBar />
            <Header />
            <div className="pt-20">
                <div className="bg-[#E7ECEF] py-16 px-4 text-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex justify-center">
                        <Breadcrumbs />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2A1E16] mb-4">Our Collection</h1>
                    <p className="text-lg text-[#5d554f] max-w-2xl mx-auto">
                        Discover sustainable, handcrafted clay products designed for modern architecture.
                    </p>
                </div>
                <Products products={products} />
            </div>
            <Footer />
        </div>
    );
}
