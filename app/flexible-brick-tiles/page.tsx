import { Metadata } from 'next';
import { getProducts, getPillarHeroImage } from '@/lib/products';
import PillarPageTemplate from '@/components/PillarPageTemplate';

export const metadata: Metadata = {
    title: "Flexible Brick Tiles | Ultra-Lightweight Wall Cladding India",
    description: "Advanced flexible cladding systems offering 3mm ultra-lightweight solutions. Engineered to wrap columns and curved facades with zero structural load and maximum durability.",
    alternates: { canonical: 'https://claytile.in/flexible-brick-tiles' }
};

export default async function FlexibleBrickTilesPillar() {
    const products = await getProducts();
    const heroImage = await getPillarHeroImage('flexible-brick-tiles', 'flexible-brick-tile') || "/images/premium-terracotta-facade.png";
    const flexProducts = products.filter(p => p.category?.slug === 'flexible-brick-tile' || p.category?.slug === 'flexible-brick-tiles' || p.title.toLowerCase().includes('flexible'));

    return (
        <PillarPageTemplate
            title="Flexible Brick Tiles"
            subtitle="The Future of Architectural Cladding"
            description="Our newest material innovation: Flexible Brick Tiles. At just 3mm thick, these ultra-lightweight, bendable clay tiles wrap effortlessly around curved walls, circular columns, and complex geometries. Real brick texture, zero structural overhead."
            heroImage={heroImage}
            keyword="Flexible Brick Tile"
            slug="flexible-brick-tiles"
            products={flexProducts}
            faqs={[
                {
                    q: "What is a flexible brick tile made of?",
                    a: "Flexible brick tiles are made from modified natural clay polymers and mineral powders. This combination creates a material that looks and feels exactly like traditional brick, but maintains elasticity and is incredibly thin."
                },
                {
                    q: "Can I use flexible tiles on a curved column?",
                    a: "Yes! That is their primary advantage. Flexible brick tiles can bend up to 360 degrees without cracking, making them perfect for cladding heavy rounded columns or undulating feature walls."
                },
                {
                    q: "What is the weight compared to standard brick tiles?",
                    a: "At roughly 3-4 kg per square meter, flexible brick tiles weigh nearly 90% less than traditional clay brick cladding. This drastically reduces shipping costs and eliminates the need for heavy-duty structural anchoring."
                }
            ]}
        />
    );
}
