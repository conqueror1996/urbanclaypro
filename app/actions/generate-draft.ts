'use server';

interface Lead {
    contact: string;
    role: string;
    product: string;
    city: string;
    quantity: string;
    timeline: string;
    notes: string;
}

export async function generateSalesEmail(lead: Lead) {
    // This is a prompt engineering function that simulates a high-end sales AI
    // In a real production app, this would call OpenAI/Gemini API
    // For now, we will use a sophisticated template engine to mimic intelligence.

    const isArchitect = lead.role.toLowerCase().includes('architect') || lead.role.toLowerCase().includes('designer');
    const isBuilder = lead.role.toLowerCase().includes('builder') || lead.role.toLowerCase().includes('contractor');
    const isHomeowner = !isArchitect && !isBuilder;

    const firstName = lead.contact.split(' ')[0];

    let tone = "professional and helpful";
    let opening = `Thank you for your interest in UrbanClay's premium collection.`;
    let body = "";
    let closing = "Looking forward to helping you build something beautiful.";

    // ---------------------------------------------------------
    // 1. PERSONA ADAPTATION
    // ---------------------------------------------------------
    if (isArchitect) {
        tone = "collaborative and technical";
        opening = `It is wonderful to connect with a fellow design professional. We truly admire the work of architects in shaping our skylines.`;
        body += `We understand that for the **${lead.product}**, the texture and finish are critical for your design vision.\n\n`;
        body += `Since you are looking for **${lead.quantity}** in **${lead.city}**, we can arrange for physical samples to be delivered to your studio immediately so you can feel the material quality firsthand.\n\n`;
        closing = "Let's create a landmark together.";
    }
    else if (isBuilder) {
        tone = "direct and efficient";
        opening = `Thanks for reaching out. We appreciate the scale of your operations.`;
        body += `Regarding your inquiry for **${lead.quantity}** of **${lead.product}**: We have this stock ready for dispatch and can ensure a seamless logistical flow to your site in **${lead.city}**.\n\n`;
        body += `We offer special trade terms for bulk volume partners to ensure your project stays on budget without compromising quality.\n\n`;
        closing = "Ready to dispatch when you are.";
    }
    else { // Homeowner
        tone = "warm and guiding";
        opening = `Congratulations on your upcoming project! It's an exciting journey building your dream space.`;
        body += `Excellent choice with the **${lead.product}** — it adds such a timeless, earthy warmth to any home.\n\n`;
        body += `For a quantity of **${lead.quantity}**, we can help you calculate the exact coverage including wastage so you don't overspend. The delivery to **${lead.city}** typically takes 5-7 days.\n\n`;
        closing = "Here to help you build your dream home.";
    }

    // ---------------------------------------------------------
    // 2. CONTEXT AWARENESS (Notes Analysis)
    // ---------------------------------------------------------
    if (lead.notes && lead.notes.length > 5) {
        body += `\n**Regarding your note:** "${lead.notes}"\n`;
        body += `> We have noted this specific requirement and will ensure our proposal addresses it fully.\n\n`;
    }

    // ---------------------------------------------------------
    // 3. CALL TO ACTION (The "Close")
    // ---------------------------------------------------------
    let cta = "";
    if (lead.timeline && lead.timeline.toLowerCase().includes('urgent')) {
        cta = "Since your timeline is urgent, I can get a formal Proforma Invoice generated today if you confirm the exact shipping address.";
    } else {
        cta = "Would you like to schedule a quick 5-minute video call to see the latest batch quality before we finalize?";
    }

    const emailDraft = `Subject: Proposal for ${lead.product} | UrbanClay Studio

Dear ${firstName},

${opening}

${body}
${cta}

Warm regards,

**Sales Team**
UrbanClay Studio
*Handcrafted Excellence*
sales@urbanclay.in | +91 80800 81951`;

    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    return { success: true, draft: emailDraft };
}
