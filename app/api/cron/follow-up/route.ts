
import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { sendSampleFollowUpEmail } from '@/lib/email';

export const dynamic = 'force-dynamic'; // Ensure this doesn't get cached

export async function GET(request: Request) {
    // 1. Authorization (Optional: Check for a secret key)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        console.log('🔄 Running Daily Follow-up Cron...');

        // 2. Find leads older than 5 days that haven't received a follow-up
        // Logic: submittedAt < (now - 5 days) AND followUpSent is null
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const isoDate = fiveDaysAgo.toISOString();

        // Query: "Leads submitted before 5 days ago, but NOT older than 10 days (safety), and no follow-up sent yet"
        // We use a 10-day safety limit so we don't accidentally spam leads from 3 years ago if this runs for the first time.
        const query = `*[_type == "lead" && submittedAt < "${isoDate}" && submittedAt > dateTime(now()) - 60*60*24*10 && !defined(followUpSent)]`;

        const leads = await writeClient.fetch(query);
        console.log(`Found ${leads.length} leads eligible for follow-up.`);

        const results = [];

        // 3. Process each lead
        for (const lead of leads) {
            if (!lead.email) {
                console.log(`Skipping lead ${lead._id} (No email)`);
                continue;
            }

            console.log(`📧 Sending follow-up to check on samples: ${lead.email}`);

            // Send Email
            const emailResult = await sendSampleFollowUpEmail(lead);

            if (emailResult && emailResult.success) {
                // 4. Update Sanity to mark as sent (Prevent duplicates)
                await writeClient
                    .patch(lead._id)
                    .set({ followUpSent: true, followUpDate: new Date().toISOString() })
                    .commit();

                results.push({ id: lead._id, status: 'sent', email: lead.email });
            } else {
                results.push({ id: lead._id, status: 'failed', error: emailResult?.error });
            }
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (error) {
        console.error('Cron job failed:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
