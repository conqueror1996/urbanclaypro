
const apiKey = process.env.GEMINI_API_KEY || "";

interface EmailContext {
    name: string;
    product: string;
    sampleItems?: string[];
    role?: string;
}
import { getExpertInsights } from './knowledge-base';

export async function generateFollowUpEmailContent(context: EmailContext): Promise<string | null> {
    if (!apiKey) {
        console.warn("GEMINI_API_KEY missing, skipping AI email generation");
        return null;
    }

    const { name, product, sampleItems, role } = context;

    // Prepare dynamic context
    const itemsArray = sampleItems && sampleItems.length > 0 ? sampleItems : [product];
    const itemList = itemsArray.join(', ');

    // Get Deep Product Knowledge
    const productInsights = getExpertInsights(itemsArray);

    const systemPrompt = `
    You are the "Head of Customer Success" at UrbanClay, a premium terracotta brand.
    
    Task: Write the HTML body content for a follow-up email to a client named "${name}" (${role || 'Client'}) who recently received a sample box containing: "${itemList}".
    
    =========================================
    DEEP PRODUCT INTELLIGENCE (Use this to sound like an Architect/Expert):
    ${productInsights}
    =========================================
    
    Objectives:
    1. **Warm Opening:** Ask if the package arrived safely.
    2. **Showcase Expertise (The "Hook"):** Instead of generic feedback, teach the client how to judge the quality of precisely what they ordered.
       - Use the "Inspection Instruction" from the intelligence above.
       - Weave in the "Technical Authority Fact" to establish why UrbanClay is superior.
       - Match the "Vibe/Tone" (e.g., if Jali, be poetic about light; if Brick, be solid and technical).
    3. **Closing:** Keep it brief (under 150 words).
    4. **Call to Action:** Soft nudge to discuss their project requirements on WhatsApp.
    
    Output Format:
    - Return ONLY the HTML content (tags like <p>, <ul>, <strong>). 
    - Do NOT include markdown blocks (\`\`\`). 
    - Do NOT include a subject line.
    - Use <p> tags for paragraphs.
    `;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
                })
            }
        );

        if (!response.ok) {
            console.error("Gemini API Error:", response.statusText);
            return null;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) return null;

        return text.replace(/```html/g, '').replace(/```/g, '').trim();

    } catch (error) {
        console.error("AI Email Gen Error:", error);
        return null;
    }
}
