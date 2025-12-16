'use server';

import { getTrafficData, TrafficReport } from '@/lib/analytics-service';

export async function fetchTrafficStats(): Promise<TrafficReport> {
    return await getTrafficData();
}
