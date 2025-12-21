'use server';

export async function exchangeZohoCode(code: string, clientId: string, clientSecret: string, redirectUri: string, domain: string = 'www.zoho.in') {
    if (!code || !clientId || !clientSecret) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const accountDomain = domain.replace('www.', 'accounts.');
        const url = `https://${accountDomain}/oauth/v2/token`;

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('redirect_uri', redirectUri);
        params.append('code', code);

        const response = await fetch(url, {
            method: 'POST',
            body: params
        });

        const data = await response.json();

        if (data.error) {
            return { success: false, error: data.error };
        }

        return {
            success: true,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in
        };
    } catch (error) {
        return { success: false, error: "Network error during token exchange" };
    }
}
