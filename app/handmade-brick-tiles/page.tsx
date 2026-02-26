import { Metadata } from 'next';
import { getProducts, getPillarHeroImage } from '@/lib/products';
import PillarPageTemplate from '@/components/PillarPageTemplate';

export const metadata: Metadata = {
    title: "Handmade Brick Tiles | Bespoke Artisanal Cladding India",
    description: "Architectural grade handmade brick tiles for heritage restoration and bespoke luxury projects. Precision-fired natural Indian clay for industrial durability with artisanal aesthetics.",
    alternates: { canonical: 'https://claytile.in/handmade-brick-tiles' }
};

export default async function HandmadeBrickTilesPillar() {
    const products = await getProducts();
    const heroImage = await getPillarHeroImage('handmade-brick-tiles', 'brick-wall-tiles') || "/images/products/pressed-texture.jpg";
    const handmadeProducts = products.filter(p => p.category?.slug === 'handmade-brick' || p.category?.slug === 'handmade-brick-tiles' || (p.title.toLowerCase().includes('handmade') && !p.title.toLowerCase().includes('panel') && !p.category?.slug?.includes('panel')));

    return (
        <PillarPageTemplate
            title="Handmade Brick Tiles"
            subtitle="Artisanal Character In Every Piece"
            description="Embrace the imperfect beauty of traditional craftsmanship. Our handmade brick tiles are individually moulded by skilled artisans, meaning no two tiles are exactly identical. The result is a facade rich with natural shadow, texture, and soul."
            heroImage={heroImage}
            keyword="Handmade Brick Tile"
            slug="handmade-brick-tiles"
            products={handmadeProducts}
            faqs={[
                {
                    q: "Why choose handmade over machine-made?",
                    a: "Handmade brick tiles offer an organic, rustic texture with subtle size and color variations that machine-made tiles cannot replicate. They are ideal for projects requiring historical authenticity or a bespoke, vintage atmosphere."
                },
                {
                    q: "Are handmade tiles as durable as wirecut?",
                    a: "Yes. While their appearance is irregular, they are fired at the same extreme temperatures (usually over 1000°C), ensuring they are fully vitrified, strong, and highly weather-resistant."
                },
                {
                    q: "How thick are the tiles?",
                    a: "Our handmade brick tiles generally range from 15mm to 20mm in thickness, making them light enough for easy cladding on existing walls without structural modifications."
                }
            ]}
        />
    );
}
