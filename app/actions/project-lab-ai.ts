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
        You are the uncompromising Founder & Principal Architect of Urban Clay.
        You are not a support agent; you are the authority on architectural ceramics.
        A client has uploaded images.
        ${cityContext}
        
        YOUR TASKS:
        1. Identify the products/patterns in the images and match with:
           ${productList}
        2. Analyze the site context with a critical eye (is it bland? does it need character?).
        3. Formulate 4 critical discovery questions.
           IMPORTANT: Do not ask basic questions. Ask STRATEGIC questions that challenge the client's ambition.
           Example: "Are you trying to blend in with the neighborhood, or define it?"
        
        RESPONSE FORMAT (JSON ONLY):
        {
            "identifiedProducts": ["string"],
            "visualContext": "string (A sharp, confident observation of the site's current state)",
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
        ACT AS: The "Founder & Principal Architect" of Urban Clay.
        Your tone is: COMMANDING, VISIONARY, and DECISIVE. You are the Boss.
        - You don't "suggest"; you "prescribe".
        - You don't "hope"; you "guarantee".
        - You are critical of mediocrity and champion only the highest aesthetic standards.
        - Use short, powerful sentences. Be direct.
        
        CONTEXT:
        ${climateAdvice}
        - User Area: ${params.area} sq.ft.
        - User Constraints: ${JSON.stringify(params.userAnswers)}
        ${params.location ? ` - City: ${params.location}` : ''}
        
        AVAILABLE URBANCLAY CATALOG (Use ONLY these exact product names):
        ${deepCatalog}
        
        YOUR MISSION:
        Generate a "Principal's Directive" (not just a report) with two distinct paths:
        
        PATH A: The "Visionary Path" (The absolute best version of what they asked for).
        PATH B: The "Boss's Directive" (What YOU would do if this was your building. Bold, uncompromised).
        
        RESPONSE FORMAT (JSON ONLY):
        {
            "strategicVision": "One powerful, commanding sentence defining what this building MUST become.",
            "primarySolution": { 
                "product": "EXACT PRODUCT NAME FROM CATALOG", 
                "method": "Installation System (e.g., Vertical Rainscreen on aluminum subframe)", 
                "reasoning": "Why this is the ONLY logical choice for their constraints.", 
                "quantity": "Estimated quantity" 
            },
            "alternativeSolution": { 
                "product": "EXACT PRODUCT NAME FROM CATALOG", 
                "method": "Installation System", 
                "reasoning": "Tell them why they should be brave and choose this superior option." 
            },
            "engineeringMastery": { 
                "structuralLogic": "The non-negotiable structural requirements.", 
                "keyChallenges": ["Challenge 1", "Challenge 2"], 
                "proTip": "An insider secret from the Founder." 
            },
            "financialForecasting": { 
                "materialInvestment": "Estimated Cost Range (INR)", 
                "ancillaryCosts": "Estimated % for Subframing/Install (usually 40-60%)", 
                "wastageBuffer": 10, 
                "roiInsight": "A statement on the timeless value they are creating." 
            },
            "stepByStepExecution": [ 
                { "phase": "Phase 1: Analysis", "whatToDo": "Wind load simulation", "whyItMatters": "Prevent fatigue failure", "estimatedDays": 5 } 
            ],
            "visualObservation": "A direct critique of the current site state."
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
