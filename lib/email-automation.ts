import { Resend } from 'resend';
import OpenAI from 'openai';

const resend = new Resend(process.env.RESEND_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface EmailData {
    customerName: string;
    customerEmail: string;
    samples?: string[];
    orderAmount?: number;
    paymentId?: string;
}

/**
 * Generate personalized email content using AI
 */
async function generateEmailContent(
    type: 'confirmation' | 'thank-you' | 'follow-up' | 'discount',
    data: EmailData
): Promise<{ subject: string; body: string }> {
    const prompts = {
        confirmation: `Write a warm, professional email confirming a sample order for Urban Clay (premium terracotta tiles). 
Customer: ${data.customerName}
Samples: ${data.samples?.join(', ') || 'Curated collection'}
Keep it brief, friendly, and include:
- Order confirmation
- What happens next (delivery in 3-5 days)
- Contact info if they have questions
Tone: Premium but approachable`,

        'thank-you': `Write a thank you email for Urban Clay after customer received samples.
Customer: ${data.customerName}
Samples: ${data.samples?.join(', ') || 'Premium samples'}
Include:
- Thank them for choosing Urban Clay
- Ask if samples met expectations
- Offer to help with their project
- Mention we're here for questions
Tone: Grateful, helpful, premium`,

        'follow-up': `Write a follow-up email for Urban Clay 7 days after sample delivery.
Customer: ${data.customerName}
Include:
- Check if they've had time to review samples
- Offer design consultation
- Ask if they need more information
- Gentle nudge to place order
Tone: Helpful, not pushy, premium`,

        discount: `Write an email offering 10% discount on first order for Urban Clay.
Customer: ${data.customerName}
Include:
- Limited time offer (7 days)
- 10% off on orders above ₹50,000
- Mention sample fee is refundable
- Create urgency but stay classy
Tone: Exclusive, premium, time-sensitive`
    };

    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are an expert email copywriter for Urban Clay, a premium terracotta tile brand in India. Write emails that are warm, professional, and conversion-focused. Always include a clear call-to-action."
            },
            {
                role: "user",
                content: prompts[type]
            }
        ],
        temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '';

    // Extract subject and body (AI will format it)
    const lines = content.split('\n');
    const subject = lines.find(l => l.toLowerCase().includes('subject:'))?.replace(/subject:/i, '').trim()
        || `Your Urban Clay ${type}`;
    const body = content;

    return { subject, body };
}

/**
 * Send confirmation email after sample order
 */
export async function sendOrderConfirmation(data: EmailData) {
    const { subject, body } = await generateEmailContent('confirmation', data);

    const { data: emailData, error } = await resend.emails.send({
        from: 'Urban Clay <orders@urbanclay.in>',
        to: [data.customerEmail],
        subject: subject,
        html: `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #C17A5F; font-size: 28px; margin: 0;">Urban Clay</h1>
                    <p style="color: #666; font-size: 14px; margin-top: 8px;">Premium Terracotta Tiles</p>
                </div>
                
                <div style="background: #FAF7F3; border-radius: 16px; padding: 32px; margin-bottom: 32px;">
                    ${body.split('\n').map(line => `<p style="color: #2A1E16; line-height: 1.6; margin-bottom: 16px;">${line}</p>`).join('')}
                </div>

                ${data.samples && data.samples.length > 0 ? `
                    <div style="background: white; border: 1px solid #e9e2da; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                        <h3 style="color: #2A1E16; font-size: 16px; margin-bottom: 16px;">Your Samples:</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${data.samples.map(sample => `
                                <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666;">
                                    ✓ ${sample}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div style="text-align: center; margin-top: 40px;">
                    <a href="https://claytile.in" style="display: inline-block; background: #C17A5F; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        Visit Our Website
                    </a>
                </div>

                <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 1px solid #e9e2da;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                        Questions? Reply to this email or call us at +91 80800 81951
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 8px;">
                        Urban Clay | Premium Terracotta Tiles
                    </p>
                </div>
            </div>
        `,
    });

    if (error) {
        console.error('Email send error:', error);
        throw error;
    }

    return emailData;
}

/**
 * Send thank you email (trigger 3 days after delivery)
 */
export async function sendThankYouEmail(data: EmailData) {
    const { subject, body } = await generateEmailContent('thank-you', data);

    await resend.emails.send({
        from: 'Urban Clay <hello@urbanclay.in>',
        to: [data.customerEmail],
        subject: subject,
        html: generateEmailHTML(body, data),
    });
}

/**
 * Send follow-up email (trigger 7 days after delivery)
 */
export async function sendFollowUpEmail(data: EmailData) {
    const { subject, body } = await generateEmailContent('follow-up', data);

    await resend.emails.send({
        from: 'Urban Clay <hello@urbanclay.in>',
        to: [data.customerEmail],
        subject: subject,
        html: generateEmailHTML(body, data),
    });
}

/**
 * Send discount offer email (trigger 10 days after delivery)
 */
export async function sendDiscountEmail(data: EmailData) {
    const { subject, body } = await generateEmailContent('discount', data);

    await resend.emails.send({
        from: 'Urban Clay <offers@urbanclay.in>',
        to: [data.customerEmail],
        subject: subject,
        html: generateEmailHTML(body, data, true),
    });
}

/**
 * Helper function to generate consistent email HTML
 */
function generateEmailHTML(content: string, data: EmailData, isOffer: boolean = false) {
    return `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #C17A5F; font-size: 28px; margin: 0;">Urban Clay</h1>
                <p style="color: #666; font-size: 14px; margin-top: 8px;">Premium Terracotta Tiles</p>
            </div>
            
            ${isOffer ? `
                <div style="background: linear-gradient(135deg, #C17A5F 0%, #a85638 100%); color: white; border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: center;">
                    <h2 style="margin: 0; font-size: 24px;">Exclusive Offer</h2>
                    <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Limited Time Only</p>
                </div>
            ` : ''}
            
            <div style="background: #FAF7F3; border-radius: 16px; padding: 32px; margin-bottom: 32px;">
                ${content.split('\n').map(line => `<p style="color: #2A1E16; line-height: 1.6; margin-bottom: 16px;">${line}</p>`).join('')}
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <a href="https://claytile.in/products" style="display: inline-block; background: #C17A5F; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    ${isOffer ? 'Claim Your Discount' : 'Explore Products'}
                </a>
            </div>

            <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 1px solid #e9e2da;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    Questions? Reply to this email or call us at +91 80800 81951
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 8px;">
                    Urban Clay | Premium Terracotta Tiles
                </p>
            </div>
        </div>
    `;
}

/**
 * Schedule automated email sequence
 * Call this after successful payment
 */
export async function scheduleEmailSequence(data: EmailData) {
    // Immediate: Order confirmation
    await sendOrderConfirmation(data);

    // Note: For production, use a job queue like BullMQ or Inngest
    // For now, we'll just send confirmation immediately
    // You'll need to set up cron jobs or scheduled functions for the rest

    console.log('Email sequence scheduled for:', data.customerEmail);
    console.log('- Day 0: Confirmation ✓');
    console.log('- Day 3: Thank you (set up cron job)');
    console.log('- Day 7: Follow-up (set up cron job)');
    console.log('- Day 10: Discount offer (set up cron job)');
}
