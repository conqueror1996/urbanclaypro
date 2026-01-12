'use server';

import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import OpenAI from "openai";
import { getProducts, getProjects, getGuideData } from '@/lib/products';
import { CITIES } from '@/lib/locations';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

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
    if (!genAI && !openai) {
        return { success: false, error: "Please configure GEMINI_API_KEY or OPENAI_API_KEY to use AI analysis." };
    }

    const products = await getProducts();
    const cityContext = params.location && CITIES[params.location.toLowerCase()]
        ? `Site Location: ${params.location}. Weather Context: ${CITIES[params.location.toLowerCase()].weatherContext}.`
        : "Location not explicitly set.";

    const productList = products.map(p => `- ${p.title}: ${p.description.substring(0, 50)}...`).join('\n');
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
        
        RESPONSE FORMAT (JSON ONLY):
        {
            "identifiedProducts": ["string"],
            "visualContext": "string (Detailed observation of surface and scale)",
            "discoveryQuestions": [
                { "id": "q1", "question": "string", "placeholder": "string" }
            ]
        }
    `;

    try {
        let text = "";
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
            const imageParts = (params.images || []).map(fileToGenerativePart);
            const result = await model.generateContent([prompt, ...imageParts]);
            text = result.response.text();
        } else if (openai) {
            const messages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        ...(params.images || []).map(img => ({
                            type: "image_url",
                            image_url: { url: img }
                        }))
                    ]
                }
            ];
            const response = await (openai as any).chat.completions.create({
                model: "gpt-4o",
                messages: messages,
            });
            text = response.choices[0].message.content || "";
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return { success: true, data: jsonMatch ? JSON.parse(jsonMatch[0]) : null };
    } catch (error) {
        console.error("Discovery Error:", error);
        return { success: false, error: "Identification failed" };
    }
}

export async function AnalyzeProject(params: ProjectParameters) {
    if (!genAI && !openai) {
        return { success: false, error: "Please configure GEMINI_API_KEY or OPENAI_API_KEY to use AI analysis." };
    }

    const products = await getProducts();
    const projects = await getProjects();
    const guideData = await getGuideData();

    const city = params.location ? CITIES[params.location.toLowerCase()] : null;
    const climateAdvice = city ? `\nCLIMATE INTELLIGENCE for ${city.name}: ${city.climateAdvice}` : "";

    // 1. Contextualize the Product Catalog (Deep Draft)
    const deepCatalog = products.map(p => `
        PRODUCT: ${p.title} (${p.category?.title})
        - SKU: ${p.sku || 'N/A'}
        - Specs: ${p.specs || 'Standard sizing available'}
        - Variants: ${p.variants?.map(v => v.name).join(', ') || 'Standard colors'}
        - Best Application: ${p.description.substring(0, 100)}...
    `).join('\n');

    const prompt = `
        ACT AS: The "Chief Facade Consultant" for UrbanClay (a premium terracotta manufacturer). 
        Your tone is: Highly Technical, Architectural, yet Elegant. You calculate loads, thermal stress, and aesthetic rhythm simultaneously.
        
        CONTEXT:
        ${climateAdvice}
        - User Area: ${params.area} sq.ft.
        - User Constraints: ${JSON.stringify(params.userAnswers)}
        ${params.location ? ` - City: ${params.location}` : ''}
        
        AVAILABLE URBANCLAY CATALOG (Use ONLY these exact product names):
        ${deepCatalog}
        
        YOUR MISSION:
        Generate a "Facade Intelligence Report" with two distinct paths:
        
        PATH A: The "Architect's Intent" (Aligns with the visual style/user answers perfectly).
        PATH B: The "Consultant's Pivot" (A technically superior or aesthetically bolder alternative they hadn't considered).
        
        RESPONSE FORMAT (JSON ONLY):
        {
            "strategicVision": "One powerful sentence defining the architectural identity of this proposal.",
            "primarySolution": { 
                "product": "EXACT PRODUCT NAME FROM CATALOG", 
                "method": "Installation System (e.g., Vertical Rainscreen on aluminum subframe)", 
                "reasoning": "Technical & Aesthetic justification (mention specific specs)", 
                "quantity": "Estimated quantity including 10% wastage" 
            },
            "alternativeSolution": { 
                "product": "EXACT PRODUCT NAME FROM CATALOG", 
                "method": "Installation System", 
                "reasoning": "Why this bold alternative solves a hidden problem (heat gain, wind load, etc.)" 
            },
            "engineeringMastery": { 
                "structuralLogic": "Comment on dead load, wind load, or subframing requirements.", 
                "keyChallenges": ["Specific challenge 1", "Specific challenge 2"], 
                "proTip": "A secret industry insight regarding this specific material application." 
            },
            "financialForecasting": { 
                "materialInvestment": "Estimated Cost Range (INR)", 
                "ancillaryCosts": "Estimated % for Subframing/Install (usually 40-60%)", 
                "wastageBuffer": 10, 
                "roiInsight": "Comment on durability/maintenance savings over 20 years." 
            },
            "stepByStepExecution": [ 
                { "phase": "Phase 1: Analysis", "whatToDo": "Wind load simulation", "whyItMatters": "Prevent fatigue failure", "estimatedDays": 5 } 
            ],
            "visualObservation": "A brief critique of the uploaded facade's current geometry."
        }
    `;

    try {
        let text = "";
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
            const imageParts = (params.images || []).map(fileToGenerativePart);
            const result = await model.generateContent([prompt, ...imageParts]);
            text = result.response.text();
        } else if (openai) {
            const messages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        ...(params.images || []).map(img => ({
                            type: "image_url",
                            image_url: { url: img }
                        }))
                    ]
                }
            ];
            const response = await (openai as any).chat.completions.create({
                model: "gpt-4o",
                messages: messages,
            });
            text = response.choices[0].message.content || "";
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return { success: true, data: JSON.parse(jsonMatch[0]) };
        }
        throw new Error("Failed to parse AI response.");
    } catch (error) {
        console.error("Project Lab AI Error:", error);
        return { success: false, error: "AI Analysis Failed." };
    }
}
