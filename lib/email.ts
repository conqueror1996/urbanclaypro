import nodemailer from 'nodemailer';
import { getTrackingLink } from '@/lib/utils';
import { EMAIL_STYLES, EMAIL_SIGNATURE, EMAIL_FOOTER } from './email-constants';

// Export the transporter directly for use in other files
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

function getTransporter() {
    return transporter;
}

// Helper to wrap content in main template
function wrapEmailTemplate(content: string, title: string = 'Update from UrbanClay') {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="padding: 20px 0;">
                <div style="${EMAIL_STYLES.container}">
                    <!-- Header with Logo -->
                    <div style="${EMAIL_STYLES.header}">
                        <img src="https://raw.githubusercontent.com/conqueror1996/urbanclaypro/main/public/urbanclay-logo.png" alt="UrbanClay" width="160" style="display: block; margin: 0 auto;" />
                    </div>

                    <!-- Main Body -->
                    <div style="${EMAIL_STYLES.body}">
                        ${content}
                        
                        <!-- Signature -->
                        ${EMAIL_SIGNATURE}
                    </div>

                    <!-- Footer -->
                    ${EMAIL_FOOTER}
                </div>
            </div>
        </body>
        </html>
    `;
}

export async function sendLeadAlertEmail(lead: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP Credentials not found. Skipping email alert.');
        return;
    }

    try {
        const isSerious = lead.isSerious || lead.seriousness === 'high';
        const title = isSerious ? '🔥 Serious Lead Detected' : '📩 New Lead Received';
        const subjectPrefix = isSerious ? '🔥 Serious Lead' : '📩 New Lead';

        const content = `
            <h2 style="color: #b14a2a; margin-top: 0;">${title}</h2>
            <p style="color: #555;"><strong>${lead.name || 'A client'}</strong> (${lead.role}) has requested <strong>${lead.quantity}</strong>.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr style="background-color: #f9f9f9;">
                    <td style="padding: 12px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${lead.contact}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${lead.email || 'N/A'}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                    <td style="padding: 12px; border-bottom: 1px solid #eee;"><strong>Product:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${lead.product}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;"><strong>City:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${lead.city}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                    <td style="padding: 12px; border-bottom: 1px solid #eee;"><strong>Notes:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${lead.notes || 'None'}</td>
                </tr>
            </table>

            <div style="margin-top: 30px; text-align: center;">
                <a href="https://claytile.in/dashboard" style="${EMAIL_STYLES.button}">View in Dashboard</a>
            </div>
        `;

        const mailOptions = {
            from: `"UrbanClay Bot" <${process.env.SMTP_USER}>`,
            to: 'urbanclay@claytile.in',
            subject: `${subjectPrefix}: ${lead.role} from ${lead.city}`,
            html: wrapEmailTemplate(content)
        };

        const info = await getTransporter().sendMail(mailOptions);
        console.log('📧 Admin Alert sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending admin email:', error);
        return { success: false, error };
    }
}

export async function sendUserConfirmationEmail(lead: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !lead.email) {
        return;
    }

    try {
        // CHECK: Is this a PAID Sample Order?
        const isPaid = lead.product && lead.product.toLowerCase().includes('paid');

        let content;
        let subject;

        if (isPaid) {
            subject = `Order Confirmed: ${lead.product} | UrbanClay`;

            // Extract Payment ID from notes if available (simple regex search)
            const paymentIdMatch = lead.notes?.match(/Payment ID: (pay_[a-zA-Z0-9]+)/);
            const paymentId = paymentIdMatch ? paymentIdMatch[1] : 'Online Payment';

            content = `
                <h2 style="color: #2A1E16; margin-top: 0; font-size: 24px;">Order Confirmed!</h2>
                
                <p>Hello ${lead.name ? lead.name.split(' ')[0] : 'there'},</p>
                <p>We confirm that we have received your payment of <strong>${lead.quantity}</strong>. Please find your official payment receipt below.</p>
                
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 0; border-radius: 12px; margin: 24px 0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <!-- Invoice Header -->
                    <div style="background-color: #f8f7f6; padding: 15px 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: #4b5563; font-size: 14px;">INVOICE SUMMARY</span>
                        <span style="font-family: monospace; color: #6b7280; font-size: 12px;">#${paymentId}</span>
                    </div>

                    <div style="padding: 24px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding-bottom: 16px; color: #6b7280; font-size: 14px;">Product</td>
                                <td style="padding-bottom: 16px; text-align: right; color: #111827; font-weight: 600;">${lead.product.replace(' - PAID', '')}</td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 16px; color: #6b7280; font-size: 14px;">Amount Paid</td>
                                <td style="padding-bottom: 16px; text-align: right; color: #111827; font-weight: 600;">${lead.quantity}</td>
                            </tr>
                            <tr style="border-top: 1px dashed #e5e7eb;">
                                <td style="padding-top: 16px; color: #6b7280; font-size: 14px;">Payment Status</td>
                                <td style="padding-top: 16px; text-align: right;">
                                    <span style="background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; text-transform: uppercase;">PAID & CONFIRMED</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div style="${EMAIL_STYLES.highlightBox}">
                    <strong style="color: #b45a3c; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Delivery Details</strong>
                    <div style="margin-top: 10px; line-height: 1.5; color: #4b5563;">
                        <p style="margin: 0;"><strong>Shipping To:</strong> ${lead.address || 'Address on File'}</p>
                        <p style="margin: 5px 0 0;"><strong>City:</strong> ${lead.city || 'Online Order'}</p>
                    </div>
                </div>

                <p style="margin-top: 24px; color: #4b5563;">You will receive another email with the tracking number as soon as our logistics team dispatches your order.</p>
            `;
        } else {
            // STANDARD FREE CONSULTATION EMAIL
            subject = `We've received your request | UrbanClay`;
            content = `
                <h2 style="color: #2A1E16; margin-top: 0; font-size: 24px;">Thank you for your interest.</h2>
                
                <p>Hello ${lead.name ? lead.name.split(' ')[0] : 'there'},</p>
                <p>We confirm receipt of your consultation request for <strong>${lead.product || 'our products'}</strong>.</p>
                
                <div style="${EMAIL_STYLES.highlightBox}">
                    <strong style="color: #b45a3c; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Request Details</strong>
                    <div style="margin-top: 10px;">
                        <strong>Requirement:</strong> ${lead.quantity}<br>
                        <strong>Location:</strong> ${lead.city || 'Not specified'}
                    </div>
                </div>

                <p>Our architectural team will review your project details and get back to you within 24 hours.</p>

                <p>In the meantime, feel free to browse our <a href="https://claytile.in/products" style="color: #b45a3c; text-decoration: underline;">latest collection</a>.</p>
            `;
        }

        const mailOptions = {
            from: `"UrbanClay Support" <${process.env.SMTP_USER}>`,
            to: lead.email,
            subject: subject,
            html: wrapEmailTemplate(content)
        };

        // SPECIAL CASE: Catalogue Request (Exit Intent)
        if (lead.product === 'General Catalogue') {
            const catalogueContent = `
                <h2 style="color: #2A1E16; margin-top: 0;">Here is your Design Kit.</h2>
                <p>Hi there,</p>
                <p>Thank you for downloading the UrbanClay 2025 Architects' Kit. Inside, you'll find our complete product specs and the latest trade price list.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://claytile.in/" style="${EMAIL_STYLES.button}">Download PDF Catalogue</a>
                </div>

                <p style="color: #666; font-size: 14px;"><strong>Note:</strong> We've also attached our 'Installation Guide' for exposed brick cladding.</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p>If you have a specific project in mind, replied to this email for a custom quote.</p>
            `;

            mailOptions.subject = "Your 2025 Architecture Design Kit | UrbanClay";
            mailOptions.html = wrapEmailTemplate(catalogueContent, "Your Catalogue is Ready");
        }

        const info = await getTransporter().sendMail(mailOptions);
        console.log('📧 User Confirmation sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending user confirmation:', error);
        return { success: false, error };
    }
}

export async function sendSampleShippedEmail(lead: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !lead.email) {
        return { success: false, error: "Missing email or credentials" };
    }

    try {
        const trackingLink = getTrackingLink(lead.shippingInfo?.courier || '', lead.shippingInfo?.trackingNumber || '');

        const content = `
            <h2 style="color: #2A1E16; margin-top: 0;">📦 Your Samples are on the way!</h2>
            <p>Good news! Your sample box has been carefully packed and dispatched from our warehouse.</p>

            <div style="background-color: #f0f9ff; border: 1px solid #e0f2fe; padding: 24px; border-radius: 12px; margin: 24px 0;">
                <h3 style="margin-top: 0; color: #0369a1; font-size: 16px;">Shipment Details</h3>
                <p style="margin: 8px 0;"><strong>Courier:</strong> ${lead.shippingInfo?.courier || 'Standard Shipping'}</p>
                <p style="margin: 8px 0;"><strong>Tracking Number:</strong> ${lead.shippingInfo?.trackingNumber || 'N/A'}</p>
                
                ${lead.shippingInfo?.trackingNumber ? `
                <div style="margin-top: 20px;">
                    <a href="${trackingLink}" style="background-color: #b45a3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">Track Package</a>
                </div>
                ` : ''}
            </div>

            <p>It should reach you within 2-4 business days.</p>
        `;

        const mailOptions = {
            from: `"UrbanClay Logistics" <${process.env.SMTP_USER}>`,
            to: lead.email,
            subject: `📦 Samples Dispatched | Tracking Update`,
            html: wrapEmailTemplate(content)
        };

        const info = await getTransporter().sendMail(mailOptions);
        console.log('📧 Shipped Email sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending shipped email:', error);
        return { success: false, error };
    }
}

export async function sendSampleFollowUpEmail(lead: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        if (!lead.email) return { success: false, error: "No email" };
    }

    try {
        let emailBodyContent = '';

        // 1. Try AI Generation
        try {
            const { generateFollowUpEmailContent } = await import('./ai/email-generator');
            const name = lead.firmName || lead.name || 'Client';

            const aiContent = await generateFollowUpEmailContent({
                name: name,
                product: lead.product,
                sampleItems: lead.sampleItems,
                role: lead.role
            });

            if (aiContent) {
                emailBodyContent = aiContent;
            }
        } catch (e) {
            console.error("AI Email Gen failed, using template", e);
        }

        // 2. Fallback Template
        if (!emailBodyContent) {
            emailBodyContent = `
                <p>Hi there,</p>

                <p>It's been a few days since you requested samples from us. We wanted to check in—<strong>have they arrived safely?</strong></p>

                <div style="${EMAIL_STYLES.highlightBox}">
                    <strong style="color: #b45a3c; display: block; margin-bottom: 10px;">Pro Tips for Inspection:</strong>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;"><strong>Texture:</strong> Feel the natural grain. Authentic terracotta should feel earthy, not plastic.</li>
                        <li><strong>Sound:</strong> Tap two tiles together. A sharp "metallic" ring indicates high-quality firing.</li>
                    </ul>
                </div>

                <p>If you have any questions about installation or pricing, just reply to this email.</p>
            `;
        }

        const mailOptions = {
            from: `"UrbanClay Customer Success" <${process.env.SMTP_USER}>`,
            to: lead.email,
            subject: `Regarding your samples | UrbanClay`,
            html: wrapEmailTemplate(emailBodyContent)
        };

        const info = await getTransporter().sendMail(mailOptions);
        console.log('📧 Follow-up sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending follow-up:', error);
        return { success: false, error };
    }
}
