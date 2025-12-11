import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

interface ProductContext {
    title: string;
    description: string;
    currentTags?: string[];
}

export async function generateSEOAttributes(product: ProductContext) {
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set");
        return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Get current date for "market trends" context
    const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const prompt = `
    You are an expert SEO Specialist for a premium architectural terracotta tile brand called "UrbanClay".
    Today is ${today}.
    
    Task: Analyze and optimize the SEO metadata for the product below.
    
    Product: "${product.title}"
    Context/Description: "${product.description}"
    Current Keywords: "${product.currentTags?.join(", ") || "None"}"
    
    STRICT GOOGLE COMPLIANCE RULES:
    1. Relevance is King: Do NOT add keywords for materials (like "marble" or "granite") if the product is Terracotta/Clay. This triggers penalties.
    2. No Keyword Stuffing: The description must read naturally to a human.
    3. Accuracy: Do not invent features not present in the description.
    4. Market Trends: subtly incorporate current architectural terms (e.g. "sustainable", "earthy", "biophilic") ONLY if they truly apply to this product.
    
    Generate:
    1. A Meta Title (max 60 chars): Compelling and descriptive.
    2. A Meta Description (max 160 chars): Natural sentence structure, including 1-2 primary keywords.
    3. Keywords: 5-8 highly relevant tags.
    4. AI Insight: A brief explanation of the changes.

    Respond ONLY in valid JSON format:
    {
      "metaTitle": "string",
      "metaDescription": "string",
      "keywords": ["string", "string"],
      "aiInsights": "string"
    }
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks 
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error generating SEO with Gemini:", error);
        return null;
    }
}
