
import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';
import autoTable from 'jspdf-autotable';
import { getPaymentLinkDetails } from '@/app/actions/payment-link';

// @ts-ignore
const _ = autoTable;

export const dynamic = 'force-dynamic';

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

        const doc: any = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;

        // --- ZOHO STYLE THEME ---
        const colorText: [number, number, number] = [30, 30, 30]; // Nearly black
        const colorSubText: [number, number, number] = [80, 80, 80]; // Dark Gray
        const colorLightGray: [number, number, number] = [245, 245, 245]; // Very Light Gray
        const colorLine: [number, number, number] = [230, 230, 230]; // Border lines

        // --- HEADER ---
        // 1. Logo (Top Left)
        try {
            const logoPath = path.join(process.cwd(), 'public/urbanclay-logo.png');
            if (fs.existsSync(logoPath)) {
                const logoBase64 = fs.readFileSync(logoPath).toString('base64');
                doc.addImage(logoBase64, 'PNG', margin, 15, 20, 20);
            }
        } catch (e) { }

        // 2. Company Address (Top Right)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colorText);
        doc.text("Urbanclay Earthy Elements", pageWidth - margin, 18, { align: 'right' });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colorSubText);
        const companyAddr = [
            "#610, 80 Feet Rd, 4th Block",
            "Koramangala, Bengaluru, Karnataka 560034",
            "India",
            "GSTIN: 29AAICU5657L1Z9"
        ];
        let addrY = 23;
        companyAddr.forEach(line => {
            doc.text(line, pageWidth - margin, addrY, { align: 'right' });
            addrY += 4;
        });

        // 3. Document Title (Centered)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(...colorText);
        doc.setCharSpace(1);
        doc.text("DELIVERY CHALLAN", pageWidth / 2, 50, { align: 'center' });
        doc.setCharSpace(0);

        // 4. Order Ref# (Right side aligned with title level)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`# ${order.orderId}`, pageWidth - margin, 50, { align: 'right' });


        // --- CLIENT & ADDRESS INFO ---
        let contentY = 65;

        // Bill To (Consignee)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colorSubText);
        doc.text("Consignee (Bill To)", margin, contentY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colorText);
        doc.text(order.clientName || "Valued Client", margin, contentY + 5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colorText);
        const billingAddr = doc.splitTextToSize(order.billingAddress || "", 80);
        doc.text(billingAddr, margin, contentY + 10);

        let clientCursorY = contentY + 10 + (billingAddr.length * 4);

        if (order.gstNumber) {
            clientCursorY += 5;
            doc.setFont("helvetica", "bold");
            doc.text(`GSTIN: ${order.gstNumber}`, margin, clientCursorY);
        }

        // Delivery Address (Consignee Ship To)
        let shipToY = clientCursorY + 10;
        if (order.shippingAddress && order.shippingAddress !== order.billingAddress) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(...colorSubText);
            doc.text("Deliver To", margin, shipToY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...colorText);
            const shippingAddr = doc.splitTextToSize(order.shippingAddress || "", 80);
            doc.text(shippingAddr, margin, shipToY + 5);
        }

        // --- DATE STRIP ---
        const stripY = Math.max(shipToY + 20, 110);

        doc.setFillColor(...colorLightGray);
        doc.rect(margin, stripY, pageWidth - (margin * 2), 12, 'F');

        const col1X = margin + 5;
        const col2X = margin + 80;
        const col3X = margin + 140;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...colorText);

        doc.text("Challan Date", col1X, stripY + 4);
        doc.text("Order Date", col2X, stripY + 4);
        doc.text("Vehicle No.", col3X, stripY + 4);

        doc.setFont("helvetica", "normal");
        const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        doc.text(today, col1X, stripY + 9);
        doc.text(new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), col2X, stripY + 9);
        doc.text("_________________", col3X, stripY + 9); // Placeholder for Vehicle No

        // --- SUBJECT ---
        const subjectY = stripY + 18;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...colorText);
        doc.text("Subject:", margin, subjectY);
        doc.setFont("helvetica", "normal");
        doc.text("Delivery of Terracotta Materials Against Order", margin + 18, subjectY);

        // --- TABLE ---
        const tableY = subjectY + 10;

        const tableBody = order.lineItems.map((item: any, index: number) => [
            index + 1,
            item.name,
            item.quantity + " Nos", // Assuming Nos/Units, or better to use unit from item if available
            "" // Remarks column
        ]);

        autoTable(doc, {
            startY: tableY,
            head: [['#', 'Item & Description', 'Quantity', 'Remarks']],
            body: tableBody,
            theme: 'plain', // Use plain to strip default grid lines
            headStyles: {
                fillColor: colorLightGray,
                textColor: colorText,
                fontStyle: 'bold',
                font: 'helvetica',
                fontSize: 8,
                halign: 'left',
                cellPadding: 3
            },
            bodyStyles: {
                textColor: colorText,
                fontSize: 9,
                cellPadding: 3,
                valign: 'top',
                lineColor: colorLine,
                lineWidth: { bottom: 0.1 } // Only horizontal dividers
            },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 100 },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 40 }
            },
            margin: { left: margin, right: margin },
            didDrawCell: (data: any) => {
                if (data.section === 'body' && data.column.index === 1) {
                    const item = order.lineItems[data.row.index];
                    const cell = data.cell;
                    const cleanX = cell.x + 3;
                    const cleanY = cell.y + 4;

                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(9);
                    doc.text(item.name, cleanX, cleanY);

                    if (item.description) {
                        const nameDim = doc.getTextDimensions(item.name);
                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(8);
                        doc.setTextColor(...colorSubText);
                        doc.text(item.description, cleanX, cleanY + nameDim.h + 2);
                        doc.setTextColor(...colorText);
                    }
                }
            },
            willDrawCell: (data: any) => {
                // Hide default text to prevent overlap with didDrawCell
                if (data.section === 'body' && data.column.index === 1) {
                    doc.setTextColor(255, 255, 255);
                }
            }
        });

        // --- FOOTER & SIGNATURES ---
        // @ts-ignore
        const finalY = (doc as any).lastAutoTable.finalY + 20;

        // Declarations
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colorSubText);
        doc.text("Declaration:", margin, finalY);
        doc.text("1. Goods received in good condition.", margin, finalY + 5);
        doc.text("2. Please retain this challan for your records.", margin, finalY + 10);

        // Signatures
        const sigY = finalY + 40;

        doc.setDrawColor(...colorText);
        doc.setLineWidth(0.1);

        // Receiver Sig
        doc.line(margin, sigY, margin + 60, sigY);
        doc.text("Receiver's Signature", margin, sigY + 5);

        // Authorised Sig
        doc.line(pageWidth - margin - 60, sigY, pageWidth - margin, sigY);
        doc.text("Authorised Signatory", pageWidth - margin - 60, sigY + 5);
        doc.text("For Urbanclay Earthy Elements", pageWidth - margin - 60, sigY - 15);


        const pdfBuffer = doc.output('arraybuffer');

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="challan-${order.orderId}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error generating Challan PDF:', error);
        return NextResponse.json({ error: 'Failed to generate Challan PDF' }, { status: 500 });
    }
}
