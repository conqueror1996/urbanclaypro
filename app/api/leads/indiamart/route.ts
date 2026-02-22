import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const INDIA_MART_API_KEY = process.env.INDIAMART_CRM_KEY;

        if (!INDIA_MART_API_KEY) {
            console.error("IndiaMART API Key is missing in environment variables.");
            return NextResponse.json({ success: false, error: "Configuration Missing" }, { status: 500 });
        }

        // Endpoint for IndiaMART v2 API
        const apiUrl = `https://mapi.indiamart.com/wservce/crm/crmListing/v2/?glusr_crm_key=${INDIA_MART_API_KEY}`;

        console.log("Fetching leads from IndiaMART via Vercel Edge/Serverless...");
        const response = await fetch(apiUrl, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`IndiaMART API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // IndiaMART typically returns an array of objects or an error message object
        if (data.Error_Message || data.Code === 400 || !Array.isArray(data)) {
            console.log("IndiaMART API returned no new leads or an error:", data.Error_Message || data);
            return NextResponse.json({ success: true, message: "No new leads found at this time.", details: data });
        }

        console.log(`Fetched ${data.length} potential leads from IndiaMART.`);

        // Process leads and insert into Sanity
        let insertedCount = 0;
        let skippedCount = 0;

        for (const lead of data) {
            const uniqueId = lead.UNIQUE_QUERY_ID;

            // Check if the lead already exists in Sanity to prevent duplicates
            const existingLead = await writeClient.fetch(
                `*[_type == "crmLead" && notes match $uniqueId][0]`,
                { uniqueId: uniqueId }
            );

            if (existingLead) {
                skippedCount++;
                continue;
            }

            // Clean up name
            let cleanerName = lead.SENDER_NAME || 'IndiaMART Prospect';
            // Sometimes IndiaMART passes unformatted names
            cleanerName = cleanerName.trim().replace(/\s+/g, ' ');

            // Determine if the lead is "Hot" based on keywords in exactly what they asked for
            // Add other keywords according to what is valuable to UrbanClay
            const enquiry = lead.ENQ_MESSAGE || '';
            const isSerious = enquiry.toLowerCase().includes('immediate')
                || enquiry.toLowerCase().includes('urgent')
                || enquiry.toLowerCase().includes('bulk')
                || parseInt(lead.PRODUCT_PRICE || '0') > 50000;


            // Map IndiaMART fields to our detailed crmLead schema
            const newSanityLead = {
                _type: 'crmLead',
                clientName: cleanerName,
                role: 'owner', // Defaulting to owner, update if needed
                company: lead.SENDER_COMPANY || '',
                email: lead.SENDER_EMAIL || '',
                phone: lead.SENDER_MOBILE || '',
                location: lead.SENDER_CITY || lead.SENDER_STATE || '',
                category: 'indiamart', // Source tagging
                stage: 'new',
                statusIndicator: 'action_needed',
                leadDate: new Date(lead.QUERY_TIME || Date.now()).toISOString().split('T')[0],
                leadTime: lead.QUERY_TIME ? lead.QUERY_TIME.split(' ')[1] : new Date().toLocaleTimeString(),
                address: lead.SENDER_ADDRESS || '',
                requirements: `[IndiaMART Lead]\n${lead.ENQ_MESSAGE || 'No extensive message provided.'}`,
                productName: lead.PRODUCT_NAME || lead.SUBJECT || '',
                isSerious: isSerious,
                notes: `IndiaMART Query ID: ${uniqueId}\nOriginal Subject: ${lead.SUBJECT || 'N/A'}\nSender Mobile: ${lead.SENDER_MOBILE_ALT || 'N/A'}\nGLUSR_USR_ID: ${lead.GLUSR_USR_ID || 'N/A'}`,
            };

            // Create document in Sanity CRM
            await writeClient.create(newSanityLead);
            insertedCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Successfully synced leads from IndiaMART. Inserted ${insertedCount}. Skipped ${skippedCount} duplicates.`,
            stats: { fetched: data.length, inserted: insertedCount, skipped: skippedCount }
        });

    } catch (error: any) {
        console.error("Error fetching IndiaMART leads:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
