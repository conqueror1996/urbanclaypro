import nodemailer from 'nodemailer';
import { getTrackingLink } from '@/lib/utils';
import { EMAIL_STYLES, EMAIL_SIGNATURE, EMAIL_FOOTER } from './email-constants';

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

function wrapEmailTemplate(content: string, title: string = 'Update from UrbanClay') {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background-color: #fcfaf9; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased;">
            <div style="padding: 40px 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
                    <!-- Header with Logo -->
                    <div style="padding: 40px; text-align: center; background-color: #2A1E16;">
                        <img src="https://claytile.in/urbanclay-logo.png" alt="UrbanClay" width="140" style="display: block; margin: 0 auto;" />
                    </div>

                    <!-- Main Body -->
                    <div style="padding: 48px; color: #2A1E16;">
                        ${content}
                        
                        <!-- Signature -->
                        <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #f0f0f0;">
                            ${EMAIL_SIGNATURE}
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="padding: 32px; background-color: #fcfaf9; text-align: center; color: #9ca3af; font-size: 11px; letter-spacing: 0.5px;">
                        ${EMAIL_FOOTER}
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

export async function sendLeadAlertEmail(lead: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

    try {
        const isSerious = lead.isSerious || lead.seriousness === 'high';
        const title = isSerious ? '🔥 Serious Lead Detected' : '📩 New Lead Received';

        const content = `
            <h2 style="color: #2A1E16; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 24px;">${title}</h2>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">A new inquiry has been captured from the website.</p>
            
            <div style="background-color: #fdfcfb; padding: 24px; border-radius: 16px; border: 1px solid #f5eeee; margin-top: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #9ca3af; font-size: 12px; font-weight: bold; text-transform: uppercase;">Customer</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${lead.contact}</td></tr>
                    <tr><td style="padding: 8px 0; color: #9ca3af; font-size: 12px; font-weight: bold; text-transform: uppercase;">Product</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${lead.product}</td></tr>
                    <tr><td style="padding: 8px 0; color: #9ca3af; font-size: 12px; font-weight: bold; text-transform: uppercase;">Location</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${lead.city}</td></tr>
                </table>
            </div>

            <div style="margin-top: 32px; text-align: center;">
                <a href="https://claytile.in/dashboard" style="display: inline-block; padding: 14px 32px; background-color: #2A1E16; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; letter-spacing: 1px;">VIEW DASHBOARD</a>
            </div>
        `;

        const mailOptions = {
            from: `"UrbanClay CRM" <${process.env.SMTP_USER}>`,
            to: 'urbanclay@claytile.in',
            subject: `${isSerious ? '🔥 Serious' : '📩 New'} Lead: ${lead.role} | ${lead.city}`,
            html: wrapEmailTemplate(content)
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('❌ Error sending admin mail:', error);
    }
}

export async function sendUserConfirmationEmail(order: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !order.email) return;

    try {
        // DETAILED PREMIUM RECEIPT
        const isDetailed = order.lineItems && order.lineItems.length > 0;
        const subject = isDetailed ? `Payment Confirmed: Invoice ${order.notes?.match(/Zoho Invoice: ([A-Z0-9-]+)/)?.[1] || order.orderId} | UrbanClay` : `Order Confirmed | UrbanClay`;

        let itemsHtml = '';
        if (isDetailed) {
            itemsHtml = `
                <table style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                    <thead>
                        <tr style="border-bottom: 2px solid #f0f0f0;">
                            <th style="padding: 12px 0; text-align: left; color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Description</th>
                            <th style="padding: 12px 12px; text-align: right; color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                            <th style="padding: 12px 0; text-align: right; color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.lineItems?.map((item: any) => `
                            <tr style="border-bottom: 1px solid #f9f9f9;">
                                <td style="padding: 16px 0;">
                                    <div style="font-weight: 700; color: #2A1E16; font-size: 14px;">${item.name}</div>
                                    <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">${item.description || ''}</div>
                                </td>
                                <td style="padding: 16px 12px; text-align: right; font-weight: 600; color: #6b7280; font-size: 13px;">${item.quantity}</td>
                                <td style="padding: 16px 0; text-align: right; font-weight: 700; color: #2A1E16; font-size: 14px;">₹${(item.rate * item.quantity).toLocaleString('en-IN')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr><td colspan="2" style="padding: 24px 0 8px; text-align: right; color: #9ca3af; font-size: 12px;">Grand Total Paid</td><td style="padding: 24px 0 8px; text-align: right; font-size: 22px; font-weight: 700; color: #b45a3c; font-family: 'Playfair Display', serif;">${order.quantity}</td></tr>
                    </tfoot>
                </table>
            `;
        }

        const content = `
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 56px; h-56px; background-color: #ecfdf5; color: #059669; border-radius: 50%; display: inline-block; padding: 12px; margin-bottom: 16px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2 style="color: #2A1E16; margin: 0; font-family: 'Playfair Display', serif; font-size: 28px; letter-spacing: -0.5px;">Payment Confirmed</h2>
                <p style="color: #6b7280; font-size: 15px; margin-top: 8px;">Order #${order.notes?.match(/Order ID: ([A-Z0-9-]+)/)?.[1] || 'UC-SUCCESS'}</p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #4B5563;">Hello ${order.name ? order.name.split(' ')[0] : 'there'},</p>
            <p style="font-size: 15px; line-height: 1.6; color: #4B5563;">Your transaction was successful. We are officially preparing your shipment for dispatch. Please find the receipt details below.</p>
            
            ${isDetailed ? itemsHtml : `
                <div style="background-color: #fdfcfb; padding: 24px; border-radius: 16px; border: 1px solid #f5eeee; margin: 32px 0;">
                    <p style="margin: 0; font-size: 13px; color: #9ca3af; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Product Details</p>
                    <p style="margin: 8px 0 0; font-size: 18px; font-weight: 700; color: #2A1E16;">${order.product}</p>
                    <p style="margin: 16px 0 0; font-size: 24px; font-weight: 700; color: #b45a3c;">${order.quantity}</p>
                </div>
            `}

            <div style="background-color: #fdfcfb; padding: 32px; border-radius: 20px; border: 1px solid #f5eeee; margin-top: 32px;">
                <h4 style="margin: 0 0 16px; font-size: 11px; font-weight: bold; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Delivery Metadata</h4>
                <p style="margin: 8px 0; font-size: 14px; color: #2A1E16;"><strong>Shipping To:</strong><br>${order.address || 'Project Site Address on File'}</p>
                <div style="margin-top: 16px; font-size: 11px; color: #9ca3af; font-family: monospace;">
                    ${order.notes.replace(/\n/g, '<br>')}
                </div>
            </div>

            <p style="margin-top: 40px; font-size: 13px; color: #6b7280; line-height: 1.6;">Our logistics concierge will reach out via WhatsApp with the Live Tracking coordinates once the dispatch cluster has been optimized.</p>
        `;

        const mailOptions = {
            from: `"UrbanClay Success" <${process.env.SMTP_USER}>`,
            to: order.email,
            subject: subject,
            html: wrapEmailTemplate(content)
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('❌ Error sending confirmation email:', error);
    }
}

export async function sendSampleShippedEmail(lead: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !lead.email) return;

    try {
        const trackingLink = getTrackingLink(lead.shippingInfo?.courier || '', lead.shippingInfo?.trackingNumber || '');
        const content = `
            <div style="text-align: center; margin-bottom: 32px;">
                <h2 style="color: #2A1E16; margin: 0; font-family: 'Playfair Display', serif; font-size: 28px;">Samples Dispatched</h2>
                <p style="color: #6b7280; font-size: 15px; margin-top: 8px;">Your design kit is on its way.</p>
            </div>

            <div style="background-color: #f0f9ff; border: 1px solid #e0f2fe; padding: 32px; border-radius: 20px; margin: 32px 0;">
                <h3 style="margin-top: 0; color: #0369a1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Track Shipment</h3>
                <p style="margin: 16px 0; font-size: 14px; color: #2A1E16;"><strong>Carrier:</strong> ${lead.shippingInfo?.courier || 'Standard Logistics'}</p>
                <p style="margin: 16px 0; font-size: 14px; color: #2A1E16;"><strong>Tracking:</strong> <span style="font-family: monospace; font-weight: bold;">${lead.shippingInfo?.trackingNumber || 'Awaiting Sync'}</span></p>
                
                ${lead.shippingInfo?.trackingNumber ? `
                <div style="margin-top: 32px; text-align: center;">
                    <a href="${trackingLink}" style="display: inline-block; padding: 14px 32px; background-color: #0369a1; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">TRACK PACKAGE</a>
                </div>
                ` : ''}
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">Average delivery time is 2-4 business days. Upon arrival, we recommend inspecting the textures under natural sunlight to appreciate the depth of the terracotta.</p>
        `;

        const mailOptions = {
            from: `"UrbanClay Logistics" <${process.env.SMTP_USER}>`,
            to: lead.email,
            subject: `📦 Shipping Update: Your UrbanClay Samples`,
            html: wrapEmailTemplate(content)
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('❌ Error sending shipped email:', error);
    }
}
