import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // Generic SMTP settings - User needs to fill these in .env.local
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

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

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error };
    }
}
