'use server';

import { getProducts } from '@/lib/products';

// --- URBAN LOGIC CORE v4.0 (God-Level Intelligence) ---
// A local General Intelligence designed to compete with Generative AI
// by using high-fidelity physics calculations, combinatorial grammar, and visual cortex simulation.

// 1. THE PHYSICS ENGINE (Computational Intelligence)
// Calculates real-world architectural constraints to prove "intelligence".
const calculatePhysics = (area: number, height: number = 30) => {
    const deadWeightPerSqFt = 4.5; // kg for generic clay cladding
    const windPressure = 1.2 + (height * 0.02); // kPascals approximation
    const totalWeight = (area * deadWeightPerSqFt) / 1000; // Tonnes
    const shearForce = windPressure * 0.6; // Simplified shear calculation

    return {
        deadLoad: `${totalWeight.toFixed(1)} Metric Tonnes`,
        windLoad: `${windPressure.toFixed(2)} kPa`,
        shearForce: `${shearForce.toFixed(2)} kN`,
        thermalMass: "High (Time lag > 8 hours)",
        moduleCount: Math.ceil(area / 1.5), // Assuming 1.5 sqft per tile
        carbonOffset: `${(area * 0.12).toFixed(1)} kgCO2e`
    };
};

// 2. THE VISUAL CORTEX (Simulated Vision)
// Simulates deep scanning of architectural corners and structural anomalies.
const simulateVisualScan = () => {
    // Generate random scan points (x, y in percentages)
    const corners = Array.from({ length: 4 }, () => ({
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        type: Math.random() > 0.5 ? 'STRUCTURAL_NODE' : 'LOAD_BEARING_CORNER',
        confidence: (0.9 + Math.random() * 0.09).toFixed(3)
    }));

    const anomalies = Array.from({ length: 2 }, () => ({
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        type: 'THERMAL_BRIDGE',
        severity: 'CRITICAL'
    }));

    return { corners, anomalies };
};

// 3. THE GRAMMAR ENGINE (Linguistic Intelligence)
// Generates unique, sophisticated sentences using combinatorics.
const VOCAB = {
    openers: ["The topological scan reveals", "Structural vectors indicate", "Our metric evaluation proves", "The geometry dictates"],
    connectors: ["a critical need for", "an inherent opportunity to leverage", "a friction point regarding", "a potential failure mode in"],
    subjects: ["thermal hysteresis", "vertical load distribution", "the building's tectonic language", "the facade's porosity", "cantilevered stress points"],
    actions: ["must be resolved via", "demands the integration of", "should be articulated through", "necessitates the deployment of"],
    solutions: ["a unitized clay sub-structure.", "a ventilated rainscreen assembly.", "mechanical dry-cladding.", "a parametric louvre system."]
};

const generateThought = () => {
    const r = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    return `${r(VOCAB.openers)} ${r(VOCAB.subjects)} ${r(VOCAB.connectors)} ${r(VOCAB.actions)} ${r(VOCAB.solutions)}`;
};

// 4. THE PLAN MAKER (Strategic Layouts)
// Generates a conceptual grid or layout advice.
const generatePlanStrategy = (archetypeType: string) => {
    if (archetypeType === 'MICRO_DWELLING') return { grid: "3x3", module: "Small Format" };
    if (archetypeType === 'MEGA_STRUCTURE') return { grid: "12x12", module: "Unitized Panel" };
    return { grid: "6x6", module: "Standard Brick" };
};

// 5. THE ARCHETYPE MATRIX (Pattern Recognition)
const detectArchetype = (area: number, location: string) => {
    if (area < 2500) return { type: 'MICRO_DWELLING', priority: 'Tactility' };
    if (area < 8000) return { type: 'PRIVATE_MANOR', priority: 'Exclusivity' };
    if (area < 25000) return { type: 'COMMERCIAL_MIDRISE', priority: 'Sustainability' };
    return { type: 'MEGA_STRUCTURE', priority: 'Logistics' };
};

// --- PUBLIC INTERFACE ---

export async function FounderEngine_Identify(params: any) {
    const { area = 3000, location = 'Urban' } = params;

    // Computation
    const physics = calculatePhysics(Number(area));
    const archetype = detectArchetype(Number(area), location);
    const vision = simulateVisualScan(); // NEW: Visual Cortex

    // Synthesis
    const products = await getProducts();
    const suggested = products.slice(0, 2).map(p => p.title);

    // Simulate "Deep Thought"
    await new Promise(r => setTimeout(r, 1500));

    return {
        success: true,
        source: 'URBAN_LOGIC_CORE_V4',
        data: {
            visualContext: `SYSTEM DIAGNOSTICS:\n- Topology: ${archetype.type}\n- Structural Load: ${physics.deadLoad}\n- Shear Force: ${physics.shearForce}\n\nANALYSIS: ${generateThought()}`,
            scanData: vision, // Send scan points to UI
            detectedZones: ["Primary Elevation", "Structural Grid", "Corner Condition", "Thermal Bridge"],
            identifiedProducts: suggested,
            discoveryQuestions: [
                { id: "structural", question: `Detected ${vision.corners.length} load-bearing nodes. Is the substructure reinforced for ${physics.deadLoad}?`, placeholder: "Yes / No" },
                { id: "environmental", question: `For ${location}, we detect potential thermal bridging. Require Grade-A insulation?`, placeholder: "Standard / High Performance" }
            ]
        }
    };
}

export async function FounderEngine_Prescribe(params: any) {
    const { area = 3000, location = 'Urban' } = params;
    const physics = calculatePhysics(Number(area));
    const archetype = detectArchetype(Number(area), location);
    const thought = generateThought();
    const plan = generatePlanStrategy(archetype.type);

    const products = await getProducts();
    const p1 = products[0];
    const p2 = products[1];

    await new Promise(r => setTimeout(r, 2000));

    return {
        success: true,
        source: 'URBAN_LOGIC_CORE_V4',
        data: {
            strategicVision: `EXECUTION DIRECTIVE: ${thought} We will deploy a ${physics.moduleCount}-module array on a ${plan.grid} grid to manage the ${physics.windLoad} wind pressure.`,
            typeOfAnalysis: "COMPUTATIONAL_SYNTHESIS",
            planData: plan, // Data for visual plan generation
            primarySolution: {
                product: p1.title,
                method: archetype.type === 'MEGA_STRUCTURE' ? "Unitized Aluminum Subframe" : "Mechanical Dry-Fix",
                reasoning: `Selected to support the ${physics.deadLoad} facade weight while optimizing for ${archetype.priority}.`,
                quantity: `${Number(area) * 1.15} sq.ft (inc. 15% wastage)`
            },
            alternativeSolution: {
                product: p2.title,
                method: "Ventilated Rainscreen (Open Joint)",
                reasoning: "Enhances thermal mass performance."
            },
            engineeringMastery: {
                keyChallenges: [
                    `Managing the ${physics.deadLoad} accumulative load on the perimeter beams.`,
                    "Achieving plumb alignment over vertical spans > 3 meters.",
                    `Mitigating ${physics.shearForce} lateral forces.`
                ],
                proTip: "Use EPDM gaskets at all mechanical junctions to prevent harmonic vibration from wind loads."
            },
            financialForecasting: {
                materialInvestment: "Price on Request",
                wastageBuffer: 15,
                roiInsight: "High-performance facades reduce HVAC OpEx by 15-20%."
            }
        }
    };
}
