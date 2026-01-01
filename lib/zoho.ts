
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

/**
 * Create an Invoice in Zoho Books / Zoho Invoice
 */
export async function createZohoInvoice(orderData: any) {
    const accessToken = await getAccessToken();
    const orgId = process.env.ZOHO_ORG_ID;

    if (!accessToken || !orgId) {
        console.warn("⚠️ Zoho Books Org ID or Auth missing. Skipping Invoice creation.");
        return { success: false, error: 'Config Missing' };
    }

    try {
        // 1. Create/Find Customer in Zoho Books
        const contactResponse = await fetch(`https://books.zoho.in/api/v3/contacts?organization_id=${orgId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact_name: orderData.clientName,
                company_name: orderData.clientName,
                email: orderData.clientEmail,
                phone: orderData.clientPhone,
                contact_type: 'customer'
            })
        });
        const contactResult = await contactResponse.json();
        const contactId = contactResult.contact?.contact_id;

        if (!contactId) throw new Error("Could not create/find contact in Zoho Books");

        // 2. Create Invoice
        const invoiceData = {
            customer_id: contactId,
            reference_number: orderData.orderId,
            date: new Date().toISOString().split('T')[0],
            due_date: new Date().toISOString().split('T')[0],
            line_items: [
                {
                    name: orderData.productName,
                    description: `Order ID: ${orderData.orderId}\nTimeline: ${orderData.deliveryTimeline}`,
                    rate: orderData.amount,
                    quantity: 1
                }
            ],
            notes: orderData.terms,
            allow_partial_payments: false
        };

        const invoiceResponse = await fetch(`https://books.zoho.in/api/v3/invoices?organization_id=${orgId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });

        const result = await invoiceResponse.json();

        if (result.code === 0) {
            console.log("✅ Zoho Invoice Created:", result.invoice.invoice_id);
            return { success: true, invoiceId: result.invoice.invoice_id, invoiceUrl: result.invoice.invoice_url };
        } else {
            console.error("⚠️ Zoho Invoice Error:", result);
            return { success: false, error: result.message };
        }
    } catch (error) {
        console.error("❌ Zoho Invoice creation failed:", error);
        return { success: false, error };
    }
}
