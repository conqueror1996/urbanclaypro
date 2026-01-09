
interface FAQ {
    question: string;
    answer: string;
}

export function getCategoryFaqs(category: string, productName?: string): FAQ[] {
    const name = productName || category;

    const generalFaqs: FAQ[] = [
        {
            question: `Do you deliver ${category} across India?`,
            answer: `Yes, UrbanClay is a leading manufacturer and exporter providing pan-India delivery for all our ${category} products. We serve major construction hubs including Mumbai, Delhi, Bangalore, Pune, Hyderabad, and Chennai with secure logistics.`
        },
        {
            question: `Can I get a sample of ${name}?`,
            answer: `Absolutely! We offer sample kits for our premium ${category} range, including Facing Bricks, Cladding Tiles, and Clay Pavers. Order directly through the website to check the texture and color consistency before placing a bulk order.`
        },
        {
            question: `Why choose UrbanClay for ${category}?`,
            answer: `UrbanClay is India's trusted brand for sustainable, low-efflorescence architectural terracotta. Our ${category} products are precision wire-cut or hand-molded, complying with international quality standards, and are the first choice for eco-conscious architects.`
        }
    ];

    const categorySpecific: Record<string, FAQ[]> = {
        'terracotta-jaali': [
            {
                question: "Are terracotta jaalis durable for exterior use?",
                answer: "Yes, our terracotta jaalis are high-fired at 1000°C+, making them weather-resistant and ideal for exterior facades, partition walls, and passive cooling screens in tropical Indian climates."
            },
            {
                question: "How do I install jaali blocks?",
                answer: "Jaali blocks are installed using high-grade adhesive or cement mortar. For heights above 8 feet, we recommend internal reinforcement using SS rods. We provide detailed installation specifications for architects and contractors."
            }
        ],
        'exposed-bricks': [
            {
                question: "What is the benefit of wirecut bricks over normal bricks?",
                answer: "Wirecut bricks offer superior compressive strength, sharp edges for modern aesthetics, and significantly lower efflorescence (white salt deposits) compared to traditional table-molded bricks. They are perfect for exposed masonry facades."
            },
            {
                question: "Do you offer Facing Bricks in different colors?",
                answer: "Yes, our range of Facing Bricks includes classic Red, Chocolate, Beige, and Grey tones, achieved through natural clay firing techniques without artificial pigments."
            }
        ],
        'brick-wall-tiles': [
            {
                question: "Can these brick tiles be installed on existing painted walls?",
                answer: "Yes, our thin brick cladding tiles can be installed on existing walls. We recommend mechanically roughening the surface or using a high-polymer tile adhesive for a permanent bond, transforming your interior into an industrial loft style."
            }
        ],
        'floor-tiles': [
            {
                question: "Are these terracotta floor tiles slip-resistant?",
                answer: "Yes, our Terracotta Floor Tiles and Clay Pavers feature a natural earthen texture that provides an R10 to R11 slip resistance rating, making them safe for outdoor walkways, pool decks, and heritage courtyards."
            }
        ],
        'roof-tiles': [
            {
                question: "Are clay roof tiles better than concrete tiles?",
                answer: "Clay roof tiles are superior in thermal insulation, reducing indoor temperatures significantly compared to concrete. They are also color-fast, meaning they won't fade over time, and offer a timeless aesthetic for sloping roofs."
            }
        ],
        'handmade-bricks': [
            {
                question: "How are handmade bricks different from machine-made ones?",
                answer: "Handmade bricks are individually molded by artisans, resulting in unique creases, soft edges, and slight variations that create a rich, 'antique' texture. Machine-made bricks are uniform and precise. Handmade bricks are preferred for heritage restoration and luxury rustic homes."
            }
        ]
    };

    const slug = category.toLowerCase().replace(/ /g, '-');
    return [...(categorySpecific[slug] || []), ...generalFaqs];
}
