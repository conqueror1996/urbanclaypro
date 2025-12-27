'use server';

import { transporter } from '@/lib/email';
import { EMAIL_SIGNATURE, EMAIL_STYLES } from '@/lib/email-constants';

export async function SendReplyEmail(to: string, subject: string, message: string) {
    if (!to) return { success: false, error: 'No recipient email found' };

    try {
        // Construct professional HTML email
        const htmlBody = `
            <div style="${EMAIL_STYLES.container}">
                <div style="${EMAIL_STYLES.header}">
                    <img src="https://raw.githubusercontent.com/conqueror1996/urbanclaypro/main/public/urbanclay-logo.png" alt="UrbanClay" width="60" style="margin-bottom: 10px;" />
                    <h2 style="margin: 0; color: #2A1E16; font-family: serif;">Response to your Feedback</h2>
                </div>
                
                <div style="${EMAIL_STYLES.body}">
                    <p>Dear Client,</p>
                    ${message.replace(/\n/g, '<br/>')}
                    
                    ${EMAIL_SIGNATURE}
                </div>
                
                <div style="${EMAIL_STYLES.footer}">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} UrbanClay. All rights reserved.</p>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"UrbanClay Support" <${process.env.SMTP_USER}>`,
            to: to,
            replyTo: 'urbanclay@claytile.in',
            subject: subject,
            html: htmlBody,
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to send reply:", error);
        return { success: false, error: error.message };
    }
}
