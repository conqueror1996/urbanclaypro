import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ultra Thin Flexible Brick Veneers | Curved Wall Clay Tiles India | UrbanClay',
    description: 'Transform complex architectural forms with our 3mm ultra-thin flexible brick tiles. Engineered for curved walls, lightweight exterior cladding, and seamless column wrapping across India.',
    keywords: 'ultra thin flexible brick veneers, bendable clay tiles for curved walls, lightweight brick slips exterior, flexible terracotta facade, modified clay materials India, UrbanClay',
    openGraph: {
        title: 'Ultra Thin Flexible Brick Veneers | UrbanClay',
        description: '100% Modified Clay. Zero Rigidity. A 3mm ultra-thin, featherweight brick tile that seamlessly bends around convex walls and columns.',
        images: [{
            url: '/images/flexible_thin_brick.png',
            width: 1200,
            height: 630,
            alt: 'Macro photograph of a thin, bending terracotta flexible brick tile by UrbanClay'
        }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ultra Thin Flexible Brick Veneers | UrbanClay',
        description: 'We engineered the traditional masonry block down to a microscopic 3mm profile. Authentic clay texture. Zero rigidity.',
        images: ['/images/flexible_thin_brick.png'],
    }
};

export default function FlexibleBrickLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
