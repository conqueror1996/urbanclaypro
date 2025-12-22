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
        
        Guidelines:
        1. **BREVITY IS KING**: Responses must be **MAX 2 SENTENCES**.
        2. **ONE QUESTION RULE**: Ask ONLY ONE question at a time. Never ask multiple things in one go.
        3. **Tone**: Crisp, helpful, professional. Like a busy senior architect.
        4. **Lead Gen**: Do NOT ask for contact info immediately. Wait until you have established value (e.g. after recommending a product).
        
        Example Good Flow:
        User: "I need brick tiles."
        Clay: "Great choice. Our 20mm Cladding Tiles are perfect for facades. Is this for an exterior or interior wall?"
        User: "Exterior."
        Clay: "Understood. For exteriors, I recommend our 'Antique Red' series. What is the approximate area (sq.ft)?"
        User: "2000 sqft."
        Clay: "That's a significant project. To share our best B2B quote, could I text you the details? What's your mobile number?"
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

        // Helper for retry logic
        const fetchWithRetry = async (retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: contents,
                            generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
                        })
                    });

                    if (response.status === 429) {
                        console.warn(`Gemini 429 hit. Retrying in ${delay}ms... (Attempt ${i + 1})`);
                        await new Promise(res => setTimeout(res, delay * (i + 1))); // Exponential backoff
                        continue;
                    }

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
                    }

                    return response;
                } catch (e: any) {
                    if (i === retries - 1) throw e;
                    if (e.message.includes('429')) {
                        await new Promise(res => setTimeout(res, delay * (i + 1)));
                        continue;
                    }
                    throw e;
                }
            }
            throw new Error("Max retries exceeded");
        };

        const response = await fetchWithRetry();

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
