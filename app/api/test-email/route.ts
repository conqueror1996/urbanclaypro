import { NextResponse } from 'next/server';
import { sendUserConfirmationEmail } from '@/lib/email';

export async function GET() {
    try {
        console.log("Testing Email Sending from Next.js Route...");

        // Mock Order
        const result = await sendUserConfirmationEmail({
            email: process.env.SMTP_USER, // Send to self
            name: 'Test User',
            orderId: 'TEST-123',
            amount: 100,
            lineItems: [{ name: 'Test Product', quantity: 1, rate: 100 }],
            notes: 'Test Order'
        });

        if (result.success) {
            return NextResponse.json({ success: true, message: 'Email sent successfully via App' });
        } else {
            return NextResponse.json({ success: false, error: result.error, detailed: 'Check server logs' }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
