'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function analyzeProductImage(formData: FormData) {
    if (!apiKey) {
        console.warn("GEMINI_API_KEY is not set.");
        return {
            suggestedName: "Premium Variant",
            dominantColor: "#8b4513",
            tags: ["Architecture", "Terracotta"],
            confidence: 0.1
        };
    }

    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file uploaded');
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are a creative director for a luxury architectural brand called "UrbanClay".
        Analyze this product image (likely a brick, tile, or cladding material).
        
        1. **Name**: specific, expensive-sounding, and visually matching the product. 
           - Examples: "Canyon Red", "Midnight Basalt", "Sahara Sand", "Venetian Terracotta".
           - Avoid generic names like "Red Brick". Make it sound premium.
           - Ensure it is SEO friendly (contains relevant keywords like 'Clay', 'Slab', 'Finish' if applicable, but keep it elegant).
        
        2. **Tags**: 5 relevant visual tags (e.g., "Textured", "Matte", "Earthy", "Contemporary").
        
        3. **Dominant Color**: A hex code that represents the dominant visual color.

        Output ONLY valid JSON:
        {
            "suggestedName": "string",
            "tags": ["string"],
            "dominantColor": "#hex"
        }
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return {
            ...data,
            confidence: 0.95 // AI is confident
        };

    } catch (error) {
        console.error("AI Analysis Failed:", error);
        // Fallback
        return {
            suggestedName: "Artisan Clay",
            dominantColor: "#8b4513",
            tags: ["Natural", "Premium"],
            confidence: 0.5
        };
    }
}
