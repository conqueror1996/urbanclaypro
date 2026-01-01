'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { createZohoLead } from '@/lib/zoho'
import { nanoid } from 'nanoid'

export async function createPaymentLink(data: any) {
    try {
        // High entropy ID for security (approx 70 years to handle 1% collision probability at 1k ids/hour)
        const orderId = `ORD-${new Date().getFullYear()}-${nanoid(12).toUpperCase()}`;

        const doc = {
            _type: 'paymentLink',
            orderId,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone,
            productName: data.productName,
            amount: parseFloat(data.amount),
            status: 'pending',
            terms: data.terms,
            deliveryTimeline: data.deliveryTimeline,
            createdAt: new Date().toISOString()
        }

        const result = await writeClient.create(doc);

        // Sync to Zoho
        await createZohoLead({
            name: data.clientName,
            email: data.clientEmail,
            contact: data.clientPhone,
            role: 'Client',
            firmName: data.clientName,
            city: 'Online Order',
            product: `${data.productName} (Link Sent)`,
            quantity: `Rs. ${data.amount}`,
            timeline: data.deliveryTimeline,
            notes: `Payment Link Generated: https://claytile.in/pay/${orderId}\nOrder ID: ${orderId}`
        });

        // Return path so client can attach current origin (localhost or domain)
        return { success: true, orderId, linkPath: `/pay/${orderId}` };

    } catch (error) {
        console.error("Error creating payment link:", error);
        return { success: false, error: "Failed to generate link" };
    }
}

export async function getPaymentLinkDetails(orderId: string) {
    try {
        const query = `*[_type == "paymentLink" && orderId == $orderId][0]`;
        const order = await writeClient.fetch(query, { orderId });
        return { success: !!order, order };
    } catch (error) {
        return { success: false, error: "Order not found" };
    }
}

export async function markPaymentLinkAsPaid(orderId: string, paymentId: string) {
    try {
        const query = `*[_type == "paymentLink" && orderId == $orderId][0]`;
        const order = await writeClient.fetch(query, { orderId });

        if (!order) return { success: false, error: "Order not found" };

        await writeClient.patch(order._id).set({
            status: 'paid',
            paymentId: paymentId
        }).commit();

        // Send Official Receipt Email
        const { sendUserConfirmationEmail } = await import('@/lib/email');
        await sendUserConfirmationEmail({
            name: order.clientName,
            email: order.clientEmail,
            product: `${order.productName} - PAID`, // Trigger the PAID template
            quantity: `₹${order.amount}`,
            city: 'Online Order',
            address: 'See Invoice',
            notes: `Payment ID: ${paymentId}\nOrder ID: ${orderId}`
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating payment status", error);
        return { success: false, error: "Update failed" };
    }
}
