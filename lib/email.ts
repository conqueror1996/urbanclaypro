import nodemailer from 'nodemailer';

// Singleton to reuse connection
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    return transporter;
}

export async function sendLeadAlertEmail(lead: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP Credentials not found. Skipping email alert.');
        return;
    }

    try {
        const mailOptions = {
            from: `"UrbanClay Lead Bot" <${process.env.SMTP_USER}>`,
            to: 'sales@urbanclay.in',
            subject: `🔥 Serious Lead: ${lead.role} requested ${lead.quantity}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #b14a2a; margin-top: 0;">New High-Value Lead Detected</h2>
                    <p style="color: #555;">A potential serious client has just requested a quote.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name/Contact:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.contact}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.email || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Role:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.role}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Product:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.product}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Quantity:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.quantity}</td>
                        </tr>
                         <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>City:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.city}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Timeline:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.timeline}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Notes:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${lead.notes || 'None'}</td>
                        </tr>
                    </table>

                    <div style="margin-top: 30px; text-align: center;">
                        <a href="https://urbanclay.in/dashboard/leads" style="background-color: #1a1512; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Dashboard</a>
                    </div>
                </div>
            `,
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
        const mailOptions = {
            from: `"UrbanClay Support" <${process.env.SMTP_USER}>`,
            to: lead.email,
            subject: `We've received your request! | UrbanClay`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #b14a2a; margin: 0;">UrbanClay</h2>
                    </div>
                    
                    <p>Hello,</p>
                    <p>Thank you for reaching out to UrbanClay. We have received your consultation request for <strong>${lead.product || 'terracotta products'}</strong>.</p>
                    
                    <p>Our team will review your requirements and get back to you shortly (usually within 24 hours).</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>Your Request Details:</strong><br>
                        Phone: ${lead.contact}<br>
                        Location: ${lead.city}<br>
                        Requirement: ${lead.quantity}
                    </div>

                    <p>If you have urgent questions, feel free to reply to this email.</p>
                    
                    <p style="color: #888; font-size: 14px; margin-top: 30px;">
                        Warm regards,<br>
                        The UrbanClay Team
                    </p>
                </div>
            `,
        };

        const info = await getTransporter().sendMail(mailOptions);
        console.log('📧 User Confirmation sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending user confirmation:', error);
        return { success: false, error };
    }
}

export async function sendSampleFollowUpEmail(lead: any) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !lead.contact) {
        // Note: lead.contact might be phone, need email. Assuming we saved email in 'email' field now in Sanity.
        // If email not found, try to fallback or skip.
        if (!lead.email) return { success: false, error: "No email" };
    }

    try {
        const mailOptions = {
            from: `"UrbanClay Team" <${process.env.SMTP_USER}>`,
            to: lead.email,
            subject: `Did your samples arrive? | UrbanClay`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                     <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #b14a2a; margin: 0;">UrbanClay</h2>
                    </div>

                    <p>Hi ${lead.role === 'Architect' ? 'Architect' : 'there'},</p>

                    <p>It's been a few days since you requested samples from us. We wanted to check in—<strong>have they arrived safely?</strong></p>

                    <p>Here are a few things to look for when inspecting our terracotta:</p>
                    <ul>
                        <li><strong>Texture:</strong> Feel the natural grain. Authentic terracotta should feel earthy, not plastic.</li>
                        <li><strong>Color Variation:</strong> Slight tonal differences are a hallmark of natural kiln firing.</li>
                        <li><strong>Click Test:</strong> Tap two tiles together. A sharp "metallic" ring indicates high-quality firing.</li>
                    </ul>

                    <p>If you haven't received them yet, please reply to this email and we'll track it down for you immediately.</p>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="margin-bottom: 5px;"><strong>Ready to move forward?</strong></p>
                        <a href="https://wa.me/919790932822" style="color: #b14a2a; text-decoration: none; font-weight: bold;">Chat with us on WhatsApp →</a>
                    </div>
                </div>
            `
        };

        const info = await getTransporter().sendMail(mailOptions);
        console.log('📧 Follow-up sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending follow-up:', error);
        return { success: false, error };
    }
}
