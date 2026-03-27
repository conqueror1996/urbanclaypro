import { Metadata } from 'next';
import { getProducts, getPillarHeroImage, getPillarToolkitImage, getProjectsByCategory } from '@/lib/products';
import PillarPageTemplate from '@/components/PillarPageTemplate';

export const metadata: Metadata = {
    title: "Handmade Brick Tiles | Bespoke Artisanal Masonry India | UrbanClay",
    description: "Architectural grade handmade brick tiles for heritage restoration and bespoke luxury projects. Precision-fired natural Indian clay for artisanal textures & industrial durability.",
    keywords: "handmade brick tiles india, bespoke artisanal cladding, rustic brick wall tiles, heritage restoration bricks, reclaimed style bricks, UrbanClay",
    alternates: { canonical: 'https://claytile.in/handmade-brick-tiles' }
};

export default async function HandmadeBrickTilesPillar() {
    const [products, heroImage, specifierToolkitImage, projects] = await Promise.all([
        getProducts(),
        getPillarHeroImage('handmade-brick-tiles', 'brick-wall-tiles').then(img => img || "/images/products/pressed-texture.jpg"),
        getPillarToolkitImage('handmade-brick-tiles', 'brick-wall-tiles'),
        getProjectsByCategory('handmade-brick-tiles'),
    ]);
    const handmadeProducts = products.filter(p => p.category?.slug === 'handmade-brick' || p.category?.slug === 'handmade-brick-tiles' || (p.title.toLowerCase().includes('handmade') && !p.title.toLowerCase().includes('panel') && !p.category?.slug?.includes('panel')));

    return (
        <PillarPageTemplate
            title="Handmade Brick Tiles"
            subtitle="Artisanal Character In Every Piece"
            heroTitleOverride={
                <>
                    Enduring <span className="text-[var(--terracotta)] italic">Strength</span>. <br className="hidden md:block" /> Timeless Character.
                </>
            }
            description="Embrace the imperfect beauty of traditional craftsmanship. Our handmade brick tiles are individually moulded by skilled artisans, meaning no two tiles are exactly identical. The result is a facade rich with natural shadow, texture, and soul."
            heroImage={heroImage}
            specifierToolkitImage={specifierToolkitImage}
            keyword="Handmade Brick Tile"
            slug="handmade-brick-tiles"
            products={handmadeProducts}
            projects={projects}
            metrics={[
                { label: "Fire Rating", val: "Fire Resistant (A1)", detail: "Stone Fired" },
                { label: "Durability", val: "Aged Character", detail: "Natural Variances" },
                { label: "HVAC Energy", val: "High Insulation", detail: "Porous Breathability" },
                { label: "Installation", val: "Wet Adhesive Fix", detail: "Thin Profile (15mm)" }
            ]}
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
