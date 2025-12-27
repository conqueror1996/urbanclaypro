
interface FAQ {
    question: string;
    answer: string;
}

export function getCategoryFaqs(category: string, productName?: string): FAQ[] {
    const name = productName || category;

    const generalFaqs: FAQ[] = [
        {
            question: `Do you deliver ${category} across India?`,
            answer: `Yes, UrbanClay provides pan-India delivery for all our ${category} products, including major cities like Mumbai, Delhi, Bangalore, Pune, Hyderabad, and Chennai.`
        },
        {
            question: `Can I get a sample of ${name}?`,
            answer: `Absolutely! You can order free samples of our ${category} range directly through the website to check the texture and color consistency before placing a bulk order.`
        }
    ];

    const categorySpecific: Record<string, FAQ[]> = {
        'terracotta-jaali': [
            {
                question: "Are terracotta jaalis durable for exterior use?",
                answer: "Yes, our terracotta jaalis are high-fired and weather-resistant, making them ideal for exterior facades, partition walls, and ventilation screens in any Indian climate."
            },
            {
                question: "How do I install jaali blocks?",
                answer: "Jaali blocks are typically installed using specialized adhesive or cement mortar with internal reinforcement (SS rods) for heights above 8 feet. We provide detailed installation guides with every order."
            }
        ],
        'exposed-bricks': [
            {
                question: "What is the benefit of wirecut bricks over normal bricks?",
                answer: "Wirecut bricks offer higher precision, sharper edges, and much lower efflorescence (white salt deposits) compared to locally made table-molded bricks, ensuring a cleaner look for years."
            }
        ],
        'brick-wall-tiles': [
            {
                question: "Can these brick tiles be installed on existing painted walls?",
                answer: "Yes, thin brick tiles can be installed on existing walls provided the paint is roughened or removed to ensure a strong bond with the tile adhesive."
            }
        ],
        'floor-tiles': [
            {
                question: "Are these terracotta floor tiles slip-resistant?",
                answer: "Yes, our natural terracotta finish provides an R10 to R11 slip resistance rating, making them safe for walkways, courtyards, and wet areas like pool decks."
            }
        ]
    };

    const slug = category.toLowerCase().replace(/ /g, '-');
    return [...(categorySpecific[slug] || []), ...generalFaqs];
}
