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
    const climateAdvice = city ? `CLIMATE ADVICE for ${city.name}: ${city.climateAdvice}` : "";

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
        
        RESPONSE FORMAT (JSON ONLY):
        {
            "strategicVision": "string",
            "primarySolution": { "product": "string", "method": "string", "reasoning": "string", "quantity": "string" },
            "alternativeSolution": { "product": "string", "method": "string", "reasoning": "string" },
            "engineeringMastery": { "structuralLogic": "string", "keyChallenges": ["string"], "proTip": "string" },
            "financialForecasting": { "materialInvestment": 0, "ancillaryCosts": 0, "wastageBuffer": 0, "roiInsight": "string" },
            "stepByStepExecution": [ { "phase": "string", "whatToDo": "string", "whyItMatters": "string", "estimatedDays": 0 } ],
            "visualObservation": "string"
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
