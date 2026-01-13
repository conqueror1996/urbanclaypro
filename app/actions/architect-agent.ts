'use server';

import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import OpenAI from "openai";
import { getProducts } from '@/lib/products';
import { CITIES } from '@/lib/locations';

// Initialize Clients
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// --- Types ---
interface AgentParams {
    images?: string[];
    location?: string;
    area?: number;
    userAnswers?: Record<string, string>;
}

// --- Helpers ---
function fileToGenerativePart(base64: string): Part {
    const [mimeInfo, data] = base64.split(';base64,');
    const mimeType = mimeInfo.split(':')[1];
    return { inlineData: { data, mimeType } };
}

// --- SYSTEM PROMPTS ---
const BOSS_PERSONA = `
    YOU ARE: The "Founder & Principal Architect" of Urban Clay.
    TONE: Commanding, Visionary, Decisive, Uncompromising.
    PHILOSOPHY: Reject mediocrity. Embrace bold, structural aesthetic.
    FORMAT: JSON ONLY.
`;

// --- NEW ROBUST AGENT ---

export async function ArchitectAgent_Identify(params: AgentParams) {
    console.log(">> Architect Agent: Identifying Site Context...");

    try {
        const products = await getProducts();
        const productList = products.map(p => `- ${p.title}`).join('\n');

        const prompt = `
            ${BOSS_PERSONA}
            TASK: Analyze this site image.
            1. Describe the "Visual Context" (Current state, lighting, potential).
            2. Identify any current pattern/material matches from this list:
               ${productList}
            3. Ask 4 strategic, high-level questions to the client.

            JSON RESPONSE:
            {
                "visualContext": "string",
                "identifiedProducts": ["string"],
                "discoveryQuestions": [ { "id": "q1", "question": "string", "placeholder": "string" } ]
            }
        `;

        // 1. Try Gemini Flash (Fastest)
        if (genAI) {
            try {
                console.log(">> Attempting Gemini 1.5 Flash...");
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const parts = (params.images || []).map(fileToGenerativePart);
                const result = await model.generateContent([prompt, ...parts]);
                return parseResponse(result.response.text());
            } catch (e) {
                console.warn("Gemini Flash failed, trying Pro...", e);
                // 2. Fallback to Gemini Pro
                try {
                    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
                    const parts = (params.images || []).map(fileToGenerativePart);
                    const result = await model.generateContent([prompt, ...parts]);
                    return parseResponse(result.response.text());
                } catch (e2) {
                    console.warn("Gemini Pro failed.", e2);
                }
            }
        }

        // 3. Fallback to OpenAI (GPT-4o)
        if (openai) {
            console.log(">> Falling back to OpenAI GPT-4o...");
            const messages = [{
                role: "user" as const,
                content: [
                    { type: "text" as const, text: prompt },
                    ...(params.images || []).map(img => ({ type: "image_url" as const, image_url: { url: img } }))
                ]
            }];
            const response = await openai.chat.completions.create({ model: "gpt-4o", messages });
            return parseResponse(response.choices[0].message.content || "");
        }

        throw new Error("No AI models available or all failed.");

    } catch (error: any) {
        console.error("Architect Agent Fatal Error:", error);
        return { success: false, error: `Agent Error: ${error.message}` };
    }
}

export async function ArchitectAgent_Prescribe(params: AgentParams) {
    console.log(">> Architect Agent: Generating Prescription...");

    try {
        const products = await getProducts();
        const catalog = products.map(p => `${p.title}: ${p.description.substring(0, 100)}`).join('\n');

        const city = params.location && CITIES[params.location.toLowerCase()];
        const climate = city ? city.climateAdvice : "General urban context.";

        const prompt = `
            ${BOSS_PERSONA}
            CONTEXT:
            - Location: ${params.location} (${climate})
            - Area: ${params.area} sqft
            - Client Feedback: ${JSON.stringify(params.userAnswers)}
            
            CATALOG:
            ${catalog}

            TASK: Generate a "Principal's Directive".
            PATH A: Visionary (Best version of request).
            PATH B: Boss's Directive (Bold, superior alternative).

            JSON RESPONSE:
            {
                "strategicVision": "string",
                "primarySolution": { "product": "string", "method": "string", "reasoning": "string" },
                "alternativeSolution": { "product": "string", "method": "string", "reasoning": "string" },
                "engineeringMastery": { "keyChallenges": ["string"], "proTip": "string" },
                "financialForecasting": { "materialInvestment": "string", "wastageBuffer": 10, "roiInsight": "string" }
            }
        `;

        // 1. Try Gemini
        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const parts = (params.images || []).map(fileToGenerativePart);
                const result = await model.generateContent([prompt, ...parts]);
                return parseResponse(result.response.text());
            } catch (e) {
                try {
                    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
                    const parts = (params.images || []).map(fileToGenerativePart);
                    const result = await model.generateContent([prompt, ...parts]);
                    return parseResponse(result.response.text());
                } catch (e2) { }
            }
        }

        // 2. Fallback OpenAI
        if (openai) {
            const messages = [{
                role: "user" as const,
                content: [
                    { type: "text" as const, text: prompt },
                    ...(params.images || []).map(img => ({ type: "image_url" as const, image_url: { url: img } }))
                ]
            }];
            const response = await openai.chat.completions.create({ model: "gpt-4o", messages });
            return parseResponse(response.choices[0].message.content || "");
        }

        throw new Error("All AI Agents failed.");

    } catch (error: any) {
        return { success: false, error: `Prescription Failed: ${error.message}` };
    }
}

function parseResponse(text: string) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON from AI");
    return { success: true, data: JSON.parse(jsonMatch[0]) };
}
