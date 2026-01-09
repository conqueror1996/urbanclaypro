
import { createClient } from '@sanity/client'
import { CITIES } from '../lib/locations'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
// We likely need to load env vars from .env.local manually if running this script directly with ts-node
// But since we are in a Next.js environment, we can assume the user has the keys. 
// I will rely on the user having the env vars set or being able to run this with `sanity exec` or similar if needed. 
// Actually, `sanity/lib/write-client.ts` probably has the config.

// Let's hardcode the configuration for the script to ensure it runs standalone if needed, 
// OR better, reuse the existing client config.
// The user has a NEXT_PUBLIC_SANITY_PROJECT_ID etc in their environment.

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '22qqjddz',
    // Wait, I can see `sanity/lib/client.ts` imports. I should check that first to be safe.
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN, // This needs to be a write token.
    useCdn: false,
})

async function seedCities() {
    console.log('🌱 Top-Tier City Seeding Started...')

    if (!process.env.SANITY_API_TOKEN) {
        console.error('❌ Missing SANITY_API_TOKEN. Cannot write to Sanity.')
        return
    }

    for (const [key, city] of Object.entries(CITIES)) {
        console.log(`Processing ${city.name}...`)

        const doc = {
            _id: `city-${city.slug}`, // Deterministic ID to prevent duplicates
            _type: 'cityPage',
            name: city.name,
            slug: { _type: 'slug', current: city.slug },
            region: city.region,
            metaTitle: city.metaTitle,
            metaDescription: city.metaDescription,
            heroTitle: city.heroTitle,
            heroSubtitle: city.heroSubtitle,
            climateAdvice: city.climateAdvice,
            weatherContext: city.weatherContext,
            deliveryTime: '2-4 Days', // Default promise
            areasServed: city.areasServed,
            popularProducts: city.popularProducts,
            // We can also add default FAQs here if we wanted to dynamically generate them
            faq: [
                {
                    _type: 'faqItem',
                    _key: 'faq1',
                    question: `What is the delivery time for terracotta tiles in ${city.name}?`,
                    answer: `We deliver to ${city.name} within 2-4 days for standard stock. Custom orders may take 1-2 weeks.`
                },
                {
                    _type: 'faqItem',
                    _key: 'faq2',
                    question: `Do you have a showroom in ${city.name}?`,
                    answer: `We operate as a digital-first studio to keep costs low, but we can ship a physical sample box directly to your site or office in ${city.name} within 48 hours.`
                }
            ]
        }

        try {
            await client.createOrReplace(doc)
            console.log(`✅ Created/Updated: ${city.name}`)
        } catch (err) {
            console.error(`❌ Failed: ${city.name}`, err)
        }
    }

    console.log('✨ Seeding Complete. The Digital Empire is expanded.')
}

seedCities()
