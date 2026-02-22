import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Flexible Brick Tile | Ultra-Thin 3mm Modified Clay | UrbanClay',
    description: 'Discover the future of architectural facing. UrbanClay\'s Flexible Brick Tile is a genuine terracotta surface with authentic wire-cut texture that wraps around columns and shapes to your imagination—at just 3mm thick and 90% lighter than traditional brick.',
    keywords: 'flexible brick, thin brick veneer, modified clay tile, lightweight brick, curved wall cladding, architectural terracotta, 3mm brick, UrbanClay',
    openGraph: {
        title: 'Flexible Brick Tile | The Impossible Material by UrbanClay',
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
        title: 'UrbanClay | Flexible Brick Tile Showcase',
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
