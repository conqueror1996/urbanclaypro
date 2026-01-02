export const GOOGLE_CONFIG = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://claytile.in'}/api/crm/google/callback`,
    scopes: ['https://www.googleapis.com/auth/contacts.readonly']
};

export async function fetchGoogleContacts(accessToken: string) {
    const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&pageSize=1000', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Google contacts');
    }

    const data = await response.json();
    return data.connections?.map((person: any) => ({
        name: person.names?.[0]?.displayName || 'Unknown',
        email: person.emailAddresses?.[0]?.value || '',
        phone: person.phoneNumbers?.[0]?.canonicalForm || person.phoneNumbers?.[0]?.value || '',
        source: 'google'
    })) || [];
}
