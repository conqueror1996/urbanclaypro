import { sendLeadAlertEmail } from '@/lib/email';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testEmail() {
    console.log('📧 Sending test email using credentials:');
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`User: ${process.env.SMTP_USER}`);

    const mockLead = {
        _id: 'test-id-123',
        role: 'Test Architect',
        product: 'Test Product',
        quantity: '100 sqft',
        city: 'Test City',
        timeline: 'Immediate',
        contact: 'Test User',
        notes: 'This is a test email from the setup script.'
    };

    const result = await sendLeadAlertEmail(mockLead);
    if (result && result.success) {
        console.log('✅ Email sent successfully!');
    } else {
        console.error('❌ Email failed:', result?.error);
    }
}

testEmail();
