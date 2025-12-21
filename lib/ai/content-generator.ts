
import { generateSEOAttributes } from './seo-optimizer';

const apiKey = process.env.GEMINI_API_KEY || "";

interface BlogPrompt {
    topic: string;
    tone?: 'Professional' | 'Inspirational' | 'Technical' | 'Educational';
    targetAudience?: 'Architects' | 'Homeowners' | 'Builders';
}

interface BlogPost {
    title: string;
    slug: { current: string };
    excerpt: string;
    content: string; // Markdown/Portable Text
    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
    aiInsights: string;
}

export async function generateBlogDraft(promptData: BlogPrompt): Promise<BlogPost | null> {
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set.");
        return null;
    }
    console.log("Generating blog with API Key ending in:", apiKey.slice(-4));

    const { topic, tone = 'Educational', targetAudience = 'Architects' } = promptData;

    const systemPrompt = `
    You are an expert architectural writer for "UrbanClay", a premium terracotta tile brand in India.
    
    Task: Write a comprehensive, SEO-optimized blog post about: "${topic}".
    
    Target Audience: ${targetAudience}
    Tone: ${tone} (Premium, Knowledgeable, Trustworthy)
    
    Brand Context:
    - UrbanClay sells clear-cut, low-efflorescence wirecut bricks, cladding tiles, jaalis, and roof tiles.
    - Focus on sustainability, aesthetics, durability, and Indian architectural context.
    - Mention major cities like Mumbai, Bangalore, Delhi where relevant.

    Output Format (JSON):
    {
        "title": "A catchy, SEO-friendly H1 title",
        "slug": "url-friendly-slug",
        "excerpt": "A 2-3 sentence engaging summary for the blog card.",
        "content": "Full blog post in MARKDOWN format. Use ## for H2, ### for H3. Include a call to action at the end to check out UrbanClay products or request samples.",
        "seoKeywords": ["tag1", "tag2", "tag3"]
    }
    The content should be at least 600 words. 
    Crucial Formatting Rules:
    - Keep paragraphs SHORT (max 3-4 lines). Big blocks of text are banned.
    - Use an "Editorial" style: Elegant, sophisticated, yet accessible.
    - Focus on "Immersive Storytelling" - describing textures, light, and feeling.
    - Structure with clear H2 and H3 headings.
    `;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }],
                    generationConfig: { temperature: 0.8, maxOutputTokens: 4000 }
                })
            }
        );

        if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);

        const data = await response.json();

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("Gemini Content Gen: No text returned", data);
            return null;
        }

        // Robust JSON Extraction
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');

        if (start === -1 || end === -1) {
            console.error("Gemini Content Gen: No JSON found in response", text);
            return null;
        }

        const jsonString = text.substring(start, end + 1);
        let jsonResult;

        try {
            jsonResult = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("Gemini Content Gen: JSON Parse Failed", jsonString);
            // Try to clean common issues like trailing commas or newlines in strings
            try {
                // Very basic cleanup attempt
                const cleaned = jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
                jsonResult = JSON.parse(cleaned);
            } catch (retryError) {
                return null;
            }
        }

        // Generate specific SEO metadata using our existing robust tool
        const seoData = await generateSEOAttributes({
            title: jsonResult.title,
            description: jsonResult.excerpt,
            currentTags: jsonResult.seoKeywords
        });

        return {
            title: jsonResult.title,
            slug: { current: jsonResult.slug },
            excerpt: jsonResult.excerpt,
            content: jsonResult.content,
            seo: seoData || {
                metaTitle: jsonResult.title,
                metaDescription: jsonResult.excerpt,
                keywords: jsonResult.seoKeywords,
                aiInsights: "Generated from blog content"
            },
            aiInsights: `Generated based on topic: ${topic} for ${targetAudience}.`
        };

    } catch (error) {
        console.error("Blog Generation Error:", error);
        return null;
    }
}
