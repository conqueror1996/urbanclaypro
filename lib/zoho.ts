
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
    domain: process.env.ZOHO_DOMAIN || 'www.zoho.in'
};

async function getAccessToken(): Promise<string | null> {
    if (!config.refreshToken || !config.clientId || !config.clientSecret) {
        console.error("❌ Zoho Configuration Missing.");
        return null;
    }

    try {
        const accountDomain = config.domain.replace('www.', 'accounts.');
        const url = `https://${accountDomain}/oauth/v2/token`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                refresh_token: config.refreshToken,
                client_id: config.clientId,
                client_secret: config.clientSecret,
                grant_type: 'refresh_token',
                // Optional: Some clients require redirect_uri even for refresh
                redirect_uri: `https://${config.domain.includes('in') ? 'claytile.in' : 'urbanclay.in'}`
            })
        });

        const data = await response.json();
        if (data.error) {
            console.error("❌ Zoho Auth Error:", data.error);
            return null;
        }

        return data.access_token || null;
    } catch (error) {
        console.error("❌ Failed to fetch Zoho Access Token:", error);
        return null;
    }
}

/**
 * Search GST Details (Mock logic, can be replaced with real GST API)
 */
export async function getGSTDetails(gstin: string) {
    // Structural validation
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(gstin)) return { success: false, error: 'Invalid GST Format' };

    try {
        // Here we would typically call an external API or Zoho's internal lookup if available
        // For now, return a success mock or instruct the user to provide API key
        return {
            success: true,
            data: {
                tradeName: "Urban Clay Client",
                legalName: "Urban Clay Architecture Private Limited",
                address: "Plot 45, Industrial Area, Bangalore, KA, 560001",
                state: "Karnataka",
                city: "Bangalore",
                pincode: "560001"
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch GST details' };
    }
}

export async function createZohoLead(leadData: any) {
    const accessToken = await getAccessToken();
    if (!accessToken) return { success: false, error: 'Auth Failed' };

    const zohoRecord = {
        Company: leadData.firmName || 'Individual/Unknown',
        Last_Name: leadData.name || leadData.firmName || 'Web Lead',
        Email: leadData.email,
        Phone: leadData.contact,
        City: leadData.city,
        Description: `${leadData.notes || ''}\n\n--\nProduct: ${leadData.product}\nQuantity: ${leadData.quantity}\nRole: ${leadData.role}\nTimeline: ${leadData.timeline}`,
        Lead_Source: 'Website',
        Designation: leadData.role,
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
            return { success: true, id: result.data[0].details.id };
        }
        return { success: false, details: result };
    } catch (error) {
        return { success: false, error };
    }
}

export async function searchZohoLeads(query: string) {
    const accessToken = await getAccessToken();
    if (!accessToken) return { success: false, error: 'Auth Failed' };

    try {
        const apiDomain = config.domain.includes('zoho.in') ? 'www.zohoapis.in' : 'www.zohoapis.com';
        const url = `https://${apiDomain}/crm/v2/Leads/search?word=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
        });

        const result = await response.json();
        return {
            success: true,
            leads: result.data?.map((lead: any) => ({
                id: lead.id,
                name: lead.Full_Name || `${lead.First_Name || ''} ${lead.Last_Name || ''}`.trim(),
                email: lead.Email,
                phone: lead.Phone || lead.Mobile,
                company: lead.Company
            })) || []
        };
    } catch (error) {
        return { success: false, error };
    }
}

export async function testZohoConnection() {
    const accessToken = await getAccessToken();
    const orgId = process.env.ZOHO_ORG_ID;

    if (!accessToken) return { success: false, error: 'Authentication Failed. Please re-generate your Refresh Token and ensure you include "ZohoBooks.fullaccess.all" in the scopes.' };

    try {
        const booksDomain = config.domain.includes('zoho.in') ? 'books.zoho.in' : 'books.zoho.com';

        // Try to list ALL organizations first to see what we have access to
        const listResponse = await fetch(`https://${booksDomain}/api/v3/organizations`, {
            method: 'GET',
            headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
        });
        const listData = await listResponse.json();

        if (listData.code !== 0) {
            return {
                success: false,
                error: `Zoho Auth Success, but API Access Failed: ${listData.message} (Code: ${listData.code})`,
                hint: 'Ensure your Refresh Token was created with the scope: ZohoBooks.fullaccess.all'
            };
        }

        const orgs = listData.organizations || [];
        const currentOrg = orgs.find((o: any) => o.organization_id === orgId);

        if (currentOrg) {
            return {
                success: true,
                message: 'Zoho Books Connected Perfectly!',
                orgName: currentOrg.name,
                currency: currentOrg.currency_code,
                domain: booksDomain
            };
        } else {
            return {
                success: false,
                error: `Org ID "${orgId}" not found in your account.`,
                availableOrgs: orgs.map((o: any) => ({ name: o.name, id: o.organization_id })),
                hint: 'Copy one of the IDs below and update your ZOHO_ORG_ID in Vercel.'
            };
        }
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function createZohoInvoice(orderData: any) {
    const accessToken = await getAccessToken();
    const orgId = process.env.ZOHO_ORG_ID;
    const booksDomain = config.domain.includes('zoho.in') ? 'books.zoho.in' : 'books.zoho.com';

    if (!accessToken || !orgId) return { success: false, error: 'Config Missing' };

    try {
        // 1. Find or Create Customer in Zoho Books
        let contactId = null;
        const email = (orderData.clientEmail || '').trim().toLowerCase();

        // Search by email first
        const searchResponse = await fetch(`https://${booksDomain}/api/v3/contacts?organization_id=${orgId}&email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
        });
        const searchResult = await searchResponse.json();

        if (searchResult.contacts && searchResult.contacts.length > 0) {
            contactId = searchResult.contacts[0].contact_id;
            console.log(`🔍 Existing Zoho Contact found: ${contactId}`);
        } else {
            const contactPayload = {
                contact_name: orderData.clientName,
                company_name: orderData.clientName,
                email: orderData.clientEmail,
                phone: orderData.clientPhone,
                gst_no: orderData.gstNumber,
                pan_no: orderData.panNumber,
                contact_type: 'customer',
                billing_address: { address: orderData.billingAddress },
                shipping_address: { address: orderData.shippingAddress }
            };

            const contactResponse = await fetch(`https://${booksDomain}/api/v3/contacts?organization_id=${orgId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactPayload)
            });
            const contactResult = await contactResponse.json();
            contactId = contactResult.contact?.contact_id;

            if (!contactId) {
                console.error("❌ Zoho Contact Creation Failed:", contactResult);
                throw new Error(contactResult.message || "Could not create contact in Zoho Books");
            }
        }

        // 2. Create Invoice
        const invoiceData = {
            customer_id: contactId,
            reference_number: orderData.orderId,
            date: new Date().toISOString().split('T')[0],
            due_date: new Date().toISOString().split('T')[0],
            line_items: orderData.lineItems?.map((item: any) => {
                const lineItem: any = {
                    name: item.name,
                    description: item.description,
                    rate: item.rate,
                    quantity: item.quantity,
                    discount: `${item.discount}%`
                };
                if (item.taxId) lineItem.tax_id = item.taxId;
                return lineItem;
            }),
            shipping_charge: orderData.shippingCharges || 0,
            adjustment: orderData.adjustment || 0,
            notes: orderData.customerNotes || orderData.terms,
            allow_partial_payments: false
        };

        const invoiceResponse = await fetch(`https://${booksDomain}/api/v3/invoices?organization_id=${orgId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });

        const result = await invoiceResponse.json();

        if (result.code === 0) {
            return {
                success: true,
                invoiceId: result.invoice.invoice_id,
                invoiceNumber: result.invoice.invoice_number,
                invoiceUrl: result.invoice.invoice_url,
                customerId: result.invoice.customer_id
            };
        }
        return { success: false, error: result.message };
    } catch (error) {
        return { success: false, error };
    }
}

export async function recordZohoPayment(paymentData: {
    customerId: string;
    invoiceId: string;
    amount: number;
    paymentId: string;
}) {
    const accessToken = await getAccessToken();
    const orgId = process.env.ZOHO_ORG_ID;

    const booksDomain = config.domain.includes('zoho.in') ? 'books.zoho.in' : 'books.zoho.com';

    if (!accessToken || !orgId) return { success: false };

    try {
        const payload = {
            customer_id: paymentData.customerId,
            payment_mode: 'Razorpay',
            amount: paymentData.amount,
            date: new Date().toISOString().split('T')[0],
            reference_number: paymentData.paymentId,
            description: `Payment for Invoice ${paymentData.invoiceId}`,
            invoices: [{ invoice_id: paymentData.invoiceId, amount_applied: paymentData.amount }]
        };

        const response = await fetch(`https://${booksDomain}/api/v3/customerpayments?organization_id=${orgId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return result.code === 0 ? { success: true, paymentId: result.payment.payment_id } : { success: false, error: result.message };
    } catch (error) {
        return { success: false, error };
    }
}

export async function getZohoInvoicePDF(invoiceId: string) {
    const accessToken = await getAccessToken();
    const orgId = process.env.ZOHO_ORG_ID;
    const booksDomain = config.domain.includes('zoho.in') ? 'books.zoho.in' : 'books.zoho.com';

    if (!accessToken || !orgId) return null;

    try {
        const response = await fetch(`https://${booksDomain}/api/v3/invoices/${invoiceId}?organization_id=${orgId}&accept=pdf`, {
            method: 'GET',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`
            }
        });

        if (!response.ok) return null;

        const buffer = await response.arrayBuffer();
        return Buffer.from(buffer);
    } catch (error) {
        console.error("❌ Failed to fetch Zoho PDF:", error);
        return null;
    }
}
