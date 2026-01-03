
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
        // Logo
        try {
            const logoPath = path.join(process.cwd(), 'public/urbanclay-logo.png');
            if (fs.existsSync(logoPath)) {
                const logoBase64 = fs.readFileSync(logoPath).toString('base64');
                doc.addImage(logoBase64, 'PNG', pageWidth - 50, 10, 35, 35); // Top Right Logo
            }
        } catch (e) {
            console.error("Logo load failed", e);
        }

        // Brand Name (Top Left)
        doc.setFont("times", "bold");
        doc.setFontSize(26);
        doc.setTextColor(42, 30, 22);
        doc.text("UrbanClay", 15, 25);

        // Tagline
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("PREMIUM CLAY SOLUTIONS", 15, 30);

        // Heading Label
        const isPaid = order.status === 'paid';
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(isPaid ? 42 : 220, isPaid ? 30 : 220, isPaid ? 22 : 220); // Darker if Paid
        // Position below logo on right, or center? 
        // Standard: Right aligned below logo or similar
        doc.text(isPaid ? "TAX INVOICE" : "PROFORMA", pageWidth - 15, 55, { align: 'right' });

        // Meta Info (Right Side, below label)
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        let metaY = 62;
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, pageWidth - 15, metaY, { align: 'right' });
        doc.text(`${isPaid ? 'Invoice No' : 'Ref #'}: ${isPaid ? (order.zohoInvoiceNumber || order.orderId) : order.orderId}`, pageWidth - 15, metaY + 5, { align: 'right' });
        if (order.expiryDate) {
            doc.setTextColor(220, 50, 50);
            doc.text(`Valid Until: ${new Date(order.expiryDate).toLocaleDateString()}`, pageWidth - 15, metaY + 10, { align: 'right' });
        }

        // --- CLIENT DETAILS ---
        const startY = 75;

        // Billed To
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("BILLED TO", 15, startY);

        doc.setFont("times", "bold");
        doc.setFontSize(12);
        doc.setTextColor(42, 30, 22);
        doc.text(order.clientName || "Valued Client", 15, startY + 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);

        // Construct Full Address Block
        const billingAddr = order.billingAddress || "";
        const addressLines = doc.splitTextToSize(billingAddr, 80);
        doc.text(addressLines, 15, startY + 12);

        // Contact Info
        let currentY = startY + 12 + (addressLines.length * 4) + 4;
        doc.setFontSize(9);
        if (order.clientEmail) doc.text(order.clientEmail, 15, currentY);
        if (order.clientPhone) doc.text(order.clientPhone, 15, currentY + 5);

        if (order.gstNumber) {
            doc.setFont("courier", "bold");
            doc.text(`GSTIN: ${order.gstNumber}`, 15, currentY + 12);
        }

        // --- TABLE ---
        const tableY = Math.max(currentY + 20, 110); // Ensure header clearance

        const tableData = order.lineItems.map((item: any) => {
            // Description handling
            const desc = item.description ? `\n${item.description}` : '';
            return [
                { content: item.name + desc, styles: { fontStyle: 'bold' } },
                `${item.quantity} ${item.unit || 'pcs'}`,
                `Rs. ${item.rate.toLocaleString('en-IN')}`, // Using 'Rs.' for reliability
                `${item.discount}%`,
                { content: `Rs. ${((item.rate * item.quantity) * (1 - item.discount / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, styles: { halign: 'right' } }
            ];
        });

        autoTable(doc, {
            startY: tableY,
            head: [['Item Details', 'Qty', 'Rate', 'Disc', 'Amount']],
            body: tableData,
            theme: 'grid', // Use grid to separate items better
            headStyles: {
                fillColor: [42, 30, 22],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9,
                halign: 'left'
            },
            bodyStyles: {
                textColor: [60, 60, 60],
                fontSize: 9,
                cellPadding: 4,
                valign: 'top',
                lineColor: [230, 230, 230]
            },
            columnStyles: {
                0: { cellWidth: 80 }, // Wide for description
                1: { halign: 'center', cellWidth: 20 },
                2: { halign: 'right' },
                3: { halign: 'center' },
                4: { halign: 'right', fontStyle: 'bold' }
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

        // Terms...
        if (order.terms) {
            const termsY = Math.max(currentTotalsY + 20, finalY + 40); // ensure space
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("TERMS AND CONDITIONS", 15, termsY); // Moved terms lower ? May overlap if list is long?
            // Actually finalY + 50 is safer.
        }

        // ... (Buffer generation same as before)
        const pdfBuffer = doc.output('arraybuffer');

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Proforma_${orderId}.pdf"`
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
