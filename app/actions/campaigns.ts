'use server';

import { writeClient } from '@/sanity/lib/write-client';
import { client } from '@/sanity/lib/client';

export async function ImportLeads(city: string) {
    // In a real scenario, this would accept an array of leads passed from the Client Component (which got them from an API)
    // For this demo, we generate 'found' leads based on the city to show the user how it works.

    const demoLeads = [
        {
            _type: 'architectLead',
            name: 'Priya Sharma',
            firmName: `${city} Design Studio`,
            email: `contact@${city.toLowerCase()}design.com`,
            city: city,
            status: 'new',
            scrapedAt: new Date().toISOString()
        },
        {
            _type: 'architectLead',
            name: 'Rahul Verma',
            firmName: `VSpace Architects ${city}`,
            email: `rahul@vspace-${city.substring(0, 3).toLowerCase()}.in`,
            city: city,
            status: 'new',
            scrapedAt: new Date().toISOString()
        }
    ];

    for (const lead of demoLeads) {
        await writeClient.create(lead);
    }

    return { success: true };
}

import nodemailer from 'nodemailer';

// Quick Transport setup (Reusing env vars)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function SendCampaignEmail(recipientIds: string[], subject: string, bodyHtml: string) {
    if (!process.env.SMTP_USER) {
        console.error("❌ No SMTP User configured.");
        return { success: false, error: "SMTP Config Missing" };
    }

    // Get recipient emails from Sanity first
    const recipientsCheck = await client.fetch(`*[_id in $ids]{_id, email, firmName}`, { ids: recipientIds });

    // Batch processing to prevent spam flags (Rate Limiting)
    const BATCH_SIZE = 3;

    // Improved helper to create a clean text version
    const createTextVersion = (html: string) => {
        return html
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // Remove styles
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<[^>]*>/g, "") // Strip remaining tags
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ") // Collapse multiple spaces
            .trim();
    };

    const textVersion = createTextVersion(bodyHtml);

    for (let i = 0; i < recipientsCheck.length; i += BATCH_SIZE) {
        const batch = recipientsCheck.slice(i, i + BATCH_SIZE);

        // Process batch (Send Real Emails)
        await Promise.all(batch.map(async (recipient: any) => {
            if (!recipient.email) return;

            try {
                // Inject Tracking Pixel (Camouflaged as a branding element)
                // Also: Fix image paths to be absolute for email clients
                const absoluteBodyHtml = bodyHtml.replace(/src="\/images\//g, 'src="https://claytile.in/images/');

                const trackingUrl = `https://claytile.in/api/static/icon?uid=${recipient._id}`;
                const htmlWithPixel = `${absoluteBodyHtml}<img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="" />`;

                await transporter.sendMail({
                    from: `"UrbanClay Studio" <${process.env.SMTP_USER}>`,
                    to: recipient.email,
                    // replyTo: 'urbanclay@claytile.in', // REMOVED: Cross-domain Reply-To can trigger 'Relay: Bad' on Hostinger
                    subject: subject,
                    html: htmlWithPixel,
                    text: textVersion,
                    headers: {
                        'X-Entity-Ref-ID': recipient._id
                    }
                });

                // Update Status in Sanity
                await writeClient.patch(recipient._id).set({ status: 'contacted' }).commit();

            } catch (err) {
                console.error(`Failed to send to ${recipient.email}`, err);
            }
        }));

        // Wait Randomized Time (5s - 10s) between batches
        if (i + BATCH_SIZE < recipientsCheck.length) {
            const delay = Math.floor(Math.random() * (10000 - 5000 + 1) + 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return { success: true, count: recipientIds.length };
}

export async function SendTestEmail(toEmail: string, subject: string, bodyHtml: string) {
    if (!process.env.SMTP_USER) return { success: false, error: "SMTP Config Missing" };

    // Create a temporary test lead so the "Request Kit" button actually works in the test email
    const testLead = await writeClient.create({
        _type: 'architectLead',
        name: 'Test Architect',
        firmName: 'Test Preview Studio',
        email: toEmail,
        city: 'Test City',
        status: 'new'
    });

    try {
        const textVersion = bodyHtml
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        // Inject the REAL test lead ID so the user can complete the full flow
        let absoluteBodyHtml = bodyHtml.replace(/src="\/images\//g, 'src="https://claytile.in/images/');
        absoluteBodyHtml = absoluteBodyHtml.replace('uid=TRACKING_ID', `uid=${testLead._id}`);

        const trackingUrl = `https://claytile.in/api/static/icon?uid=${testLead._id}`;
        const htmlWithPixel = `${absoluteBodyHtml}<img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="" />`;

        await transporter.sendMail({
            from: `"UrbanClay Test" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: `[TEST] ${subject}`,
            html: htmlWithPixel,
            text: textVersion
        });

        return { success: true };
    } catch (error: any) {
        console.error("Test Email Failed:", error);
        return { success: false, error: error.message };
    }
}

