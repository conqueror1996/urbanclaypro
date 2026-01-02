import { NextResponse } from 'next/server';
import { GOOGLE_CONFIG, fetchGoogleContacts } from '@/lib/google-contacts';
import { saveGoogleContactsToSanity } from '@/app/actions/crm';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CONFIG.clientId!,
                client_secret: GOOGLE_CONFIG.clientSecret!,
                redirect_uri: GOOGLE_CONFIG.redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenRes.json();

        if (tokens.error) {
            return NextResponse.json({ error: tokens.error_description }, { status: 500 });
        }

        // 1. Fetch ALL contacts (using the pagination built into fetchGoogleContacts)
        const contacts = await fetchGoogleContacts(tokens.access_token);

        // 2. Save directly to Sanity
        if (contacts && contacts.length > 0) {
            await saveGoogleContactsToSanity(contacts);
        }

        // 3. Redirect back with success flag (no data in URL!)
        return NextResponse.redirect(`${GOOGLE_CONFIG.redirectUri.replace('/api/crm/google/callback', '/dashboard/crm')}?sync=complete&count=${contacts.length}`);

    } catch (error: any) {
        console.error("Callback Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
