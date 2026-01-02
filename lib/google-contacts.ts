export const GOOGLE_CONFIG = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://claytile.in'}/api/crm/google/callback`,
    scopes: ['https://www.googleapis.com/auth/contacts.readonly']
};

export async function fetchGoogleContacts(accessToken: string) {
    let allContacts: any[] = [];
    let nextPageToken = '';

    try {
        do {
            const url = `https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&pageSize=1000${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (!response.ok) break;

            const data = await response.json();
            const contacts = data.connections?.map((person: any) => ({
                name: person.names?.[0]?.displayName || 'Unknown',
                email: person.emailAddresses?.[0]?.value || '',
                phone: person.phoneNumbers?.[0]?.canonicalForm || person.phoneNumbers?.[0]?.value || '',
                source: 'google'
            })) || [];

            allContacts = [...allContacts, ...contacts];
            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        return allContacts;
    } catch (error) {
        console.error("Error fetching all Google contacts:", error);
        return allContacts;
    }
}
