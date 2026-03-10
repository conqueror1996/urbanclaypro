import { Metadata } from 'next';
import { getProducts, getPillarHeroImage, getPillarToolkitImage, getProjectsByCategory } from '@/lib/products';
import PillarPageTemplate from '@/components/PillarPageTemplate';

export const metadata: Metadata = {
    title: "Wirecut Exposed Red Brick Masonry | Architectural Facing Bricks India",
    description: "Premium high-strength wirecut clay bricks engineered for structural and aesthetic excellence. High-fired facing bricks with near-zero efflorescence for both interior and exterior architectural masonry.",
    keywords: "wirecut exposed red brick masonry, architectural facing bricks india, interior exposed brick walls, premium red bricks for elevation, zero efflorescence bricks, UrbanClay",
    alternates: { canonical: 'https://claytile.in/exposed-brick' }
};

export default async function ExposedBrickPillar() {
    const [products, heroImage, specifierToolkitImage, projects] = await Promise.all([
        getProducts(),
        getPillarHeroImage('exposed-bricks', 'exposed-brick').then(img => img || "/images/products/wirecut-texture.jpg"),
        getPillarToolkitImage('exposed-bricks', 'exposed-brick'),
        getProjectsByCategory('exposed-bricks'),
    ]);
    const brickProducts = products.filter(p => p.category?.slug === 'exposed-bricks' || p.category?.slug === 'exposed-brick' || (p.title.toLowerCase().includes('brick') && !p.title.toLowerCase().includes('tile') && !p.title.toLowerCase().includes('flexible') && !p.title.toLowerCase().includes('handmade')));

    return (
        <PillarPageTemplate
            title="Exposed Brick"
            subtitle="The Architecture of Authenticity"
            description="Nothing matches the warmth, character, and timeless appeal of an authentic exposed brick wall. Our structural wirecut and facing bricks are naturally resistant to fading, boasting near-zero efflorescence and unparalleled compressive strength."
            heroImage={heroImage}
            specifierToolkitImage={specifierToolkitImage}
            keyword="Exposed Brick"
            slug="exposed-brick"
            products={brickProducts}
            projects={projects}
            faqs={[
                {
                    q: "Does exposed brick suffer from efflorescence (white salt)?",
                    a: "UrbanClay exposes clay to extreme firing temperatures, burning off organic impurities. Our premium exposed bricks are specifically designed to be highly resistant to efflorescence compared to standard local bricks."
                },
                {
                    q: "Can I use exposed brick indoors?",
                    a: "Absolutely. Exposed brick is highly popular for interior feature walls, industrial lofts, and warm living spaces. We recommend a simple clear sealant to prevent any dust accumulation indoors."
                },
                {
                    q: "What's the difference between wirecut and pressed bricks?",
                    a: "Wirecut bricks are extruded and cut with a wire, giving them sharp edges and a clean, modern aesthetic. Pressed bricks are moulded, often resulting in a denser core and traditional rustic texture."
                }
            ]}
        />
    );
}
