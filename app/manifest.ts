import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'UrbanClay Premium Terracotta',
        short_name: 'UrbanClay',
        description: "India's premier manufacturer of sustainable terracotta tiles and bricks.",
        start_url: '/',
        display: 'standalone',
        background_color: '#FAF7F3',
        theme_color: '#b45a3c',
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
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
