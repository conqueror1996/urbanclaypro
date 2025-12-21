'use server';

import crypto from 'crypto';

const KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
    console.error("⚠️ Razorpay Keys Missing in Environment");
}

export async function createRazorpayOrder(amount: number, receiptId: string) {
    if (!KEY_ID || !KEY_SECRET) {
        throw new Error("Payment gateway configuration missing");
    }

    try {
        const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify({
                amount: amount * 100, // Convert to paise
                currency: 'INR',
                receipt: receiptId,
                payment_capture: 1
            })
        });

        const order = await response.json();

        if (!response.ok) {
            console.error("Razorpay Order Creation Failed:", order);
            throw new Error(order.error?.description || "Failed to create order");
        }

        return { success: true, orderId: order.id, amount: order.amount, currency: order.currency };
    } catch (error) {
        console.error("Create Order Error:", error);
        return { success: false, error: "Failed to initiate payment" };
    }
}

export async function verifyRazorpayPayment(orderId: string, paymentId: string, signature: string) {
    if (!KEY_SECRET) {
        throw new Error("Server configuration missing");
    }

    const generatedSignature = crypto
        .createHmac('sha256', KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    if (generatedSignature === signature) {
        return { success: true };
    } else {
        return { success: false, error: "Invalid payment signature" };
    }
}
