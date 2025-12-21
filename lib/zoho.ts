
interface ZohoConfig {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    domain: string;
}

const config: ZohoConfig = {
    clientId: process.env.ZOHO_CLIENT_ID || '',
    clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
    refreshToken: process.env.ZOHO_REFRESH_TOKEN || '',
    domain: process.env.ZOHO_DOMAIN || 'www.zoho.in' // Default to India (.in), change to .com or .eu if needed
};

/**
 * Exchange the Refresh Token for a temporary Access Token
 */
async function getAccessToken(): Promise<string | null> {
    if (!config.refreshToken || !config.clientId || !config.clientSecret) {
        console.error("❌ Zoho Configuration Missing: Check ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN env vars.");
        return null;
    }

    try {
        const params = new URLSearchParams({
            refresh_token: config.refreshToken,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: 'refresh_token'
        });

        // Zoho Accounts URL depends on region. 
        // .in -> https://accounts.zoho.in/oauth/v2/token
        // .com -> https://accounts.zoho.com/oauth/v2/token
        const accountDomain = config.domain.replace('www.', 'accounts.');
        const url = `https://${accountDomain}/oauth/v2/token?${params.toString()}`;

        const response = await fetch(url, { method: 'POST' });
        const data = await response.json();

        if (data.access_token) {
            return data.access_token;
        } else {
            console.error("❌ Zoho Token Error:", data);
            return null;
        }
    } catch (error) {
        console.error("❌ Failed to fetch Zoho Access Token:", error);
        return null;
    }
}

/**
 * Create a Lead in Zoho CRM
 */
export async function createZohoLead(leadData: any) {
    const accessToken = await getAccessToken();
    if (!accessToken) return { success: false, error: 'Auth Failed' };

    // Map your form data to Zoho's Field API Names
    // Note: 'Last_Name' is mandatory in Zoho.
    const zohoRecord = {
        Company: leadData.firmName || 'Individual/Unknown',
        Last_Name: leadData.name || leadData.firmName || 'Web Lead', // Fallback if name is missing
        Email: leadData.email,
        Phone: leadData.contact,
        City: leadData.city,
        Description: `${leadData.notes || ''}\n\n--\nProduct: ${leadData.product}\nQuantity: ${leadData.quantity}\nRole: ${leadData.role}\nTimeline: ${leadData.timeline}`,

        // Custom Logic for Tags/Source
        Lead_Source: 'Website',
        Designation: leadData.role, // If you have a custom field for this, use its API name (e.g., 'Role_on_Project')

        // You can add custom fields if you know their API names:
        // "Project_Type": leadData.product 
    };

    try {
        const apiDomain = config.domain.includes('zoho.in') ? 'www.zohoapis.in' : 'www.zohoapis.com';
        const url = `https://${apiDomain}/crm/v2/Leads`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: [zohoRecord] })
        });

        const result = await response.json();

        if (result.data && result.data[0].status === 'success') {
            console.log("✅ Zoho Lead Created:", result.data[0].details.id);
            return { success: true, id: result.data[0].details.id };
        } else {
            console.error("⚠️ Zoho Implementation Warning:", result);
            return { success: false, details: result };
        }

    } catch (error) {
        console.error("❌ Zoho Submission Error:", error);
        return { success: false, error };
    }
}
