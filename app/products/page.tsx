import React from 'react';
import { getProducts } from '@/lib/products';
import ProductsPageAnimate from '@/components/ProductsPageAnimate';
// import Products from '@/components/Products';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
import { Metadata } from 'next';

import { getCategoryMetadata } from '@/lib/seo-metadata';

interface ProductsPageProps {
    searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
    const { category } = await searchParams;

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

    // Default Metadata for /products
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

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <>
            <FAQSchema />
            <ProductsPageAnimate products={products} />
        </>
    );
}
