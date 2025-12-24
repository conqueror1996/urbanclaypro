import { client } from '@/sanity/lib/client';

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
    try {
        // Calculate date strings for comparison (ISO format start-of-day)
        const now = new Date();

        const getStartOfDay = (d: Date) => {
            const date = new Date(d);
            date.setHours(0, 0, 0, 0);
            return date.toISOString();
        };

        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

        // Exact days in the past
        const oneMonthAgo = new Date(today); oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const threeMonthsAgo = new Date(today); threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const eightMonthsAgo = new Date(today); eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

        // GROQ Query to count footprints by time ranges
        // Note: Counting huge datasets in real-time can be slow, but for a new site it's fine.
        // For production scale, we'd aggregated this periodically.

        const query = `{
            "today": count(*[_type == "footprint" && timestamp >= $todayStart]),
            "yesterday": count(*[_type == "footprint" && timestamp >= $yesterdayStart && timestamp < $todayStart]),
            "lastMonth": count(*[_type == "footprint" && timestamp >= $monthStart && timestamp < $monthEnd]),
            "threeMonths": count(*[_type == "footprint" && timestamp >= $threeStart && timestamp < $threeEnd]),
            "eightMonths": count(*[_type == "footprint" && timestamp >= $eightStart && timestamp < $eightEnd])
        }`;

        // Define single-day ranges for historical points to match the "Snapshots" concept
        const params = {
            todayStart: getStartOfDay(today),
            yesterdayStart: getStartOfDay(yesterday),

            // For historical points, let's count the whole day of that date
            monthStart: getStartOfDay(oneMonthAgo),
            monthEnd: new Date(new Date(oneMonthAgo).setHours(23, 59, 59, 999)).toISOString(),

            threeStart: getStartOfDay(threeMonthsAgo),
            threeEnd: new Date(new Date(threeMonthsAgo).setHours(23, 59, 59, 999)).toISOString(),

            eightStart: getStartOfDay(eightMonthsAgo),
            eightEnd: new Date(new Date(eightMonthsAgo).setHours(23, 59, 59, 999)).toISOString(),
        };

        const result = await client.fetch(query, params);

        return {
            today: result.today || 0,
            yesterday: result.yesterday || 0,
            lastMonth: result.lastMonth || 0,
            threeMonthsAgo: result.threeMonths || 0,
            eightMonthsAgo: result.eightMonths || 0,
            isDemo: false
        };

    } catch (e: any) {
        console.error('Sanity Analytics Error:', e);
        return {
            today: 0,
            yesterday: 0,
            lastMonth: 0,
            threeMonthsAgo: 0,
            eightMonthsAgo: 0,
            isDemo: false,
            error: `Data Fetch Error: ${e.message}`
        };
    }
}
