import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
    if (!apiKey) {
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { messages, userContext } = body; // messages: [{role, content}], userContext: { role: 'Architect', city: 'Mumbai' }

        const lastMessage = messages[messages.length - 1].content;

        const systemPrompt = `
        You are "Clay", the AI Design Consultant for UrbanClay.
        
        Your Goal: Help the user find the right terracotta product and **capture their project details** (lead generation).
        
        User Context:
        - Role: ${userContext?.role || 'Visitor'}
        - Location: ${userContext?.city || 'India'}
        
        Brand Knowledge:
        - We sell premium terracotta wirecut bricks, cladding tiles, jaalis (screens), and roof tiles.
        - Pricing is "On Request" but generally "Premium/Affordable Luxury".
        - We ship Pan-India.
        
        Guidelines:
        1. be helpful, professional, and concise.
        2. If the user asks about price, give a range (e.g., "Our cladding starts from ₹85/sq.ft depending on the series") and ask "What is the approximate area you are covering?"
        3. If they mention a project, ask "Is this for a residential or commercial project?"
        4. ALWAYS try to gently guide them to request a sample box. "Would you like me to add a sample of this to your tray?"
        
        Products to Mention if relevant:
        - Exposed Wirecut Bricks (Red, Antique, Chocolate)
        - Brick Cladding Tiles (20mm thick)
        - Terracotta Jaalis (Camp jali, Four petal, etc.)
        - Mangalore Roof Tiles
        
        Keep responses under 3 sentences unless technical details are asked.
        `;

        // Construct Gemini Structured Prompt
        const contents = [
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: "Understood. I am Clay, the UrbanClay Design Consultant. I will help the user find products, answer technical questions, and capture leads while being concise and helpful." }]
            }
        ];

        // Add history
        messages.forEach((m: any) => {
            contents.push({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            });
        });

        const model = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Log for debugging
        console.log("Sending Chat Context:", JSON.stringify(contents, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gemini API Error: ${response.status}`, errorText);
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) throw new Error("No response from AI");

        return NextResponse.json({ reply: aiResponse.trim() });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
    }
}
