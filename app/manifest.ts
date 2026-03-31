import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'UrbanClay Premium Terracotta',
        short_name: 'UrbanClay',
        description: "India's premier manufacturer of high-precision flexible brick tiles and terracotta panels. Sustainable clay facades for modern architecture.",
        start_url: '/',
        display: 'standalone',
        background_color: '#FAF7F3',
        theme_color: '#b45a3c',
        categories: ['business', 'home decor', 'construction', 'architecture'],
        lang: 'en-IN',
        icons: [
            {
                src: '/icon.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        screenshots: [
            {
                src: '/og-image.png',
                sizes: '1200x630',
                type: 'image/png',
                label: 'UrbanClay Collection Home'
            }
        ],
        shortcuts: [
            {
                name: 'Products',
                url: '/products',
                description: 'Browse our full clay tile collection'
            },
            {
                name: 'Projects',
                url: '/projects',
                description: 'View our architectural project portfolio'
            },
            {
                name: 'Contact Sales',
                url: '/contact',
                description: 'Get a quote or request samples'
            }
        ]
    }
}
