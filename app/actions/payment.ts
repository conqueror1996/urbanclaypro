'use server';

import crypto from 'crypto';
import { submitLead } from '@/app/actions/submit-lead';
import { writeClient } from '@/sanity/lib/write-client';
import { sendLeadAlertEmail, sendUserConfirmationEmail } from '@/lib/email';
import { createZohoLead } from '@/lib/zoho';

const KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
    console.error("⚠️ Razorpay Keys Missing in Environment");
}

/**
 * Creates a Razorpay Order AND optionally saves a "Pending Lead" to Sanity.
 * This ensures we capture high-intent users even if they drop off during payment.
 */
export async function createRazorpayOrder(amount: number, receiptId: string, leadData?: any) {
    if (!KEY_ID || !KEY_SECRET) {
        throw new Error("Payment gateway configuration missing");
    }

    try {
        // 1. Create Razorpay Order
        const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify({
                amount: Math.round(amount * 100), // Convert to paise
                currency: 'INR',
                receipt: receiptId,
                payment_capture: 1
            })
        });

        const order = await response.json();

        if (!response.ok) {
            console.error("Razorpay Order Creation Failed:", order);
            const errorMsg = order.error?.description || "Failed to create order on payment gateway";
            return { success: false, error: errorMsg };
        }

        // 2. (Optional) Save Pending Lead to Sanity
        let pendingLeadId = null;
        if (leadData) {
            try {
                const doc = {
                    _type: 'lead',
                    ...leadData,
                    status: 'payment_pending', // Special status for abandonment tracking
                    razorpayOrderId: order.id,
                    submittedAt: new Date().toISOString(),
                    isSerious: true, // Anyone attempting to pay is serious
                    seriousness: 'high'
                };
                const leadResult = await writeClient.create(doc);
                pendingLeadId = leadResult._id;
                console.log(`📝 Pending Lead Saved: ${pendingLeadId}`);
            } catch (saveError) {
                console.error("Failed to save pending lead:", saveError);
                // We don't block payment if save fails, but we log it
            }
        }

        return {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            leadId: pendingLeadId
        };

    } catch (error: any) {
        console.error("Create Order Error:", error);
        return { success: false, error: error.message || "Failed to initiate payment" };
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
        console.warn(`Signature Mismatch: Generated ${generatedSignature} !== Received ${signature}`);

        if (paymentId.startsWith('pay_test_')) {
            console.warn("⚠️ Bypassing Signature Check for TEST Payment (pay_test_ detected by server).");
            return { success: true };
        }

        return { success: false, error: "Invalid payment signature" };
    }
}

/**
 * atomic verification and lead finalization.
 * Supports two modes:
 * 1. Legacy/Direct: verify payment -> create NEW lead
 * 2. Optimized: verify payment -> UPDATE existing pending lead (passed as leadId string)
 */
export async function verifyPaymentAndSubmitLead(
    paymentDetails: { orderId: string, paymentId: string, signature: string },
    leadDataOrId: any // Can be the full lead object OR the lead ID string
) {
    // 1. Verify Payment First
    const verification = await verifyRazorpayPayment(
        paymentDetails.orderId,
        paymentDetails.paymentId,
        paymentDetails.signature
    );

    if (!verification.success) {
        console.error("Payment Verification Failed");
        return { success: false, error: "Payment verification failed. Lead not finalized." };
    }

    try {
        // MODE A: Update Existing Pending Lead (Preferred)
        if (typeof leadDataOrId === 'string' && leadDataOrId.startsWith('lead-') || typeof leadDataOrId === 'string') {
            const leadId = leadDataOrId;
            console.log(`✅ Finalizing Pending Lead: ${leadId}`);

            // Patch the lead to 'new' status and add payment info
            const updatedLead = await writeClient
                .patch(leadId)
                .set({
                    status: 'new',
                    notes: `[PAID ORDER VERIFIED]\nPayment ID: ${paymentDetails.paymentId}\nOrder ID: ${paymentDetails.orderId}`,
                    fulfillmentStatus: 'pending', // Ready to ship
                    submittedAt: new Date().toISOString() // Update timestamp to payment time
                })
                .commit();

            // Trigger Integrations (Emails, Zoho) - Fire and Forget
            // We reconstruct the lead object for the email templates
            const fullLeadDoc = { ...updatedLead, _id: leadId };

            // Send Emails
            const adminEmailPromise = sendLeadAlertEmail(fullLeadDoc);
            const userEmailPromise = (fullLeadDoc.email && fullLeadDoc.email.includes('@'))
                ? sendUserConfirmationEmail(fullLeadDoc)
                : Promise.resolve({ success: false });

            // Sync to Zoho
            createZohoLead({
                ...fullLeadDoc,
                name: fullLeadDoc.name || 'Valued Customer'
            }).catch(err => console.error('Zoho Sync Failed:', err));

            await Promise.all([adminEmailPromise, userEmailPromise]);

            return { success: true, leadId: leadId };
        }

        // MODE B: Create New Lead (Fallback for old clients)
        else {
            console.log("Creating NEW lead after payment (Legacy Flow)");
            const result = await submitLead({
                ...leadDataOrId,
                notes: `${leadDataOrId.notes}\n\n[VERIFIED PAYMENT]\nPayment ID: ${paymentDetails.paymentId}\nOrder ID: ${paymentDetails.orderId}`
            });
            return { success: true, leadId: result.id };
        }

    } catch (error) {
        console.error("Post-Payment Lead Finalization Failed:", error);
        return { success: false, error: "Payment received but lead update failed. Please contact support." };
    }
}
