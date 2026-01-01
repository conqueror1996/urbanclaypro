'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { createZohoLead } from '@/lib/zoho'
import { nanoid } from 'nanoid'

export async function createPaymentLink(data: any) {
    try {
        const orderId = `ORD-${new Date().getFullYear()}-${nanoid(12).toUpperCase()}`;

        const doc: any = {
            _type: 'paymentLink',
            orderId,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone,
            gstNumber: data.gstNumber,
            panNumber: data.panNumber,
            billingAddress: data.billingAddress,
            shippingAddress: data.shippingAddress,
            lineItems: data.lineItems,
            amount: parseFloat(data.amount),
            shippingCharges: parseFloat(data.shippingCharges || 0),
            adjustment: parseFloat(data.adjustment || 0),
            tdsOption: data.tdsOption,
            tdsRate: parseFloat(data.tdsRate || 0),
            status: 'pending',
            terms: data.terms,
            deliveryTimeline: data.deliveryTimeline,
            customerNotes: data.customerNotes,
            createdAt: new Date().toISOString()
        }

        if (data.expiryDate) {
            doc.expiryDate = data.expiryDate;
        }

        const result = await writeClient.create(doc);

        // Sync to Zoho CRM as Lead
        await createZohoLead({
            name: data.clientName,
            email: data.clientEmail,
            contact: data.clientPhone,
            role: 'Client',
            firmName: data.clientName,
            city: 'Online Order',
            product: `${data.lineItems?.[0]?.name || 'Products'} ...`,
            quantity: `Rs. ${data.amount}`,
            timeline: data.deliveryTimeline,
            notes: `Secure Invoice Created: https://claytile.in/pay/${orderId}\nOrder ID: ${orderId}`
        });

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

        if (order && order.status === 'pending' && order.expiryDate) {
            const now = new Date();
            const expiry = new Date(order.expiryDate);
            if (now > expiry) {
                order.status = 'expired';
            }
        }

        return { success: !!order, order };
    } catch (error) {
        return { success: false, error: "Order not found" };
    }
}

export async function findZohoLeads(query: string) {
    try {
        const { searchZohoLeads } = await import('@/lib/zoho');
        return await searchZohoLeads(query);
    } catch (error) {
        return { success: false, error: "Search failed" };
    }
}

export async function verifyGST(gstin: string) {
    try {
        const { getGSTDetails } = await import('@/lib/zoho');
        return await getGSTDetails(gstin);
    } catch (error) {
        return { success: false, error: "Verification failed" };
    }
}

export async function markPaymentLinkAsPaid(orderId: string, paymentId: string) {
    try {
        const query = `*[_type == "paymentLink" && orderId == $orderId][0]`;
        const order = await writeClient.fetch(query, { orderId });

        if (!order) return { success: false, error: "Order not found" };
        if (order.status === 'paid') return { success: true, zohoInvoiceId: order.zohoInvoiceId };

        // 1. Create ACTUAL Zoho Invoice (Books API)
        const { createZohoInvoice, recordZohoPayment } = await import('@/lib/zoho');
        const zohoRes = await createZohoInvoice({
            ...order,
            paymentId
        });

        // Update Sanity with Zoho Details
        await writeClient.patch(order._id).set({
            status: 'paid',
            paymentId: paymentId,
            zohoInvoiceId: zohoRes.invoiceId,
            zohoInvoiceNumber: zohoRes.invoiceNumber
        }).commit();

        console.log(`✅ Order ${orderId} marked as paid. Zoho Invoice: ${zohoRes.invoiceNumber}`);

        // 1b. Record Payment in Zoho Books if Invoice was created
        if (zohoRes.success && zohoRes.invoiceId && zohoRes.customerId) {
            await recordZohoPayment({
                customerId: zohoRes.customerId,
                invoiceId: zohoRes.invoiceId,
                amount: order.amount,
                paymentId: paymentId
            });
        }

        // 2. Send Official Receipt Email
        const { sendUserConfirmationEmail } = await import('@/lib/email');
        await sendUserConfirmationEmail({
            name: order.clientName,
            email: order.clientEmail,
            product: `${order.lineItems?.[0]?.name || 'Order'} - PAID`,
            quantity: `₹${order.amount.toLocaleString('en-IN')}`,
            city: 'Online Order',
            address: order.billingAddress || 'Digital Invoice',
            notes: `Zoho Invoice: ${zohoRes.invoiceNumber}\nOrder ID: ${orderId}\nPayment ID: ${paymentId}`
        });

        return { success: true, zohoInvoiceId: zohoRes.invoiceId, invoiceNumber: zohoRes.invoiceNumber };
    } catch (error) {
        console.error("Error updating payment status", error);
        return { success: false, error: "Update failed" };
    }
}

export async function getAllPaymentLinks() {
    try {
        const query = `*[_type == "paymentLink"] | order(createdAt desc)`;
        const links = await writeClient.fetch(query);
        return { success: true, links };
    } catch (error) {
        console.error("Error fetching payment links:", error);
        return { success: false, links: [] };
    }
}
