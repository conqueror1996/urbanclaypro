import { Metadata } from 'next';
import { getProducts, getPillarHeroImage } from '@/lib/products';
import PillarPageTemplate from '@/components/PillarPageTemplate';

export const metadata: Metadata = {
    title: "Terracotta Jaali | Breathable Clay Screens India",
    description: "Discover our range of authentic terracotta jaalis. Perfect for ventilation, privacy, and architectural shading. Handcrafted clay screens for modern Indian homes.",
    alternates: { canonical: 'https://claytile.in/terracotta-jali' }
};

export default async function TerracottaJaliPillar() {
    const products = await getProducts();
    // Try both common spellings and slugs
    const heroImage = await getPillarHeroImage('terracotta-jaalis', 'terracotta-jali') || "/images/products/pressed-texture.jpg"; // Keep existing default or use a cinematic one if found

    // Filter for Jali products - Exclude Cement
    const jaliProducts = products.filter(p => {
        const isJali = p.category?.title?.toLowerCase().includes('jali') ||
            p.tag?.toLowerCase().includes('jali') ||
            p.category?.title?.toLowerCase().includes('jaali') ||
            p.tag?.toLowerCase().includes('jaali');

        const isCement = p.category?.title?.toLowerCase().includes('cement') ||
            p.tag?.toLowerCase().includes('cement') ||
            p.title.toLowerCase().includes('cement');

        return isJali && !isCement;
    });

    return (
        <PillarPageTemplate
            title="India’s Most Engineered Terracotta Screen System"
            subtitle="Designed for architects who refuse site failures."
            description="Timeless terracotta screens that balance light, privacy, and airflow. Our jaalis are handcrafted from natural clay, offering a sustainable and aesthetic solution for facades, balconies, and partitions."
            heroImage={heroImage}
            keyword="Terracotta Jali"
            slug="terracotta-jali"
            products={jaliProducts}
            faqs={[
                {
                    q: "What are the common sizes for Jali?",
                    a: "Standard sizes include 8x8x2 inches, 6x6x2 inches, and various rectangular patterns like 9x4x3 inches."
                },
                {
                    q: "Can these be used for exterior walls?",
                    a: "Yes, our terracotta jaalis are weather-resistant and designed for both interior and exterior applications, particularly for sun-shading and natural ventilation."
                },
                {
                    q: "How are they installed?",
                    a: "They are typically installed using mortar or specialized adhesives, reinforcing the structure with horizontal metal bars if the span is large."
                }
            ]}
        />
    );
}
