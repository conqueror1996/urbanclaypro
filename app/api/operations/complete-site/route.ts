import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

import { projectId, dataset, apiVersion } from '@/sanity/env';

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

// Force Node.js runtime to support Nodemailer
export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { siteId, clientEmail, completionDate } = body;

        // 1. Update site status to 'completed' and set actual completion date
        await client.patch(siteId)
            .set({
                status: 'completed',
                actualCompletionDate: completionDate || new Date().toISOString().split('T')[0]
            })
            .commit();

        // 2. Real Email Sending
        let emailSent = false;
        let emailError = null;

        try {
            if (process.env.SMTP_HOST && process.env.SMTP_USER) {
                const nodemailer = require('nodemailer');
                const port = parseInt(process.env.SMTP_PORT || '587');
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: port,
                    secure: port === 465, // true for 465, false for other ports
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                    tls: {
                        rejectUnauthorized: false // Helps with some self-signed certs or strict firewalls
                    }
                });

                // Dynamically determine base URL from request headers if env var is missing
                const host = request.headers.get('host') || 'localhost:3000';
                const protocol = request.headers.get('x-forwarded-proto') || 'http';
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
                const feedbackLink = `${baseUrl}/feedback/${siteId}`;

                await transporter.sendMail({
                    from: `"Urban Clay" <${process.env.SMTP_USER}>`,
                    to: clientEmail,
                    subject: "Project Completion & Feedback Request - Urban Clay",
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #c2410c;">Project Completed!</h1>
                            <p>Dear Client,</p>
                            <p>We are pleased to inform you that your project site has been marked as <strong>Completed</strong>.</p>
                            <p>At Urban Clay, we strive for excellence. We would love to hear your thoughts on our workmanship, material quality, and overall service.</p>
                            <p>Please click the link below to verify the site completion and leave your valuable feedback & photos:</p>
                            <a href="${feedbackLink}" style="display: inline-block; background-color: #c2410c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Provide Feedback</a>
                            <p style="margin-top: 24px; font-size: 12px; color: #666;">If the button doesn't work, copy this link: ${feedbackLink}</p>
                        </div>
                    `,
                });
                console.log(`[EMAIL] Sent successfully to ${clientEmail}`);
                emailSent = true;
            } else {
                console.warn('[EMAIL] SMTP credentials missing. Logged instead.');
                console.log(`[EMAIL-MOCK] Link: https://urbanclay.com/feedback/${siteId}`);
            }
        } catch (emailErr: any) {
            console.error('Email sending failed:', emailErr);
            emailError = emailErr.message;
        }

        return NextResponse.json({
            success: true,
            message: 'Status updated.',
            emailSent,
            emailError
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
