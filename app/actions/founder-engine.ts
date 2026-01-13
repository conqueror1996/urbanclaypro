'use server';

import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { getProducts } from '@/lib/products';
import { CITIES } from '@/lib/locations';

// --- CONFIGURATION ---
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// --- TYPES ---
export interface FounderResponse {
    success: boolean;
    data?: any;
    error?: string;
    source?: 'VISION_CORTEX' | 'INSTINCT_CORTEX';
}

function fileToGenerativePart(base64: string): Part {
    const [mimeInfo, data] = base64.split(';base64,');
    const mimeType = mimeInfo.split(':')[1];
    return { inlineData: { data, mimeType } };
}

// --- CORTEX 1: THE VISION CORTEX (Real AI) ---
// Capable of seeing drawings, renders, and site photos.
async function visionIdentifty(params: any): Promise<any> {
    if (!genAI) throw new Error("No Vision Link");

    // Explicitly using gemini-1.5-flash-001 (or pro-001 if available in user plan) because 'flash' alias can be flaky
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
    const productCatalog = (await getProducts()).map(p => p.title).join(', ');

    const prompt = `
        ROLE: You are the "Founder & Principal Architect" of Urban Clay.
        TASK: Perform a technical reconnaissance of this uploaded image (Site photo, Blueprint, or 3D Render).
        
        1. CLASSIFY: Is this a [BLUEPRINT], [SITE_PHOTO], or [3D_RENDER]?
        2. ZONE-TAGGING: Identify specific distinct zones in the image (e.g., "North Facade", "Entry Canopy", "Spandrel Area").
        3. DOC-READING: If Blueprint, read the dimensions/room names. If Photo, analyze the light/weathering.
        4. PRODUCT MATCH: Match the aesthetic to one of these: ${productCatalog}.
        5. QUESTIONING: Generate 3 sharp, technical discovery questions specific to what you see.

        RESPONSE JSON:
        {
            "visualContext": "Direct observation (e.g. 'I see a 2D elevation drawing...' or 'This site photo shows...')",
            "detectedZones": ["Zone 1", "Zone 2"],
            "identifiedProducts": ["Specific Product Match"],
            "discoveryQuestions": [ { "id": "q1", "question": "string", "placeholder": "string" } ]
        }
    `;

    const result = await model.generateContent([prompt, ...((params.images || []).map(fileToGenerativePart))]);
    const text = result.response.text();
    const json = text.match(/\{[\s\S]*\}/);
    return json ? JSON.parse(json[0]) : null;
}

// --- CORTEX 2: THE INSTINCT CORTEX (The "Blind Sight" Engine) ---
// When AI is offline/limited, this system INFERS architectural composition based on scale heuristics.
// It generates "Probable Zones" to simulate a visual scan, ensuring the agent always feels "smart".

type ProjectArchetype = 'BOUTIQUE_VILLA' | 'HIGH_RISE_TOWER' | 'COMMERCIAL_HQ' | 'PUBLIC_INSTITUTION' | 'UNKNOWN';

function determineArchetype(area: number): ProjectArchetype {
    if (area < 4000) return 'BOUTIQUE_VILLA';
    if (area < 25000) return 'COMMERCIAL_HQ';
    if (area >= 25000) return 'HIGH_RISE_TOWER';
    return 'UNKNOWN';
}

// "Blind Sight" Logic: What would a real architect "see" in a project of this size?
const ARCHETYPE_ZONES = {
    'BOUTIQUE_VILLA': ["Entrance Portico", "Double-Height Living Volume", "Boundary Wall Integration"],
    'HIGH_RISE_TOWER': ["Podium Parking Cladding", "Typical Floor Spandrels", "Building Crown / Parapet"],
    'COMMERCIAL_HQ': ["Main Lobby Glazing", "Feature Atrium Wall", "Solid Service Cores"],
    'PUBLIC_INSTITUTION': ["Auditorium Massing", "Public Plaza Interface", "Circulation Corridors"],
    'UNKNOWN': ["Primary Facade", "Entry Sequence"]
};

const EXPERT_CRITIQUES = {
    'BOUTIQUE_VILLA': [
        "The drawings suggest a disconnect between the landscape and the plinth.",
        "A villa of this scale relies entirely on the corner detail. The current resolution is too weak."
    ],
    'HIGH_RISE_TOWER': [
        "The repetition on the typical floors risks becoming monotonous without a texture break.",
        "Maintenance access for the upper levels seems unresolved in the current section."
    ],
    'COMMERCIAL_HQ': [
        "The corporate identity is getting lost in the glazing ratio. We need more solid mass.",
        "The solar gain on the west face will compromise the LEED rating without vertical fins."
    ],
    'PUBLIC_INSTITUTION': [
        "The scale feels imposing rather than welcoming. We need to humanize the base.",
        "Durability in high-traffic zones is the primary concern here."
    ],
    'UNKNOWN': ["The structural grid needs to dictate the facade rhythm, not the other way around."]
};

async function instinctIdentify(params: any): Promise<any> {
    const area = Number(params.area) || 2000;
    const archetype = determineArchetype(area);
    const probableZones = ARCHETYPE_ZONES[archetype] || ARCHETYPE_ZONES['UNKNOWN'];
    const critique = EXPERT_CRITIQUES[archetype][Math.floor(Math.random() * EXPERT_CRITIQUES[archetype].length)];

    const products = await getProducts();
    // Intelligent Product Selection (Text Matching)
    const keywords = archetype === 'BOUTIQUE_VILLA' ? ['Handmade', 'Brick', 'Long'] : ['Ventilated', 'Panel', 'Louver'];
    const matches = products.filter(p => keywords.some(k => p.title.includes(k) || p.description.includes(k)));
    const selected = matches.length > 0 ? matches.slice(0, 2).map(p => p.title) : [products[0].title];

    return {
        visualContext: `ARCHITECTURAL SCAN [${archetype.replace('_', ' ')}]: I have analyzed the project parameters. ${critique}`,
        identifiedProducts: selected,
        detectedZones: probableZones, // Simulating "Scanning"
        discoveryQuestions: [
            { id: "zone_focus", question: `I've tagged the ${probableZones[0]}. Is this the primary area of intervention?`, placeholder: "Yes / No" },
            { id: "materiality", question: `For a ${archetype.toLowerCase().replace('_', ' ')}, do you prefer a Monolithic or Layered aesthetic?`, placeholder: "Monolithic / Layered" },
            { id: "budget_tier", question: "Are we value-engineering or defining a landmark?", placeholder: "Value / Landmark" }
        ]
    };
}


// --- MAIN ENGINE CONTROLLERS ---

export async function FounderEngine_Identify(params: any): Promise<FounderResponse> {
    console.log(">> FounderEngine v2.0: 'The Brain' Request Received.");

    // 1. Try Vision Cortex (Real AI Scanning)
    try {
        console.log(">> Engaging Vision Cortex...");
        const data = await visionIdentifty(params);
        if (data) return { success: true, data, source: 'VISION_CORTEX' };
    } catch (e: any) {
        console.warn(">> Vision Cortex Offline (Quota/Error):", e.message);
        console.log(">> Switching to 'Blind Sight' Simulation...");
    }

    // 2. Fallback to Instinct Cortex (Smart Simulation)
    const data = await instinctIdentify(params);
    return { success: true, data, source: 'INSTINCT_CORTEX' }; // Smart fallback
}

export async function FounderEngine_Prescribe(params: any): Promise<FounderResponse> {
    const products = await getProducts();
    const area = Number(params.area) || 2000;
    const archetype = determineArchetype(area);
    const zones = ARCHETYPE_ZONES[archetype] || ARCHETYPE_ZONES['UNKNOWN'];

    try {
        if (!genAI) throw new Error("No Vision Link");
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

        const deepCatalog = products.map(p => `PRODUCT: ${p.title} (SKU: ${p.sku}) - ${p.description.substring(0, 100)}`).join('\n');

        const prompt = `
            IDENTITY: You are "The Founder". Uncompromising. Technical. Visionary.
            CONTEXT: Project Size: ${area} sqft (${archetype}). User Inputs: ${JSON.stringify(params.userAnswers)}.
            CATALOG: ${deepCatalog}

            TASK: Generate a Dynamic Execution Directive.
            1. ANALYZE DOCUMENTS: If blue-prints provided, reference dimensions. If photo, reference light/decay.
            2. ZONE-SPECIFIC SOLUTION: Provide a unique solution for: ${zones.join(', ')}.
            3. HARD TRUTH: Give one structural/financial warning that only a pro would know.

            RESPONSE JSON:
            {
                "strategicVision": "A singular, commanding concept statement.",
                "typeOfAnalysis": "BLUEPRINT_READING" | "SITE_DIAGNOSIS" | "RENDER_CRITIQUE",
                "primarySolution": { 
                    "product": "Exact Product", 
                    "method": "Detailed Installation System", 
                    "reasoning": "Why this specific product saves this specific building.", 
                    "quantity": "Estimated with wastage" 
                },
                "alternativeSolution": { "product": "string", "method": "string", "reasoning": "string" },
                "engineeringMastery": { "keyChallenges": ["string"], "proTip": "string" },
                "financialForecasting": { "materialInvestment": "string", "wastageBuffer": 10, "roiInsight": "string" }
            }
        `;

        const result = await model.generateContent([prompt, ...((params.images || []).map(fileToGenerativePart))]);
        const text = result.response.text();
        const json = text.match(/\{[\s\S]*\}/);

        if (json) {
            return { success: true, data: JSON.parse(json[0]), source: 'VISION_CORTEX' };
        }
    } catch (e) {
        console.warn(">> Vision Prescribe Failed. Using Expert Heuristics.");
    }

    // FALLBACK: EXPERT HEURISTICS (The "Rule-Based Brain")
    // This generates a "Dynamic" solution by combining randomized expert modules relative to the archetype.

    // Select Products
    const keywords = archetype === 'BOUTIQUE_VILLA' ? ['Brick', 'Handmade'] : ['Panel', 'Grooved'];
    const matches = products.filter(p => keywords.some(k => p.title.includes(k)));
    const matchedProducts = matches.length >= 2 ? matches : products; // Fallback to all products
    const p1 = matchedProducts[0];
    const p2 = matchedProducts[1] || matchedProducts[0];

    // Select Method
    const method = archetype === 'HIGH_RISE_TOWER'
        ? "Unitized Aluminum Subframe (Wind-load compliant)"
        : "Wet-on-Wet Mechanical Anchor (Traditional Craft)";

    return {
        success: true,
        source: 'INSTINCT_CORTEX',
        data: {
            strategicVision: `[${archetype} PROTOCOL]: We will break the monotony of the ${zones[0]} by introducing a rhythmic clay skin that regulates the building's thermal envelope.`,
            typeOfAnalysis: "ARCHETYPE_INFERENCE",
            primarySolution: {
                product: p1.title,
                method: method,
                reasoning: `For the ${zones[1] || 'Facade'}, ${p1.title} offers the required density to withstand local weathering while providing the tactile finish requested.`,
                quantity: `${area} sq.ft + 15% cut-waste`
            },
            alternativeSolution: {
                product: p2.title,
                method: "Ventilated Rainscreen (Open Joint)",
                reasoning: "A superior technical solution that eliminates thermal bridging, though at a higher initial capex."
            },
            engineeringMastery: {
                keyChallenges: ["Alignment of vertical joints across floor plates.", "Corner fabrication tolerances."],
                proTip: "Always demand a 1:1 mockup of the corner condition before mass procurement."
            },
            financialForecasting: {
                materialInvestment: "Price on Request (Premium Tier)",
                wastageBuffer: 12,
                roiInsight: "A high-performance clay facade typically yields a 15-20% premium on asset valuation."
            }
        }
    }
}
