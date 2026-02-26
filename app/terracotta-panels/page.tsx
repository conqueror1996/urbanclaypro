import { Metadata } from 'next';
import { getProducts, getPillarHeroImage } from '@/lib/products';
import PillarPageTemplate from '@/components/PillarPageTemplate';

export const metadata: Metadata = {
    title: "Terracotta Panels | Premium Rain-Screen Cladding India",
    description: "God-Level large format terracotta panels for architectural rainscreen cladding. Enjoy unmatched thermal insulation and weather resistance. Made by UrbanClay India.",
    alternates: { canonical: 'https://claytile.in/terracotta-panels' }
};

export default async function TerracottaPanelsPillar() {
    const products = await getProducts();
    const heroImage = await getPillarHeroImage('terracotta-panels', 'terracotta-panel') || "/images/products/wirecut-texture.jpg";

    // Filter logic: In real-world, we'd add tags, but here we can just do broad matching or mock an array.
    const panelProducts = products.filter(p => {
        const title = p.title.toLowerCase();
        const catSlug = p.category?.slug?.toLowerCase() || '';
        const catTitle = p.category?.title?.toLowerCase() || '';

        const isMatch = title.includes('panel') || title.includes('facade') || catSlug.includes('panel') || catSlug.includes('facade') || catTitle.includes('panel') || catTitle.includes('facade');
        const isExcluded = title.includes('brick') || catSlug.includes('brick') || catTitle.includes('brick') || title.includes('jaali') || title.includes('jali') || catSlug.includes('jali');

        return isMatch && !isExcluded;
    });

    // If we only find a few, let's grab some premium variations

    return (
        <PillarPageTemplate
            title="Terracotta Panels"
            subtitle="Architectural Rainscreen Cladding Systems"
            description="Our God-Level terracotta panels are engineered for modern, high-rise, and commercial facades. Superior thermal regulation, extreme fire resistance, and precision engineering ensure a perfectly ventilated facade that withstands the harshest Indian climates."
            heroImage={heroImage}
            keyword="Terracotta Panel"
            products={panelProducts}
            faqs={[
                {
                    q: "What is a terracotta rainscreen panel?",
                    a: "A terracotta rainscreen panel is a large-format, extruded, and fired clay slab used to create a ventilated building facade. It provides superior thermal insulation while protecting the structural wall from rain and heat."
                },
                {
                    q: "Are these panels fireproof?",
                    a: "Yes! Fired at temperatures exceeding 1100°C, UrbanClay terracotta panels are completely non-combustible with an A1 fire rating."
                },
                {
                    q: "How are they installed?",
                    a: "They are typically installed using an aluminum substructure involving clips or tracks. This dry-installation method allows for easy replacement of individual panels and creates a continuous thermal break."
                }
            ]}
        />
    );
}
