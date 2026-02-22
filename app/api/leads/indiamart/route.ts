import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const INDIA_MART_API_KEY = process.env.INDIAMART_CRM_KEY;

        if (!INDIA_MART_API_KEY) {
            console.error("IndiaMART API Key is missing in environment variables.");
            return NextResponse.json({ success: false, error: "Configuration Missing" }, { status: 500 });
        }

        // 1. Ensure the Vercel Postgres table exists
        await sql`
            CREATE TABLE IF NOT EXISTS indiamart_leads (
                id SERIAL PRIMARY KEY,
                query_id VARCHAR(255) UNIQUE NOT NULL,
                client_name VARCHAR(255),
                company VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(50),
                location VARCHAR(255),
                query_time TIMESTAMP,
                product_name VARCHAR(255),
                enquiry_message TEXT,
                is_serious BOOLEAN DEFAULT FALSE,
                raw_data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

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

        if (data.Error_Message || data.Code === 400 || !Array.isArray(data)) {
            console.log("IndiaMART API returned no new leads or an error:", data.Error_Message || data);
            return NextResponse.json({ success: true, message: "No new leads found at this time.", details: data });
        }

        console.log(`Fetched ${data.length} potential leads from IndiaMART.`);

        // Process leads and insert into Vercel Storage (Postgres)
        let insertedCount = 0;
        let skippedCount = 0;

        for (const lead of data) {
            const uniqueId = lead.UNIQUE_QUERY_ID;

            // Checking for duplicates is natively handled by the UNIQUE constraint on query_id
            // But we can check or rely on ON CONFLICT
            try {
                let cleanerName = lead.SENDER_NAME || 'IndiaMART Prospect';
                cleanerName = cleanerName.trim().replace(/\s+/g, ' ');

                const enquiry = lead.ENQ_MESSAGE || '';
                const isSerious = enquiry.toLowerCase().includes('immediate')
                    || enquiry.toLowerCase().includes('urgent')
                    || enquiry.toLowerCase().includes('bulk')
                    || parseInt(lead.PRODUCT_PRICE || '0') > 50000;

                // Insert into Vercel Postgres Database Storage
                await sql`
                    INSERT INTO indiamart_leads (
                        query_id, client_name, company, email, phone, location, 
                        query_time, product_name, enquiry_message, is_serious, raw_data
                    ) VALUES (
                        ${uniqueId}, ${cleanerName}, ${lead.SENDER_COMPANY || ''}, ${lead.SENDER_EMAIL || ''}, 
                        ${lead.SENDER_MOBILE || ''}, ${lead.SENDER_CITY || lead.SENDER_STATE || ''}, 
                        ${lead.QUERY_TIME ? new Date(lead.QUERY_TIME).toISOString() : new Date().toISOString()}, 
                        ${lead.PRODUCT_NAME || lead.SUBJECT || ''}, ${enquiry}, ${isSerious}, ${JSON.stringify(lead)}
                    )
                    ON CONFLICT (query_id) DO NOTHING;
                `;

                insertedCount++;
            } catch (insertError: any) {
                // If it hits a conflict DO NOTHING should handle it, but catch any anomalies
                if (insertError.message && insertError.message.includes('duplicate key')) {
                    skippedCount++;
                } else {
                    console.error("DB Insert Error:", insertError);
                }
            }
        }

        // Quick recalculation if ON CONFLICT DO NOTHING didn't throw but skipped rows
        // Note: insertedCount here just means we attempted insert without crashing. 
        // Real inserted vs skipped is abstracted by Postgres ON CONFLICT, which is totally fine and fast!

        return NextResponse.json({
            success: true,
            message: `Successfully synced leads from IndiaMART into Vercel Database Storage. Processed ${data.length} leads.`,
            stats: { processed: data.length }
        });

    } catch (error: any) {
        console.error("Error fetching IndiaMART leads:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
