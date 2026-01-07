'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateCRMSmartReply(lead: any, lastInteractions: any[]) {
    // Re-check keys inside the action for server-side stability
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !openAIKey) {
        return "Please configure GEMINI_API_KEY or OPENAI_API_KEY to use AI replies.";
    }

    const prompt = `
        You are an expert B2B sales manager for UrbanClay, a premium construction materials company in India.
        Project: ${lead.company || 'Private Portfolio'}
        Location: ${lead.location || 'General India'}
        Context: ${lead.requirements || 'Premium stone/clay inquiry'}
        
        Recent History:
        ${lastInteractions.slice(0, 3).map(i => `- ${i.summary}`).join('\n')}
        
        TASK: Write a short, professional WhatsApp message to follow up with ${lead.clientName.split(' ')[0]}.
        Keep it under 50 words. Focus on being helpful.
    `;

    try {
        // 1. Attempt Gemini (Try multiple common model names)
        if (geminiKey) {
            try {
                const gAI = new GoogleGenerativeAI(geminiKey);
                const model = gAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
                const result = await model.generateContent(prompt);
                return result.response.text();
            } catch (geminiError: any) {
                console.warn("Gemini Flash failed, trying Pro...", geminiError.message);
                try {
                    const gAI = new GoogleGenerativeAI(geminiKey);
                    const model = gAI.getGenerativeModel({ model: "gemini-pro" });
                    const result = await model.generateContent(prompt);
                    return result.response.text();
                } catch (e) {
                    console.error("All Gemini models failed.");
                }
            }
        }

        // 2. Attempt OpenAI Fallback
        if (openAIKey) {
            try {
                const oAI = new OpenAI({ apiKey: openAIKey });
                const response = await oAI.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 150,
                });
                return response.choices[0].message.content || "Failed to generate AI suggestion.";
            } catch (openaiError: any) {
                console.error("OpenAI Fallback failed:", openaiError.message);
            }
        }

        // 3. FINAL SAFETY NET: Smart Logic-Based Template
        // This ensures the user ALWAYS gets a professional draft even with zero credits/API issues.
        const firstName = lead.clientName.split(' ')[0];
        const product = lead.requirements?.toLowerCase().includes('jaali') ? 'Jaalis' :
            lead.requirements?.toLowerCase().includes('tile') ? 'Tiles' :
                lead.requirements?.toLowerCase().includes('brick') ? 'Bricks' : 'Materials';
        const location = lead.location || 'your project site';

        return `Hi ${firstName}, checking in regarding your inquiry for UrbanClay ${product}. We've reviewed the requirements for ${location} and are ready to assist with technical specs or a formal quote. Would you like us to send over some high-res project references or schedule a brief call to finalize the details?`;

    } catch (error: any) {
        return "Thinking of the best response for you... Please try again in 30 seconds.";
    }
}
