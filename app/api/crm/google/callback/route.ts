import { NextResponse } from 'next/server';
import { GOOGLE_CONFIG, fetchGoogleContacts } from '@/lib/google-contacts';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        // Exchange code for tokens
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

        const contacts = await fetchGoogleContacts(tokens.access_token);

        // Return the contacts to the frontend for selection
        // In a real app, you might save these to a session or temporary storage
        // Here we'll redirect back to CRM with the contacts (simplification)

        return NextResponse.redirect(`${GOOGLE_CONFIG.redirectUri.replace('/api/crm/google/callback', '/dashboard/crm')}?sync=success&data=${encodeURIComponent(JSON.stringify(contacts.slice(0, 50)))}`);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
