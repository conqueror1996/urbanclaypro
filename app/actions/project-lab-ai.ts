'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ProjectParameters {
    area: number;
    fileMetadata?: {
        name: string;
        size: number;
        type: string;
    };
    complexity?: 'low' | 'medium' | 'high';
}

export async function AnalyzeProject(params: ProjectParameters) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
        You are an Expert Architectural Engineer and Lead Architect at Urban Clay, a premium terracotta and clay product manufacturer.
        You are analyzing a technical project upload.
        
        Project Parameters:
        - Total Coverage Area: ${params.area} sq.ft.
        - File Uploaded: ${params.fileMetadata?.name || 'Technical Blueprint'}
        - Complexity Factor: ${params.complexity || 'Standard'}
        
        Provide a detailed, professional analysis in JSON format with the following structure:
        {
            "architecturalLogic": "string (high-level expert advice on aesthetics and material selection)",
            "engineeringGuidance": "string (technical advice on structural integrity, load factors, and fixing systems)",
            "procurementDetail": [
                { "item": "string", "quantity": "string", "specification": "string" }
            ],
            "installationRoadmap": [
                { "step": "string", "details": "string", "duration": "string" }
            ],
            "completionTimeline": {
                "manufacturing": "string",
                "logistics": "string",
                "onsiteExecution": "string",
                "totalEstimatedDays": "number"
            },
            "preciseCostBreakdown": {
                "materialCost": "number",
                "structuralAdditives": "number",
                "wastageBuffer": "number",
                "logisticsEstimate": "number",
                "totalPreciseCost": "number"
            },
            "dynamicSuggestions": [
                "string (expert tip 1)",
                "string (expert tip 2)"
            ],
            "clientConsultationQuestions": [
                { "question": "string", "reason": "string (why this matters for the project)" }
            ]
        }

        Costing Logic for Urban Clay:
        - Premium Terracotta: ₹220 - ₹280 per sq.ft.
        - Structural Fixings: ₹45 per sq.ft.
        - Wastage: 5-8% based on complexity.
        - Logistics: Distance based, assume ₹15,000 baseline for large orders.
        
        Return ONLY valid JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return {
                success: true,
                data: JSON.parse(jsonMatch[0])
            };
        }
        throw new Error("Failed to parse AI response");
    } catch (error) {
        console.error("Project Lab AI Error:", error);
        return { success: false, error: "AI Analysis Failed" };
    }
}
