
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import jsPDF from 'jspdf';
import path from 'path';
import fs from 'fs';

// Sanity Client Config
import { projectId, dataset, apiVersion } from '@/sanity/env';
const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ siteId: string }> }
) {
    const params = await props.params;
    try {
        const { siteId } = params;
        const searchParams = request.nextUrl.searchParams;

        // Customizations from UI
        const customMessage = searchParams.get('message') || "Thank you for choosing UrbanClay. Your space is now a testament to timeless beauty and sustainable living. We promise that our creations will stand by you, ageing gracefully through the seasons.";
        const signatory = searchParams.get('signatory') || "Sanjay Takale";
        const warrantyYears = searchParams.get('years') || "25";
        const includeSig = searchParams.get('includeSig') === 'true';

        // Fetch Site Data
        const query = `*[_type == "site" && _id == $siteId][0]`;
        const site = await client.fetch(query, { siteId });

        if (!site) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 });
        }

        // Initialize PDF - Landscape A4
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();

        // --- DESIGN: PREMIUM BACKGROUND & BORDER ---

        // 1. Warm Cream Background
        doc.setFillColor(252, 250, 245); // Very light warm beige
        doc.rect(0, 0, width, height, 'F');

        // 2. Ornate Border
        const margin = 10;
        doc.setDrawColor(180, 90, 60); // Terracotta
        doc.setLineWidth(1.5);
        doc.rect(margin, margin, width - (margin * 2), height - (margin * 2)); // Outer Thick

        doc.setDrawColor(42, 30, 22); // Ink/Dark Brown
        doc.setLineWidth(0.3);
        doc.rect(margin + 2, margin + 2, width - (margin * 2 + 4), height - (margin * 2 + 4)); // Inner Thin

        // --- CONTENT ---

        // Logo (Placeholder if file missing, but try to load)
        try {
            // Assuming same logo location as other PDFs
            const logoPath = path.join(process.cwd(), 'public', 'logo.png'); // Or urbanclay logo
            // If specific high-res logo exists for print
            if (fs.existsSync(logoPath)) {
                const logoData = fs.readFileSync(logoPath).toString('base64');
                // Centered top
                doc.addImage(logoData, 'PNG', (width / 2) - 15, margin + 15, 30, 0);
            }
        } catch (e) {
            // Fallback Text Logo if image fails
            doc.setFont("times", "bold");
            doc.setFontSize(24);
            doc.setTextColor(180, 90, 60);
            doc.text("URBANCLAY", width / 2, margin + 25, { align: 'center' });
        }

        let yPos = 60;

        // HEADER
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100); // Grey
        doc.text("ESTD. 2015", width / 2, yPos, { align: 'center' });

        yPos += 10;
        doc.setFont("times", "bold");
        doc.setFontSize(36);
        doc.setTextColor(42, 30, 22); // Dark Ink
        doc.text("Certificate of Authenticity", width / 2, yPos, { align: 'center' });

        yPos += 8;
        doc.setFont("helvetica", "normal"); // Sans serif for contrast
        doc.setFontSize(10);
        doc.setTextColor(180, 90, 60); // Terracotta
        doc.setCharSpace(2); // Wide spacing
        doc.text(`& ${warrantyYears}-YEAR PRODUCT WARRANTY`, width / 2, yPos, { align: 'center' });

        // SEPARATOR
        yPos += 15;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        doc.line(width / 2 - 40, yPos, width / 2 + 40, yPos);

        // RECIPIENT
        yPos += 20;
        doc.setFont("times", "italic");
        doc.setFontSize(14);
        doc.setTextColor(80, 80, 80);
        doc.setCharSpace(0);
        doc.text("This document certifies that the architectural ceramics installed at", width / 2, yPos, { align: 'center' });

        yPos += 12;
        doc.setFont("times", "bold");
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text(site.name || "The Client Project", width / 2, yPos, { align: 'center' });

        yPos += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(site.client || "Client Name", width / 2, yPos, { align: 'center' });

        // EMOTIONAL BODY TEXT
        yPos += 20;
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        const splitText = doc.splitTextToSize(customMessage, 160);
        doc.text(splitText, width / 2, yPos, { align: 'center' });

        // VERIFICATION BADGE
        yPos += 30;
        doc.setDrawColor(180, 90, 60);
        doc.setFillColor(255, 255, 255);
        doc.circle(width / 2, yPos + 5, 12, 'FD');
        doc.setFont("times", "bold");
        doc.setFontSize(8);
        doc.setTextColor(180, 90, 60);
        doc.text("100%", width / 2, yPos + 3, { align: 'center' });
        doc.text("CLAY", width / 2, yPos + 7, { align: 'center' });

        // SIGNATURES
        const sigY = height - margin - 35;

        // Left: Date
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(42, 30, 22);
        doc.text("DATE OF ISSUE", 60, sigY);
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.text(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), 60, sigY + 8);

        // Right: Founder
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("AUTHORIZED SIGNATORY", width - 60, sigY, { align: 'right' });

        if (includeSig) {
            doc.setFont("zapfdingbats", "normal"); // Or simplistic script simulation
            doc.setFontSize(24);
            doc.setTextColor(0, 50, 100); // Blue ink
            //  doc.text(signatory, width - 60, sigY + 10, { align: 'right' }); // Basic Font Signature
            // Actually, let's use a script-like font if possible or just Italic Times
            doc.setFont("times", "italic");
            doc.text(signatory, width - 60, sigY + 12, { align: 'right' });
        } else {
            // Line for manual signing
            doc.setLineWidth(0.2);
            doc.setDrawColor(100, 100, 100);
            doc.line(width - 90, sigY + 15, width - 30, sigY + 15);
        }

        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text("Founder, UrbanClay", width - 60, sigY + 20, { align: 'right' });


        // Generate Buffer
        const pdfBuffer = doc.output('arraybuffer');

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="Warranty_${site.name.replace(/\s+/g, '_')}.pdf"`,
            },
        });

    } catch (error: any) {
        console.error("Warranty PDF Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
