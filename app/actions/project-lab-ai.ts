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
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
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
    } catch (error: any) {
        console.error("Discovery Error:", error);
        return { success: false, error: `Identification failed: ${error.message}` };
    }
}

export async function AnalyzeProject(params: ProjectParameters) {
    if (!genAI && !openai) {
        return { success: false, error: "Configuration Error: Missing API Keys." };
    }

    const allProducts = await getProducts();
    const city = params.location ? CITIES[params.location.toLowerCase()] : null;
    const climateAdvice = city ? `\nCLIMATE INTELLIGENCE for ${city.name}: ${city.climateAdvice}` : "";

    // 1. Contextualize the Product Catalog (Extremely Detailed for Pro model)
    const deepCatalog = allProducts.map(p => `
        PRODUCT: ${p.title}
        - SKU: ${p.sku || 'N/A'}
        - Specs: ${p.specs || 'N/A'}
        - Resources: ${JSON.stringify(p.resources)}
    `).join('\n');

    const prompt = `
        ACT AS: The Chief Engineering Lead & Founder of Urban Clay.
        MISSION: To provide a 100% TRUSTWORTHY ARCHITECTURAL DIRECTIVE.
        Tone: DATA-DRIVEN, RIGOROUS, and STRUCTURALLY ABSOLUTE.
        
        CRITICAL RULES FOR TRUST:
        1. DO NOT suggest products without explaining their structural compatibility with the project area (${params.area} sq.ft).
        2. Reference specific "Field Evidence" (projects) if you know of similar applications.
        3. Break down the engineering requirements into "Non-Negotiables".
        4. If the location is ${params.location || 'unknown'}, account for humidity, thermal expansion, and coastal wind-loads.
        
        CONTEXT:
        ${climateAdvice}
        - Coverage Area: ${params.area} sq.ft.
        - User Constraints: ${JSON.stringify(params.userAnswers)}
        
        AVAILABLE CATALOG (DO NOT ONLY CHOOSE POPULAR ITEMS. Analyze the site and choose the MOST AUTHENTIC fit):
        ${deepCatalog}
        
        RESPONSE FORMAT (JSON ONLY):
        {
            "strategicVision": "The core architectural rationale.",
            "visualObservation": "Technical critique of site imagery.",
            "visualPlanPrompt": "A highly detailed descriptive prompt for a 3D architectural visualization of this specific project using the primary product on the provided site.",
            "primarySolution": { 
                "product": "EXACT PRODUCT NAME", 
                "method": "Installation System", 
                "reasoning": "Architectural justification. Mention why this beats other options in the catalog.",
                "quantity": "Precise estimate",
                "technicalResources": { "tds": "URL to PDF", "slug": "product-slug" }
            },
            "fieldEvidence": [
                { "project": "Project Name", "location": "Location", "result": "Benefit observed" }
            ],
            "engineeringMastery": { 
                "structuralLogic": "The non-negotiable structural requirements.", 
                "keyChallenges": ["Challenge 1", "Challenge 2"], 
                "complianceNotes": "Statement on ASTM/ISO compliance for this product."
            },
            "financialForecasting": { 
                "materialInvestment": number, 
                "ancillaryCosts": number, 
                "wastageBuffer": number, 
                "roiInsight": "Long-term valuation."
            },
            "implementationPlan": [
                { "phase": "Preparation", "tasks": ["Task 1", "Task 2"], "tools": ["Tool 1"] },
                { "phase": "Installation", "tasks": ["Task 1", "Task 2"], "tools": ["Tool 1"] },
                { "phase": "Finishing", "tasks": ["Task 1", "Task 2"], "tools": ["Tool 1"] }
            ],
            "stepByStepExecution": [ 
                { "phase": "Phase", "whatToDo": "Action", "whyItMatters": "Rationale", "estimatedDays": number } 
            ],
            "visualOverlays": [
                { "type": "marker", "x": number, "y": number, "label": "string", "note": "string" }
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
            const response = await (openai as any).chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: [{ type: "text", text: prompt }, ...(params.images || []).map(img => ({ type: "image_url", image_url: { url: img } }))] }],
            });
            text = response.choices[0].message.content || "";
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            
            // Enrich with real links from Sanity
            const recommendedProduct = allProducts.find(p => p.title === data.primarySolution.product);
            if (recommendedProduct) {
                data.primarySolution.technicalResources = {
                    tds: recommendedProduct.resources?.technicalSheets?.[0]?.fileUrl,
                    slug: recommendedProduct.slug
                };
            }
            return { success: true, data };
        }
        throw new Error("Failed to parse directive.");
    } catch (error: any) {
        console.error("Architect Trust Error:", error);
        return { success: false, error: `Directives Blocked: ${error.message}` };
    }
}

export async function Generate3DConcept(visualPrompt: string) {
    if (!openai) return { success: false, error: "OpenAI not configured." };

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Architectural visualization concept: ${visualPrompt}. Professional 3D render, photorealistic, cinematic lighting, ultra-high detail, architectural photography style.`,
            n: 1,
            size: "1024x1024",
            quality: "hd"
        });

        return { success: true, url: response.data?.[0]?.url || "" };
    } catch (error: any) {
        console.error("DALL-E Error:", error);
        return { success: false, error: error.message };
    }
}
