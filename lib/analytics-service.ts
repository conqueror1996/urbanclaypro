import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Helper to clean private key from env vars (handle newlines and quotes)
const formatPrivateKey = (key: string | undefined) => {
    if (!key) return undefined;

    let cleanKey = key;

    // 1. Handle literal \n characters first (so we can find the markers if they are separated by \n)
    if (cleanKey.includes('\\n')) {
        cleanKey = cleanKey.replace(/\\n/g, '\n');
    }

    // 2. Extract the PEM block explicitly
    const startMarker = '-----BEGIN PRIVATE KEY-----';
    const endMarker = '-----END PRIVATE KEY-----';
    const startIndex = cleanKey.indexOf(startMarker);
    const endIndex = cleanKey.lastIndexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
        // Extract exactly from Start of Begin to End of End
        cleanKey = cleanKey.substring(startIndex, endIndex + endMarker.length);
    } else {
        // Fallback or Error: If markers aren't found, the logic below checks headers anyway
        // But let's try to clean usage quotes just in case markers are malformed
        if (cleanKey.startsWith('"') || cleanKey.startsWith("'")) cleanKey = cleanKey.slice(1);
        if (cleanKey.endsWith('"') || cleanKey.endsWith("'") || cleanKey.endsWith(',')) cleanKey = cleanKey.slice(0, -1);
        // Handle trailing comma + quote combo
        if (cleanKey.endsWith('",')) cleanKey = cleanKey.slice(0, -2);
        if (cleanKey.endsWith("',")) cleanKey = cleanKey.slice(0, -2);
    }

    // 3. Validation
    const hasHeader = cleanKey.includes(startMarker);
    const hasFooter = cleanKey.includes(endMarker);

    if (!hasHeader || !hasFooter) {
        console.error('[Analytics] Invalid Private Key format. Missing BEGIN/END headers.');
        // Don't return the broken key, return undefined so it falls back to demo mode safely
        // But to debug, we might want to return it or let the caller handle it.
        // For now, let's just log and return the cleaned key to let the library throw the specific error,
        // but the log above will help the user.
    }

    return cleanKey;
};

const PROPERTY_ID = process.env.GA_PROPERTY_ID; // e.g. '342342342'
const CLIENT_EMAIL = process.env.GA_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GA_PRIVATE_KEY;

export interface TrafficData {
    period: string;
    visitors: number;
    change?: number; // percentage change vs previous period (optional)
}

export interface TrafficReport {
    today: number;
    yesterday: number;
    lastMonth: number;
    threeMonthsAgo: number;
    eightMonthsAgo: number;
    isDemo?: boolean;
    error?: string;
}

export async function getTrafficData(): Promise<TrafficReport> {
    const formattedKey = formatPrivateKey(PRIVATE_KEY);

    // Debug logging to help user trace the issue in server terminal
    console.log('[Analytics] Connecting with:', {
        propertyId: PROPERTY_ID ? 'Set' : 'Missing',
        email: CLIENT_EMAIL ? 'Set' : 'Missing',
        privateKey: formattedKey
            ? `Set (Length: ${formattedKey.length}, Starts with: ${formattedKey.substring(0, 27)}...)`
            : 'Missing',
    });

    // 1. Check for credentials
    if (!PROPERTY_ID || !CLIENT_EMAIL || !formattedKey) {
        console.warn('Google Analytics credentials missing or invalid. Returning DEMO data.');
        return {
            today: 142,
            yesterday: 118,
            lastMonth: 3450,
            threeMonthsAgo: 12105,
            eightMonthsAgo: 1045,
            isDemo: true,
            error: 'Missing Credentials in .env'
        };
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: {
            client_email: CLIENT_EMAIL,
            private_key: formattedKey,
        },
    });

    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                { startDate: 'today', endDate: 'today' },           // index 0: Today
                { startDate: 'yesterday', endDate: 'yesterday' },   // index 1: Yesterday
                { startDate: '30daysAgo', endDate: '30daysAgo' },   // index 2: 1 Month Ago
                { startDate: '90daysAgo', endDate: '90daysAgo' },   // index 3: 3 Months Ago
                { startDate: '240daysAgo', endDate: '240daysAgo' }, // index 4: 8 Months Ago
            ],
            metrics: [
                { name: 'activeUsers' },
            ],
        });

        // Initialize defaults
        const result: TrafficReport = {
            today: 0,
            yesterday: 0,
            lastMonth: 0,
            threeMonthsAgo: 0,
            eightMonthsAgo: 0,
            isDemo: false
        };

        // Map 'dateRange' value (e.g. "date_range_0") to our keys
        response.rows?.forEach(row => {
            const rangeDimension = row.dimensionValues?.[0].value;
            const users = parseInt(row.metricValues?.[0].value || '0', 10);

            switch (rangeDimension) {
                case 'date_range_0': result.today = users; break;
                case 'date_range_1': result.yesterday = users; break;
                case 'date_range_2': result.lastMonth = users; break;
                case 'date_range_3': result.threeMonthsAgo = users; break;
                case 'date_range_4': result.eightMonthsAgo = users; break;
            }
        });

        return result;

    } catch (e: any) {
        console.error('Analytics API Error:', e.message);
        // Fallback to Demo Data on error too, to keep UI looking good
        return {
            today: 142,
            yesterday: 118,
            lastMonth: 3450,
            threeMonthsAgo: 12105,
            eightMonthsAgo: 1045,
            isDemo: true,
            error: `Connection Failed: ${e.message || JSON.stringify(e)}` // Show exact error
        };
    }
}
