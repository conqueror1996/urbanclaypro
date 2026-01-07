
import OpenAI from "openai";
import { generateSEOAttributes } from './seo-optimizer';

const geminiKey = process.env.GEMINI_API_KEY || "";
const openaiKey = process.env.OPENAI_API_KEY || "";
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

interface BlogPrompt {
    topic: string;
    tone?: 'Professional' | 'Inspirational' | 'Technical' | 'Educational';
    targetAudience?: 'Architects' | 'Homeowners' | 'Builders';
}

interface BlogPost {
    title: string;
    slug: { current: string };
    excerpt: string;
    content: string;
    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
    aiInsights: string;
}

export async function generateBlogDraft(promptData: BlogPrompt): Promise<BlogPost | null> {
    if (!geminiKey && !openaiKey) {
        return {
            title: "Configuration Required",
            slug: { current: "config-required" },
            excerpt: "AI API Keys are missing.",
            content: "Please configure GEMINI_API_KEY or OPENAI_API_KEY to use AI replies.",
            seo: { metaTitle: "", metaDescription: "", keywords: [] },
            aiInsights: ""
        } as any;
    }

    const { topic, tone = 'Educational', targetAudience = 'Architects' } = promptData;

    const systemPrompt = `
    You are an expert architectural writer for "UrbanClay", a premium terracotta tile brand in India.
    
    Task: Write a comprehensive, SEO-optimized blog post about: "${topic}".
    Target Audience: ${targetAudience}
    Tone: ${tone} (Premium, Knowledgeable, Trustworthy)
    
    Brand Context:
    - UrbanClay sells clear-cut, low-efflorescence wirecut bricks, cladding tiles, jaalis, and roof tiles.
    - Focus on sustainability, aesthetics, durability, and Indian architectural context.

    Output Format (JSON ONLY):
    {
        "title": "A catchy, SEO-friendly H1 title",
        "slug": "url-friendly-slug",
        "excerpt": "A 2-3 sentence engaging summary for the blog card.",
        "content": "Full blog post in MARKDOWN format. Use ## for H2, ### for H3.",
        "seoKeywords": ["tag1", "tag2", "tag3"]
    }
    `;

    try {
        let text = "";
        if (geminiKey) {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
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
            text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        } else if (openai) {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: systemPrompt }],
                response_format: { type: "json_object" }
            });
            text = response.choices[0].message.content || "";
        }

        if (!text) return null;

        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        const jsonResult = JSON.parse(text.substring(start, end + 1));

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
