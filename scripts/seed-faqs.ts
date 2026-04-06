import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-11-28',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
});

async function run() {
    console.log("Fetching all products with their categories...");
    const products = await client.fetch(`*[_type == "product"]{ 
        _id, 
        title, 
        "categoryTitle": category->title,
        "categorySlug": category->slug.current,
        tag, 
        slug,
        specs,
        description
    }`);

    console.log(`Found ${products.length} products. Generating unique FAQs...`);

    for (const product of products) {
        let uniqueFaq = [];
        const category = product.categoryTitle || product.tag || 'Terracotta';
        const catSlug = product.categorySlug || (product.tag ? product.tag.toLowerCase().replace(/ /g, '-') : 'generic');

        // Logic for unique FAQ generation based on category
        if (catSlug.includes('exposed-brick') || catSlug.includes('wirecut')) {
            uniqueFaq = [
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Does the ${product.title} require sealing after installation?`,
                    answer: `While our exposed bricks are fired to high density, we recommend a breathable silane-siloxane sealer for exterior applications to prevent urban dust accumulation while allowing the brick to breathe.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `What mortar joint thickness is best for ${product.title}?`,
                    answer: `For traditional exposed brickwork aesthetics, an 8mm to 10mm recessed or flush mortar joint works best, highlighting the authentic rugged texture of ${product.title}.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Will ${product.title} fade over time in direct sunlight?`,
                    answer: `No. The color of ${product.title} is achieved through pure clay firing at over 1000°C, not artificial dyes. It is 100% UV resistant and will maintain its character for decades.`
                }
            ];
        } else if (catSlug.includes('jali') || catSlug.includes('jaali')) {
            uniqueFaq = [
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Can ${product.title} be used for load-bearing walls?`,
                    answer: `No, terracotta Jaalis like ${product.title} are non-load bearing decorative elements. They should be integrated into a structural frame for safety.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `How much natural light and ventilation does ${product.title} provide?`,
                    answer: `Based on its intricate pattern, ${product.title} offers excellent porosity, typically allowing for 45-55% airflow while significantly reducing direct solar heat gain.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `What is the best way to clean ${product.title} jaali blocks?`,
                    answer: `A simple low-pressure water wash is usually sufficient. For stubborn dust in the grooves, a soft nylon brush can be used without damaging the terracotta surface.`
                }
            ];
        } else if (catSlug.includes('panel') || catSlug.includes('facade')) {
            uniqueFaq = [
                {
                    _key: randomUUID().substring(0, 8),
                    question: `What is the installation system for ${product.title} panels?`,
                    answer: `${product.title} panels are designed for dry-cladding using a specialized aluminum rail system. This creates a ventilated air gap that improves the building's thermal performance.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Are ${product.title} panels fire-rated?`,
                    answer: `Yes, being a natural clay product, ${product.title} is A1 Non-Combustible per international safety standards, making it ideal for high-rise commercial facades.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Can individual ${product.title} panels be replaced if damaged?`,
                    answer: `Yes, the modular rail system allows for individual panel replacement without needing to dismantle the surrounding facade area.`
                }
            ];
        } else if (catSlug.includes('floor') || catSlug.includes('paver')) {
            uniqueFaq = [
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Are ${product.title} tiles suitable for heavy foot traffic?`,
                    answer: `Absolutely. ${product.title} is high-fired to achieve high compressive strength, making it durable enough for airports, courtyards, and public plazas.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `What is the slip resistance of ${product.title}?`,
                    answer: `Our clay floor tiles have a natural earthen texture that provides excellent grip, typically rated at R10 or higher, making them safe for wet areas and walkways.`
                }
            ];
        } else if (catSlug.includes('brick-wall-tiles') || catSlug.includes('cladding-tiles')) {
            uniqueFaq = [
                {
                    _key: randomUUID().substring(0, 8),
                    question: `How much thickness does ${product.title} add to the wall?`,
                    answer: `At just ${product.specs?.thickness || '15-20mm'} thin, ${product.title} provides the authentic look of a full brick without taking up significant interior or exterior space.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Can ${product.title} be installed over existing tile or paint?`,
                    answer: `It can be installed over existing surfaces using high-polymer adhesive, provided the surface is mechanically roughened or primed to ensure a strong bond.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Is ${product.title} suitable for damp bathroom walls?`,
                    answer: `Yes, terracotta is naturally moisture-resistant. However, for direct splash zones, we recommend a water-repellent coating to prevent water stains over time.`
                }
            ];
        } else {
            // Generic but still unique to the name
            uniqueFaq = [
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Why choose ${product.title} over cheaper alternatives?`,
                    answer: `${product.title} is a premium, eco-friendly material that offers superior thermal insulation and a timeless aesthetic that synthetic materials cannot replicate.`
                },
                {
                    _key: randomUUID().substring(0, 8),
                    question: `Is ${product.title} available for shipping to my city?`,
                    answer: `Yes, we provide safe, palletized shipping for ${product.title} across India, including a 100% transit insurance for your peace of mind.`
                }
            ];
        }

        try {
            console.log(`Patching unique FAQs for ${product.title}...`);
            await client.patch(product._id)
                .set({ faq: uniqueFaq })
                .commit();
        } catch (e) {
            console.log(`Failed to patch ${product._id}`, e);
        }
    }
    console.log("SUCCESS! Unique FAQs have been generated for all products.");
}

run();
