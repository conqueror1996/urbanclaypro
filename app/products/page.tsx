import React from 'react';
import { getProducts } from '@/lib/products';
import ProductsPageAnimate from '@/components/ProductsPageAnimate';
// import Products from '@/components/Products';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terracotta Tiles & Clay Bricks Collection | UrbanClay India',
    description: 'Browse India\'s widest range of low-efflorescence terracotta tiles, exposed wirecut bricks, jaali panels, and facade cladding systems.',
    keywords: [
        ' terracotta tiles',
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
        url: 'https://claytile.in/products',
        siteName: 'UrbanClay',
        type: 'website',
        locale: 'en_IN',
        images: [
            {
                url: 'https://claytile.in/images/premium-terracotta-facade.png', // Ensure this exists or use a generic one
                width: 1200,
                height: 630,
                alt: 'UrbanClay Premium Terracotta Collection'
            }
        ]
    },
    alternates: {
        canonical: 'https://claytile.in/products'
    }
};

export const revalidate = 60;

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <ProductsPageAnimate products={products} />
    );
}
