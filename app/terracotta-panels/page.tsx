import { Metadata } from 'next';
import { getProducts, getPillarHeroImage, getPillarToolkitImage, getProjectsByCategory } from '@/lib/products';
import { getJournalPosts } from '@/lib/journal';
import PillarPageTemplate from '@/components/PillarPageTemplate';

export const metadata: Metadata = {
    title: "Large Format Terracotta Rainscreen Cladding India | UrbanClay",
    description: "High-performance large format terracotta panels and ventilated facade systems. Engineered for zero-failure thermal insulation and A1 fire-rated weather resistance in Indian climates.",
    keywords: "large format terracotta rainscreen cladding india, terracotta facade panels price module, ventilated terracotta facade systems, A1 fire rated ceramic facades, UrbanClay",
    alternates: { canonical: 'https://claytile.in/terracotta-panels' }
};

export default async function TerracottaPanelsPillar() {
    const [products, heroImage, specifierToolkitImage, projects, allJournals] = await Promise.all([
        getProducts(),
        getPillarHeroImage('terracotta-panels', 'terracotta-panel').then(img => img || "/images/failure-free-facade.jpg"),
        getPillarToolkitImage('terracotta-panels', 'terracotta-panel'),
        getProjectsByCategory('terracotta-panels'),
        getJournalPosts(),
    ]);

    // Keep top 3 most recent journal articles to build topical authority
    const panelJournals = allJournals.slice(0, 3);

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
            title="India’s Most Engineered Terracotta Facade System"
            subtitle="Designed for architects who refuse site failures."
            description="India’s fastest-install rainscreen system. 3x faster than brick, 40% lighter structural load, and engineered for zero-failure performance. The ultimate high-rise facade."
            heroImage={heroImage}
            specifierToolkitImage={specifierToolkitImage}
            keyword="Terracotta Panel"
            slug="terracotta-panels"
            products={panelProducts}
            projects={projects}
            journals={panelJournals}
            metrics={[
                { label: "Fire Rating", val: "Non-Combustible (A1)", detail: "ASTM E84 Tested" },
                { label: "Durability", val: "100+ Years", detail: "Zero-Fade Tech" },
                { label: "HVAC Energy", val: "30% Reduction", detail: "Ventilated Facade" },
                { label: "Installation", val: "Mechanical Dry Fix", detail: "Z-Clip System" }
            ]}
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
