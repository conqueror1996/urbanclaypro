import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateCRMSmartReply(lead: any, lastInteractions: any[]) {
    if (!process.env.GEMINI_API_KEY) return "Please configure GEMINI_API_KEY to use AI replies.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are an expert B2B sales manager for UrbanClay, a premium construction materials company in India.
        Role: ${lead.role || 'Client'}
        Company: ${lead.company}
        Requirements: ${lead.requirements}
        
        Recent Interaction History:
        ${lastInteractions.map(i => `${i.date}: ${i.summary}`).join('\n')}
        
        TASK: Write a professional, personal, and persuasive WhatsApp message to follow up. 
        - Address them by name (${lead.clientName.split(' ')[0]}).
        - Solve any objections mentioned in history.
        - Focus on closing the deal or moving to the next stage (${lead.stage}).
        - Keep it under 60 words. No corporate fluff.
        - Mention UrbanClay as technical experts.
    `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Error:", error);
        return "Failed to generate AI suggestion. Please check history.";
    }
}
