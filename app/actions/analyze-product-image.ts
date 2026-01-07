'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from "openai";

const geminiKey = process.env.GEMINI_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

export async function analyzeProductImage(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file uploaded');

    const prompt = `
        You are a creative director for a luxury architectural brand called "UrbanClay".
        Analyze this product image (likely a brick, tile, or cladding material).
        
        1. **Name**: specific, expensive-sounding, and visually matching the product. 
           - Examples: "Canyon Red", "Midnight Basalt", "Sahara Sand", "Venetian Terracotta".
        2. **Tags**: 5 relevant visual tags (e.g., "Textured", "Matte", "Earthy", "Contemporary").
        3. **Dominant Color**: A hex code that represents the dominant visual color.

        Output ONLY valid JSON:
        {
            "suggestedName": "string",
            "tags": ["string"],
            "dominantColor": "#hex"
        }
    `;

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');
        let text = "";

        if (genAI) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent([
                prompt,
                { inlineData: { data: base64Image, mimeType: file.type } }
            ]);
            text = result.response.text();
        } else if (openai) {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            { type: "image_url", image_url: { url: `data:${file.type};base64,${base64Image}` } }
                        ]
                    }
                ],
                response_format: { type: "json_object" }
            });
            text = response.choices[0].message.content || "";
        } else {
            return {
                suggestedName: "Artisan Clay",
                dominantColor: "#8b4513",
                tags: ["Natural", "Premium"],
                confidence: 0.1
            };
        }

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return {
            ...data,
            confidence: 0.95
        };

    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return {
            suggestedName: "Artisan Clay",
            dominantColor: "#8b4513",
            tags: ["Natural", "Premium"],
            confidence: 0.5
        };
    }
}
