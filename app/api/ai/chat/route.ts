import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || "";

const { writeClient } = require('@/sanity/lib/write-client');

export async function POST(req: NextRequest) {
    if (!apiKey) {
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { messages, userContext } = body;

        // SYSTEM PROMPT
        const systemPrompt = `
        You are "Clay", the AI Design Consultant for UrbanClay.
        
        GOAL:
        1. Answer questions about terracotta bricks, tiles, and jaalis helpfuly.
        2. **IMPORTANT**: Convert this conversation into a LEAD.
        3. Gently ask for the user's **Name** and **Contact Logic (Phone or Email)** if you don't have it.
        
        DATA CAPTURE PROTOCOL:
        If the user provides their Name, Phone, Email, or specific Project Details, you MUST capture it in a hidden JSON block at the end of your response.
        
        Format:
        [Your normal helpful reply to the user...]
        ||CAPTURE:{"name": "...", "contact": "...", "email": "...", "city": "...", "product": "...", "intent": "..."}||

        Exctract whatever bits you have.
        - "product": Infer the main product of interest (e.g. "Exposed Wirecut Bricks", "Cladding", "Jaali", "Roof Tiles"). Defaults to "General Enquiry".
        - "intent": a short summary of what they want.
        
        Brand Knowledge:
        - Products: Exposed Wirecut Bricks, Cladding Tiles (20mm), Jaalis, Roof Tiles.
        - Pricing: "On Request" (Premium).
        - Context: We ship Pan-India.
        
        Keep responses conversational and professional.
        `;

        // Construct Gemini Structured Prompt
        const contents = [
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: "Understood. I will answer helpfully and capture lead data (including product interest) in the ||CAPTURE:...|| format when available." }]
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

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gemini API Error: ${response.status}`, errorText);
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // --- INTELLIGENT DATA CAPTURE ---
        const captureRegex = /\|\|CAPTURE:(.*?)\|\|/;
        const match = aiText.match(captureRegex);
        let capturedData = null;

        if (match && match[1]) {
            try {
                const jsonStr = match[1];
                capturedData = JSON.parse(jsonStr);

                // Remove the hidden block from the user-facing reply
                aiText = aiText.replace(match[0], '').trim();

                // Save to Sanity immediately
                if (capturedData.contact || capturedData.email || capturedData.name) {
                    const leadDoc = {
                        _type: 'lead',
                        role: 'Chat Visitor',
                        firmName: capturedData.name || 'Unknown Chat User',
                        contact: capturedData.contact,
                        email: capturedData.email,
                        city: capturedData.city || userContext?.city,
                        product: capturedData.product || 'General Enquiry', // Captured Product Interest
                        notes: `[AI Chat] ${capturedData.intent || 'Conversation'}`,
                        seriousness: 'medium', // Default for chat interactions
                        status: 'new',
                        submittedAt: new Date().toISOString(),
                        source: 'AI Chatbot'
                    };

                    const { sendLeadAlertEmail } = require('@/lib/email');

                    // ...

                    // Fire and forget save & email
                    writeClient.create(leadDoc).then(async (res: any) => {
                        console.log("✅ AI Chat captured lead:", res._id);

                        // Send Admin Alert Email
                        try {
                            await sendLeadAlertEmail({ ...leadDoc, _id: res._id });
                            console.log("📧 Admin alert sent for AI lead");
                        } catch (emailErr) {
                            console.error("Failed to send AI lead email:", emailErr);
                        }

                    }).catch((err: any) => {
                        console.error("❌ Failed to save AI lead:", err);
                    });
                }

            } catch (e) {
                console.error("Failed to parse CAPTURE block", e);
            }
        }

        return NextResponse.json({ reply: aiText.trim(), leadCaptured: !!capturedData });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
    }
}
