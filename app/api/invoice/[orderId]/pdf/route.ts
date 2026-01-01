
import { NextResponse } from 'next/server';
import { getZohoInvoicePDF } from '@/lib/zoho';
import { writeClient } from '@/sanity/lib/write-client';

export async function GET(
    request: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const orderId = params.orderId;

        // 1. Get Zoho Invoice ID from Sanity
        const query = `*[_type == "paymentLink" && orderId == $orderId][0]`;
        const order = await writeClient.fetch(query, { orderId });

        if (!order || !order.zohoInvoiceId) {
            return new NextResponse('Invoice not found or not yet generated', { status: 404 });
        }

        // 2. Fetch PDF from Zoho
        const pdfBuffer = await getZohoInvoicePDF(order.zohoInvoiceId);

        if (!pdfBuffer) {
            return new NextResponse('Failed to retrieve PDF from gateway', { status: 500 });
        }

        // 3. Return as PDF file
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Invoice_${order.zohoInvoiceNumber || orderId}.pdf"`
            }
        });

    } catch (error) {
        console.error("PDF Download Error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
