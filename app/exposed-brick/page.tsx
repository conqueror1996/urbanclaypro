import { Metadata } from 'next';
import { getProducts, getPillarHeroImage } from '@/lib/products';
import PillarPageTemplate from '@/components/PillarPageTemplate';

export const metadata: Metadata = {
    title: "Exposed Brick Wall & Facades | Authentic Wirecut Bricks India",
    description: "Discover classic and contemporary exposed brick textures. UrbanClay provides high-strength wirecut clay bricks engineered for structural and aesthetic excellence.",
    alternates: { canonical: 'https://claytile.in/exposed-brick' }
};

export default async function ExposedBrickPillar() {
    const products = await getProducts();
    const heroImage = await getPillarHeroImage('exposed-bricks', 'exposed-brick') || "/images/products/wirecut-texture.jpg";
    const brickProducts = products.filter(p => p.category?.slug === 'exposed-bricks' || p.category?.slug === 'exposed-brick' || (p.title.toLowerCase().includes('brick') && !p.title.toLowerCase().includes('tile') && !p.title.toLowerCase().includes('flexible') && !p.title.toLowerCase().includes('handmade')));

    return (
        <PillarPageTemplate
            title="Exposed Brick"
            subtitle="The Architecture of Authenticity"
            description="Nothing matches the warmth, character, and timeless appeal of an authentic exposed brick wall. Our structural wirecut and facing bricks are naturally resistant to fading, boasting near-zero efflorescence and unparalleled compressive strength."
            heroImage={heroImage}
            keyword="Exposed Brick"
            products={brickProducts}
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
