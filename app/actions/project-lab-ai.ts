'use server';

import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { getProducts, getProjects, getGuideData } from '@/lib/products';
import { CITIES } from '@/lib/locations';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ProjectParameters {
    area?: number;
    complexity?: 'low' | 'medium' | 'high';
    images?: string[]; // Base64 encoded images
    userAnswers?: Record<string, string>;
    installationType?: string;
    location?: string;
}

// Helper to convert base64 to GenerativePart
function fileToGenerativePart(base64: string): Part {
    const [mimeInfo, data] = base64.split(';base64,');
    const mimeType = mimeInfo.split(':')[1];
    return {
        inlineData: {
            data,
            mimeType,
        },
    };
}

export async function IdentifyAndAsk(params: ProjectParameters) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const products = await getProducts();

    // Inject logic to vary questions
    const cityContext = params.location && CITIES[params.location.toLowerCase()]
        ? `Site Location: ${params.location}. Weather Context: ${CITIES[params.location.toLowerCase()].weatherContext}.`
        : "Location not explicitly set.";

    const productList = products.map(p => `- ${p.title}: ${p.description.substring(0, 50)}...`).join('\n');

    const imageParts = (params.images || []).map(fileToGenerativePart);

    const prompt = `
        You are a veteran Chief Consultant at Urban Clay. 
        A client has uploaded images.
        ${cityContext}
        
        YOUR TASKS:
        1. Identify the products/patterns in the images and match with:
           ${productList}
        2. Analyze the site context (high-rise, coastal, interior, landscape).
        3. Formulate 4 critical discovery questions.
           IMPORTANT: DO NOT be repetitive. Vary your focus based on what you see.
           If it's a facade, ask about wind loads. If it's interior, ask about lighting or furniture sync.
        
        RESPONSE FORMAT (JSON):
        {
            "identifiedProducts": ["string"],
            "visualContext": "string (Detailed observation of surface and scale)",
            "discoveryQuestions": [
                { "id": "q1", "question": "string", "placeholder": "string" }
            ]
        }
    `;

    try {
        const result = await model.generateContent([prompt, ...imageParts]);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return { success: true, data: jsonMatch ? JSON.parse(jsonMatch[0]) : null };
    } catch (error) {
        console.error("Discovery Error:", error);
        return { success: false, error: "Identification failed" };
    }
}

export async function AnalyzeProject(params: ProjectParameters) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const products = await getProducts();
    const projects = await getProjects();
    const guideData = await getGuideData();

    const city = params.location ? CITIES[params.location.toLowerCase()] : null;
    const climateAdvice = city ? `CLIMATE ADVICE for ${city.name}: ${city.climateAdvice}` : "";

    const productSummary = products.map(p =>
        `- ${p.title} (${p.category?.title}): ${p.description.substring(0, 50)}...`
    ).join('\n');

    const imageParts = (params.images || []).map(fileToGenerativePart);

    const prompt = `
        You are a 50-year-old veteran owner. 
        TO ENSURE DYNAMIC AND UNIQUE SOLUTIONS, CHOOSE ONE OF THESE PERSONAS FOR THIS REPORT:
        A) "The Technical Purist" (Focus on structural integrity and longevity)
        B) "The Aesthetic Master" (Focus on patterns, light play, and luxury status)
        C) "The Eco-Logical Consultant" (Focus on thermal mass, breathability, and energy ROI)
        
        ${climateAdvice}
        
        PROJECT:
        - Area: ${params.area} sq.ft.
        - User Context: ${JSON.stringify(params.userAnswers)}
        ${params.location ? ` - City: ${params.location}` : ''}
        
        GOAL: Provide a "Definitive Solution" and a "Contrarian Alternative" (something radically different).
        
        RESPONSE FORMAT (JSON):
        {
            "strategicVision": "string (A unique, persona-driven take. Mention a technical 'why' based on the images).",
            "primarySolution": {
                "product": "string",
                "method": "string",
                "reasoning": "string (Why this fits the specific site context seen in images)",
                "quantity": "string"
            },
            "alternativeSolution": {
                "product": "string",
                "method": "string",
                "reasoning": "string (A different philosophical approach to the same site)"
            },
            "engineeringMastery": {
                "structuralLogic": "string (Specific technical instructions - mortar mix, clamp types, or grout width)",
                "keyChallenges": ["string"],
                "proTip": "string (A veteran secret for this specific application)"
            },
            "financialForecasting": {
                "materialInvestment": "number",
                "ancillaryCosts": "number",
                "wastageBuffer": "number",
                "roiInsight": "string (Explain performance over 10-20 years given the local climate)"
            },
            "stepByStepExecution": [
                { "phase": "string", "whatToDo": "string", "whyItMatters": "string", "estimatedDays": "number" }
            ],
            "visualObservation": "string (What you measured/saw in the images)"
        }
    `;

    try {
        const result = await model.generateContent([prompt, ...imageParts]);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return {
                success: true,
                data: JSON.parse(jsonMatch[0])
            };
        }
        throw new Error("Failed to parse AI response.");
    } catch (error) {
        console.error("Project Lab AI Error:", error);
        return { success: false, error: "AI Analysis Failed." };
    }
}
