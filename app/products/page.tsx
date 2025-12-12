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
        <ProductsPageAnimate products={products} />
    );
}
