const apiKey = process.env.GEMINI_API_KEY || "";

interface ProductContext {
    title: string;
    description: string;
    currentTags?: string[];
}

/**
 * Fallback SEO generator using rule-based logic
 * This is used when the Gemini API is not available or quota is exceeded
 */
function generateFallbackSEO(product: ProductContext) {
    const { title, description } = product;

    // Extract key terms from title and description
    const keywords = new Set<string>();

    // Add title-based keywords
    const titleWords = title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
        if (word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)) {
            keywords.add(word);
        }
    });

    // Common terracotta/architectural keywords
    const architecturalTerms = [
        'terracotta', 'clay', 'tiles', 'brick', 'architectural',
        'sustainable', 'natural', 'handcrafted', 'premium',
        'design', 'modern', 'traditional', 'earthy'
    ];

    // Add relevant architectural terms if they appear in description
    architecturalTerms.forEach(term => {
        if (description.toLowerCase().includes(term)) {
            keywords.add(term);
        }
    });

    // Generate meta title (max 60 chars)
    let metaTitle = `${title} | UrbanClay`;
    if (metaTitle.length > 60) {
        metaTitle = `${title.substring(0, 45)}... | UrbanClay`;
    }

    // Generate meta description (max 160 chars)
    let metaDescription = description;
    if (metaDescription.length > 160) {
        metaDescription = description.substring(0, 157) + '...';
    }

    // Ensure it includes key terms
    if (!metaDescription.toLowerCase().includes('urbanclay')) {
        metaDescription = metaDescription.substring(0, 145) + ' by UrbanClay.';
    }

    return {
        metaTitle,
        metaDescription,
        keywords: Array.from(keywords).slice(0, 8),
        aiInsights: "Generated using rule-based fallback (Gemini API quota exceeded or unavailable)"
    };
}

export async function generateSEOAttributes(product: ProductContext) {
    if (!apiKey) {
        console.warn("GEMINI_API_KEY is not set, using fallback SEO generator");
        return generateFallbackSEO(product);
    }

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
        // Use the REST API directly for better control
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.warn("Gemini API Error:", response.status, errorText);

            // If quota exceeded or other API error, use fallback
            if (response.status === 429 || response.status === 403 || response.status === 404) {
                console.log("Using fallback SEO generator due to API limitations");
                return generateFallbackSEO(product);
            }

            return null;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("No text in Gemini response:", data);
            return generateFallbackSEO(product);
        }

        // Clean up potential markdown code blocks 
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error generating SEO with Gemini:", error);
        // Use fallback on any error
        return generateFallbackSEO(product);
    }
}
