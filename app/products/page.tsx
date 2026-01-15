import React from 'react';
import { getProducts } from '@/lib/products';
import ProductsPageAnimate from '@/components/ProductsPageAnimate';
// import Products from '@/components/Products';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
import { Metadata } from 'next';

import { getCategoryMetadata } from '@/lib/seo-metadata';
import { capitalizeWords } from '@/lib/utils'; // Helper or inline

interface ProductsPageProps {
    searchParams: Promise<{ category?: string; search?: string }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
    const { category, search } = await searchParams;

    // 1. Dynamic Search Handling (Highest Priority for Long-Tail SEO)
    if (search) {
        // Beautify the search term for the title
        const cleanTerm = search.replace(/[-_]/g, ' ').replace(/\+/g, ' ');
        const titleTerm = cleanTerm.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        return {
            title: `${titleTerm} | Premium Quality - UrbanClay India`,
            description: `Looking for ${titleTerm}? Explore UrbanClay's premium range of terracotta and clay products. Sustainable, durable, and delivered pan-India. Get a quote today.`,
            keywords: [cleanTerm, `${cleanTerm} price`, `${cleanTerm} suppliers`, 'urbanclay', 'terracotta tiles'],
            openGraph: {
                title: `Premium ${titleTerm} from UrbanClay`,
                description: `India's trusted manufacturer for ${cleanTerm}. High-quality, low-efflorescence clay products.`,
                url: `https://claytile.in/products?search=${encodeURIComponent(search)}`,
                images: [{ url: 'https://claytile.in/images/products/wirecut-texture.jpg' }]
            },
            alternates: {
                canonical: `https://claytile.in/products?search=${encodeURIComponent(search)}`
            }
        };
    }

    // 2. Category Handling
    if (category) {
        const categoryMetadata = await getCategoryMetadata(category);
        if (categoryMetadata) {
            return {
                ...categoryMetadata,
                alternates: {
                    canonical: `https://claytile.in/products?category=${category}`
                }
            };
        }
    }

    // 3. Default Metadata
    return {
        title: 'Terracotta Tiles & Clay Bricks Collection | UrbanClay India',
        description: 'Browse India\'s widest range of low-efflorescence terracotta tiles, exposed wirecut bricks, jaali panels, and facade cladding systems.',
        keywords: [
            'clay products',
            'clay building materials',
            'architectural clay products',
            'terracotta tiles',
            'clay brick tile suppliers',
            'terracotta jaali price',
            'exposed brick wall cost',
            'facade cladding materials',
            'roof tiles manufacturers',
            'floor tiles india',
            'urbanclay catalog',
            'sustainable construction materials'
        ],
        openGraph: {
            title: 'Clay Products & Terracotta Collection | UrbanClay',
            description: 'Explore India\'s premium range of clay products: Facade panels, wirecut bricks, roof tiles, and floor pavers. Sustainable & durable.',
            url: 'https://claytile.in/products',
            siteName: 'UrbanClay',
            type: 'website',
            locale: 'en_IN',
            images: [
                {
                    url: 'https://claytile.in/images/products/wirecut-texture.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'UrbanClay Premium Clay Products Collection'
                }
            ]
        },
        alternates: {
            canonical: 'https://claytile.in/products'
        }
    };
}

export const revalidate = 60;

import FAQSchema from '@/components/FAQSchema';

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const products = await getProducts();
    const resolvedParams = await searchParams;

    return (
        <>
            <FAQSchema />
            <ProductsPageAnimate
                products={products}
                initialCategory={resolvedParams.category}
                initialSearch={resolvedParams.search}
            />
        </>
    );
}
