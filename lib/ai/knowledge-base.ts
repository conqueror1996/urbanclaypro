
export interface ProductIntelligence {
    keywords: string[];
    category: 'Jali' | 'Brick' | 'Cladding' | 'Roofing' | 'Flooring' | 'Louver' | 'General';
    usp: string; // The "Marketing Hook"
    inspectionTips: string[]; // Specific things for the client to look at
    technicalNote: string; // A "nerdy" fact to establish authority
    vibe: string; // The artistic tone to use
}

export const KNOWLEDGE_BASE: ProductIntelligence[] = [
    {
        keywords: ['jali', 'screen', 'breeze', 'perforated', 'camp', 'petal', 'triangle'],
        category: 'Jali',
        usp: "creates dynamic light patterns and passive cooling",
        inspectionTips: [
            "Check the internal edges – clean cuts ensure sharp shadow lines.",
            "Observe the surface smoothness – high-quality firing leaves a refined, non-powdery finish."
        ],
        technicalNote: "Our Jali blocks are fired at >1000°C for strictly low water absorption (<12%), ensuring they won't degrade in monsoon rains.",
        vibe: "Sculptural light and breathing walls."
    },
    {
        keywords: ['brick', 'wirecut', 'solid', 'block', 'exposed'],
        category: 'Brick',
        usp: "timeless strength with a distinct wire-cut texture",
        inspectionTips: [
            "Perform the 'Click Test': Tap two bricks together. A sharp metallic ring confirms high-density firing.",
            "Feel the texture. It should be earthy and grippy, not chalky."
        ],
        technicalNote: "High thermal mass helps regulate indoor temperature swings.",
        vibe: "Honest, load-bearing authenticity."
    },
    {
        keywords: ['cladding', 'tile', 'slip', 'veneer', 'facade'],
        category: 'Cladding',
        usp: "lightweight protection that ages gracefully",
        inspectionTips: [
            "Flip it over and check the 'dovetail grooves' on the back – these ensure a permanent mechanical lock with your wall.",
            "Look at the color variation. Subtle shifts are intentional and proof of natural kiln firing, not a defect."
        ],
        technicalNote: "At ~18mm thickness, these provide the aesthetic of full brickwork without the structural dead load.",
        vibe: "A protective skin of fired earth."
    },
    {
        keywords: ['louver', 'baguette', 'fin'],
        category: 'Louver',
        usp: "sleek solar control",
        inspectionTips: [
            "Check the straightness of the profile. Linear precision is key for long facade spans.",
            "Inspect the mounting holes (if visible) for consistency."
        ],
        technicalNote: "Designed to deflect 60% of solar heat gain before it hits the glass.",
        vibe: "Modern geometric precision."
    },
    {
        keywords: ['roof', 'tile', 'mangalore'],
        category: 'Roofing',
        usp: "superior waterproofing and thermal insulation",
        inspectionTips: [
            "Check the interlocking channels. They should fit snugly to prevent water ingress.",
            "Tap to check for sound – a dull thud might mean a crack."
        ],
        technicalNote: "Clay roofing naturally reduces attic temperatures by up to 5°C compared to concrete.",
        vibe: "The classic shelter overhead."
    },
    {
        keywords: ['floor', 'paver'],
        category: 'Flooring',
        usp: "cool-to-touch comfort",
        inspectionTips: [
            "Walk on it barefoot if possible (or rub connection). It should feel smooth but not slippery.",
            "Check edge thickness consistency for level laying."
        ],
        technicalNote: "High thermal inertia keeps floors cool in summer and warm in winter.",
        vibe: "Grounding and tactile."
    }
];

export function getExpertInsights(sampleItems: string[]): string {
    const items = sampleItems.map(i => i.toLowerCase());
    let combinedContext = "";
    const categoriesCovered = new Set<string>();

    // Scan for matches
    for (const item of items) {
        // Find best matching category
        const match = KNOWLEDGE_BASE.find(entry =>
            entry.keywords.some(k => item.includes(k))
        );

        if (match && !categoriesCovered.has(match.category)) {
            // Build a rich context block for this category
            combinedContext += `\n[Product: ${match.category} ("${item}")]\n`;
            combinedContext += `- USP to Highlight: ${match.usp}\n`;
            combinedContext += `- Technical Authority Fact: ${match.technicalNote}\n`;
            combinedContext += `- Vibe/Tone: ${match.vibe}\n`;
            combinedContext += `- Specific Inspection Instruction to Client: "${match.inspectionTips[0]}"\n`;

            categoriesCovered.add(match.category);
        }
    }

    if (!combinedContext) {
        // Facback for general terracotta
        combinedContext += `\n[Product: General Terracotta]\n`;
        combinedContext += `- USP: Natural, sustainable, and non-fading.\n`;
        combinedContext += `- Inspection: Check for consistent acoustic 'ring' and natural earthy texture.\n`;
    }

    return combinedContext;
}
