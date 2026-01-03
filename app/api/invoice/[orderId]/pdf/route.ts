
import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';

// ... (imports remain)
import autoTable from 'jspdf-autotable'; // Ensure we import it to avoid tree-shaking
// Trigger side effect for autoTable attachment
// @ts-ignore
const _ = autoTable;
import { getPaymentLinkDetails } from '@/app/actions/payment-link';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ orderId: string }> }
) {
    const params = await props.params;

    try {
        const { orderId } = params;
        const { success, order } = await getPaymentLinkDetails(orderId);

        if (!success || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Initialize PDF
        const doc: any = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // --- HEADER ---
        // Logo (Top Left)
        try {
            const logoPath = path.join(process.cwd(), 'public/urbanclay-logo.png');
            if (fs.existsSync(logoPath)) {
                const logoBase64 = fs.readFileSync(logoPath).toString('base64');
                // Use a fixed width and reasonable height, or use 'alias' for auto if supported, but typically w/h needed.
                // Assuming logo is roughly square or vertical. Let's try 30x30 roughly or adjust based on common shape. 
                // Creating a clean look.
                doc.addImage(logoBase64, 'PNG', 15, 10, 25, 25);
            }
        } catch (e) {
            console.error("Logo load failed", e);
        }

        // We removed the Brand Name text on the left as requested.

        // Tagline (Removed as per instruction to remove "UrbanClay" text)
        // doc.setFont("helvetica", "bold");
        // doc.setFontSize(8);
        // doc.setTextColor(150, 150, 150);
        // doc.text("PREMIUM CLAY SOLUTIONS", 15, 30);

        // Heading Label (Top Right)
        const isPaid = order.status === 'paid';
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(isPaid ? 42 : 220, isPaid ? 30 : 220, isPaid ? 22 : 220);
        doc.text(isPaid ? "TAX INVOICE" : "PROFORMA", pageWidth - 15, 25, { align: 'right' });

        // Meta Info (Right Side, below label)
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        let metaY = 32;
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, pageWidth - 15, metaY, { align: 'right' });
        doc.text(`${isPaid ? 'Invoice No' : 'Ref #'}: ${isPaid ? (order.zohoInvoiceNumber || order.orderId) : order.orderId}`, pageWidth - 15, metaY + 5, { align: 'right' });
        if (order.expiryDate) {
            doc.setTextColor(220, 50, 50); // Red Color
            doc.text(`Valid Until: ${new Date(order.expiryDate).toLocaleDateString()}`, pageWidth - 15, metaY + 10, { align: 'right' });
        }

        // --- CLIENT DETAILS ---
        const startY = 60; // Moved up slightly since logo is compact

        // Billed To
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("BILLED TO", 15, startY);

        doc.setFont("times", "bold");
        doc.setFontSize(14); // Slightly larger
        doc.setTextColor(42, 30, 22);
        doc.text(order.clientName || "Valued Client", 15, startY + 7);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);

        // Construct Full Address Block
        const billingAddr = order.billingAddress || "";
        const addressLines = doc.splitTextToSize(billingAddr, 80);
        doc.text(addressLines, 15, startY + 14);

        // Contact Info
        let currentY = startY + 14 + (addressLines.length * 4) + 4;
        doc.setFontSize(9);
        if (order.clientEmail) doc.text(order.clientEmail, 15, currentY);
        if (order.clientPhone) doc.text(order.clientPhone, 15, currentY + 5);

        if (order.gstNumber) {
            doc.setFont("courier", "bold");
            doc.text(`GSTIN: ${order.gstNumber}`, 15, currentY + 12);
        }

        // --- TABLE ---
        const tableY = Math.max(currentY + 25, 100);

        const tableData = order.lineItems.map((item: any) => {
            // Explicitly putting description on new line if it exists
            // We use 'content' object for cell
            return [
                {
                    content: item.name + (item.description ? `\n${item.description}` : ''),
                    styles: {
                        fontStyle: 'bold',
                        textColor: [42, 30, 22]
                    }
                },
                `${item.quantity} ${item.unit || 'pcs'}`,
                `Rs. ${item.rate.toLocaleString('en-IN')}`,
                `${item.discount}%`,
                { content: `Rs. ${((item.rate * item.quantity) * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, styles: { halign: 'right' } }
            ];
        });

        // @ts-ignore
        autoTable(doc, {
            startY: tableY,
            head: [['Item Details', 'Qty', 'Rate', 'Disc', 'Amount']],
            body: tableData,
            theme: 'plain', // Cleaner premium look vs grid
            headStyles: {
                fillColor: [245, 245, 245], // Very light grey header
                textColor: [100, 100, 100],
                fontStyle: 'bold',
                fontSize: 9,
                halign: 'left',
                cellPadding: 8
            },
            bodyStyles: {
                textColor: [60, 60, 60],
                fontSize: 9,
                cellPadding: 8,
                valign: 'top',
                lineColor: [240, 240, 240],
                lineWidth: { bottom: 0.1 } // Only bottom border
            },
            columnStyles: {
                0: { cellWidth: 85 }, // Description
                1: { halign: 'center', cellWidth: 20 }, // Qty
                2: { halign: 'right', cellWidth: 30 }, // Rate
                3: { halign: 'center', cellWidth: 15 }, // Disc
                4: { halign: 'right', cellWidth: 30, fontStyle: 'bold' } // Amount
            },
            didDrawPage: (data: any) => {
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text("UrbanClay Architecture Pvt Ltd", 15, doc.internal.pageSize.height - 10);
            }
        });

        // --- TOTALS ---
        // (doc as any).autoTable is NOT attached, so we use the state from the library or the last call
        // The lastAutoTable property is usually attached to doc by the plugin
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        const rightAlign = pageWidth - 15;

        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;
        // Collect Tax Rates
        const taxRates = new Set<number>();

        order.lineItems.forEach((item: any) => {
            const lineSub = item.rate * item.quantity;
            const lineDisc = lineSub * (item.discount / 100);
            const taxable = lineSub - lineDisc;
            const lineTax = taxable * (item.taxRate / 100);

            subtotal += lineSub;
            totalDiscount += lineDisc;
            totalTax += lineTax;
            if (item.taxRate > 0) taxRates.add(item.taxRate);
        });

        let currentTotalsY = finalY;
        const addTotalRow = (label: string, value: string, isBold = false, color = [60, 60, 60], fontSize = 10) => {
            doc.setFont("helvetica", isBold ? "bold" : "normal");
            doc.setFontSize(fontSize);
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text(label, rightAlign - 60, currentTotalsY, { align: 'right' });
            doc.text(value, rightAlign, currentTotalsY, { align: 'right' });
            currentTotalsY += 6;
        };

        addTotalRow("Subtotal", `Rs. ${subtotal.toLocaleString('en-IN')}`);

        if (totalDiscount > 0) {
            addTotalRow("Discount", `- Rs. ${totalDiscount.toLocaleString('en-IN')}`, false, [16, 185, 129]);
        }

        // Show GST with %
        const taxLabel = taxRates.size === 1
            ? `GST (@${Array.from(taxRates)[0]}%)`
            : "Total GST";

        addTotalRow(taxLabel, `Rs. ${totalTax.toLocaleString('en-IN')}`);

        if (order.shippingCharges > 0) {
            addTotalRow("Shipping & Handling", `Rs. ${order.shippingCharges.toLocaleString('en-IN')}`);
        }

        if (order.adjustment !== 0) {
            addTotalRow("Adjustment", `Rs. ${order.adjustment.toLocaleString('en-IN')}`);
        }

        currentTotalsY += 4;
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(rightAlign - 70, currentTotalsY - 6, rightAlign, currentTotalsY - 6);

        doc.setFont("times", "bold");
        doc.setFontSize(14);
        doc.setTextColor(42, 30, 22);
        doc.text(`Rs. ${order.amount.toLocaleString('en-IN')}`, rightAlign, currentTotalsY, { align: 'right' });
        doc.setFontSize(10);
        doc.text("Total Payable", rightAlign - 70, currentTotalsY, { align: 'right' });

        // Terms
        if (order.terms) {
            const termsY = currentTotalsY + 20;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("TERMS AND CONDITIONS", 15, termsY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(80, 80, 80);
            const splitTerms = doc.splitTextToSize(order.terms, pageWidth - 30);
            doc.text(splitTerms, 15, termsY + 5);
        }

        // ... (Buffer generation same as before)
        const pdfBuffer = doc.output('arraybuffer');

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Invoice_${orderId}.pdf"`
            }
        });

    } catch (error) {
        console.error("PDF Generation Error (Detailed):", error);
        return NextResponse.json({
            error: 'PDF generation failed',
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
