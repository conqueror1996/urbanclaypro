'use server';

import { getTrafficData, TrafficReport, clearRecentErrors } from '@/lib/analytics-service';

export async function fetchTrafficStats(): Promise<TrafficReport> {
    return await getTrafficData();
}

export async function clearAnalyticsLogs(): Promise<{ success: boolean }> {
    return await clearRecentErrors();
}
