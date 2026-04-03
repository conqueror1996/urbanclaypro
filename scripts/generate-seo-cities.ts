import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-11-28',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
});

const CITIES = [
    { name: "Mumbai", region: "West", weather: "Humid Coastal", climate: "Mumbai's high humidity and coastal salt-air require zero-efflorescence, low-water-absorption clay products. Our high-fired terracotta easily withstands Mumbai monsoons without fungal growth.", areas: ["Bandra", "Andheri", "South Mumbai", "Juhu", "Powai"] },
    { name: "Bangalore", region: "South", weather: "Moderate", climate: "For Bangalore's mild, pleasant weather and occasional heavy showers, our terracotta rainscreens prevent moisture buildup while maintaining the city's signature earthy aesthetic.", areas: ["Koramangala", "Indiranagar", "Whitefield", "Jayanagar", "HSR Layout"] },
    { name: "Delhi", region: "North", weather: "Extreme Heat & Cold", climate: "Delhi experiences intense summer heat and cold winters. Terracotta's natural thermal mass acts as an aggressive insulation buffer, reducing HVAC costs drastically for NCR projects.", areas: ["South Delhi", "Vasant Vihar", "Def Col", "Gurgaon", "Noida"] },
    { name: "Hyderabad", region: "South", weather: "Hot Dry", climate: "Hyderabad's dry heat demands materials that stay cool. Our ventilated terracotta panels create a continuous airflow cavity, naturally cooling the building envelope.", areas: ["Jubilee Hills", "Banjara Hills", "HITEC City", "Gachibowli", "Madhapur"] },
    { name: "Pune", region: "West", weather: "Moderate", climate: "Pune's seasonal shifts and rapid urban development are perfectly countered by the thermal efficiency and rapid dry-installation of our engineered clay tiles.", areas: ["Koregaon Park", "Kalyani Nagar", "Baner", "Viman Nagar", "Aundh"] },
    { name: "Chennai", region: "South", weather: "Hot & Humid Coastal", climate: "Chennai's intense coastal humidity and aggressive sea-breeze require highly durable exterior facades. Our salt-free baked clay prevents white staining and resists coastal degradation.", areas: ["Adyar", "Besant Nagar", "ECR", "Anna Nagar", "Boat Club"] },
    { name: "Ahmedabad", region: "West", weather: "Dry & Extreme Heat", climate: "Ahmedabad's extreme summer temperatures are mitigated directly by double-skin terracotta facades, shading the structural wall and significantly cooling the interior.", areas: ["Satellite", "Bodakdev", "Thaltej", "Navrangpura", "SG Highway"] },
    { name: "Kolkata", region: "East", weather: "Tropical Wet", climate: "To combat Kolkata's heavy monsoon rains and high humidity, our zero-water-absorption clay tiles offer complete protection against moss and water stagnation.", areas: ["Alipore", "Salt Lake", "New Town", "Ballygunge", "Park Street"] },
    { name: "Chandigarh", region: "North", weather: "Extreme Shifts", climate: "Respecting Le Corbusier's architectural heritage, our raw exposed bricks and precision terracotta panels fit perfectly into Chandigarh's modernist context while handling extreme seasonal shifts.", areas: ["Sector 9", "Sector 8", "Sector 5", "Mohali", "Panchkula"] },
    { name: "Kochi", region: "South", weather: "Tropical Monsoon", climate: "Designed for heavy monsoon regions like Kerala, our terracotta is fired to extreme temperatures to ensure absolute structural integrity, keeping Kochi homes dry and naturally cooled.", areas: ["Fort Kochi", "Panampilly Nagar", "Edappally", "Kakkanad", "Marine Drive"] },
    { name: "Goa", region: "West", weather: "Tropical Coastal", climate: "Our artisanal clay products perfectly match Goa's relaxed, earthy architectural styling while providing the commercial-grade durability required to withstand corrosive sea air.", areas: ["Assagao", "Porvorim", "Panjim", "Dona Paula", "Candolim"] },
    { name: "Jaipur", region: "North", weather: "Semi-Arid", climate: "Matching the rich heritage of Rajasthan, our exposed brick and terracotta Jaalis capture traditional ventilation techniques while offering modern precision for Jaipur's harsh sun.", areas: ["C-Scheme", "Civil Lines", "Malviya Nagar", "Vaishali Nagar", "Mansarovar"] },
];

async function run() {
    console.log("Starting UrbanClay Mass Local SEO City Generation...");
    for (const city of CITIES) {
        const slugStr = city.name.toLowerCase().replace(/\s+/g, '-');
        
        const doc = {
            _type: 'cityPage',
            name: city.name,
            slug: { _type: 'slug', current: slugStr },
            region: city.region,
            metaTitle: `Premium Terracotta Tiles & Facades in ${city.name} | UrbanClay`,
            metaDescription: `Discover architectural-grade terracotta tiles, flexible brick cladding, and jali panels in ${city.name}. Engineered for ${city.weather} Indian climates. Pan-India delivery.`,
            heroTitle: 'Premium Terracotta Facades in',
            heroSubtitle: `Elevate your architectural vision with UrbanClay's precision-engineered clay products. Trusted by leading architects across ${city.name}.`,
            climateAdvice: city.climate,
            weatherContext: city.weather,
            deliveryTime: '2-4 Days via Express Freight',
            areasServed: city.areas,
            popularProducts: ['Flexible Brick Tiles', 'Exposed Bricks', 'Terracotta Rainscreens', 'Jaali Blocks'],
            richContent: `<h2>Transforming ${city.name} Architecture with High-Performance Terracotta</h2>\n<p>As modern architecture in ${city.name} evolves, the demand for sustainable, thermally efficient, and aesthetically timeless materials is at an all-time high. UrbanClay provides ${city.name}'s leading architects and developers with world-class, precision-engineered terracotta facade systems, flexible brick tiles, and authentic exposed masonry.</p>\n<h3>Why ${city.name} Architects Specify UrbanClay</h3>\n<p>Our materials are not just decorative; they are performance-driven. Whether you are building a commercial high-rise in ${city.areas[0]} or a luxury bespoke villa in ${city.areas[1]}, our facades offer unmatched thermal insulation, zero-efflorescence (salt-free) aging, and A1 fire-proof certification.</p>`,
            faq: [
                {
                    _key: Math.random().toString(36).substring(7),
                    question: `Do you deliver custom terracotta directly to ${city.name} sites?`,
                    answer: `Yes! We provide direct factory-to-site delivery anywhere in ${city.name}, including ${city.areas.join(', ')}.`
                },
                {
                    _key: Math.random().toString(36).substring(7),
                    question: `Can UrbanClay products withstand ${city.name}'s weather?`,
                    answer: `Absolutely. ${city.climate}`
                }
            ]
        };
        
        try {
            console.log(`Pushing SEO Page to Sanity: ${city.name}...`);
            await client.createOrReplace({ _id: `city-${slugStr}`, ...doc });
        } catch (e) {
            console.error(`Failed to push ${city.name}:`, e);
        }
    }
    console.log("SUCCESS! All Hyper-Local SEO Pages generated.");
}

run();
