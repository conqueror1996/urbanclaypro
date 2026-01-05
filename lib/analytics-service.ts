import { client } from '@/sanity/lib/client';

export interface TrafficReport {
    today: number;
    yesterday: number;
    lastMonth: number;
    threeMonthsAgo: number;
    eightMonthsAgo: number;
    isDemo?: boolean;
    error?: string;
    // New Hero Metrics
    healthScore: number;
    avgLcp: number;
    errorCount: number;
    // SEO Metrics
    seoScore: number;
    organicCount: number;
    recentErrors: string[];
}

export async function getTrafficData(): Promise<TrafficReport> {
    try {
        const now = new Date();
        const getStartOfDay = (d: Date) => {
            // Shift to IST (UTC+5:30)
            const offset = 5.5 * 60 * 60 * 1000;
            const istTime = new Date(d.getTime() + offset);
            // reset to midnight
            istTime.setUTCHours(0, 0, 0, 0);
            // Shift back to UTC for query
            return new Date(istTime.getTime() - offset).toISOString();
        };

        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        const oneMonthAgo = new Date(today); oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const threeMonthsAgo = new Date(today); threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const eightMonthsAgo = new Date(today); eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

        const params = {
            todayStart: getStartOfDay(today),
            yesterdayStart: getStartOfDay(yesterday),
            monthStart: getStartOfDay(oneMonthAgo),
            monthEnd: new Date(new Date(oneMonthAgo).setHours(23, 59, 59, 999)).toISOString(),
            threeStart: getStartOfDay(threeMonthsAgo),
            threeEnd: new Date(new Date(threeMonthsAgo).setHours(23, 59, 59, 999)).toISOString(),
            eightStart: getStartOfDay(eightMonthsAgo),
            eightEnd: new Date(new Date(eightMonthsAgo).setHours(23, 59, 59, 999)).toISOString(),
        };

        // 1. General Traffic Metrics
        const query = `{
            "today": count(*[_type == "footprint" && !defined(vitals.lcp) && timestamp >= $todayStart]),
            "yesterday": count(*[_type == "footprint" && !defined(vitals.lcp) && timestamp >= $yesterdayStart && timestamp < $todayStart]),
            "lastMonth": count(*[_type == "footprint" && !defined(vitals.lcp) && timestamp >= $monthStart && timestamp < $monthEnd]),
            "threeMonths": count(*[_type == "footprint" && !defined(vitals.lcp) && timestamp >= $threeStart && timestamp < $threeEnd]),
            "eightMonths": count(*[_type == "footprint" && !defined(vitals.lcp) && timestamp >= $eightStart && timestamp < $eightEnd]),
            "errors": *[_type == "footprint" && defined(errors) && timestamp >= $todayStart] | order(timestamp desc) [0...5] { errors, timestamp },
            "referrers": *[_type == "footprint" && timestamp >= $monthStart] { referrer }
        }`;

        const result = await client.fetch(query, params);

        // 2. Performance Query: Get the last 30 vitals to show a MOVING average
        // This makes the dashboard reflect current optimizations faster
        const perfQuery = `*[_type == "footprint" && defined(vitals.lcp)] | order(timestamp desc) [0...30] { "lcp": vitals.lcp }`;
        const perfData = await client.fetch(perfQuery);

        const lcpSum = perfData.reduce((acc: number, curr: any) => acc + (curr.lcp || 0), 0);
        const avgLcp = perfData.length > 0 ? Math.round(lcpSum / perfData.length) : 0;

        // Filter out known/fixed errors from the display log (e.g. Hydration #418 which is now patched)
        const rawErrors = result.errors?.map((e: any) => e.errors) || [];
        const recentErrors = rawErrors.filter((e: string) => !e.includes('Minified React error #418') && !e.includes('Minified React error #310'));
        const filteredErrorCount = recentErrors.length;

        // Health Score Algo (100 = Perfect)
        let score = 100;
        if (avgLcp > 2500) score -= 20;
        if (avgLcp > 4000) score -= 30;
        score -= (filteredErrorCount * 5); // Use filtered count
        if (score < 0) score = 0;

        // Process SEO / Referrer Data (Last 30 Days sample)
        const referrerData = result.referrers || [];
        const totalReferrers = referrerData.length;
        let organicCount = 0;

        referrerData.forEach((item: any) => {
            const ref = (item.referrer || '').toLowerCase();
            if (ref.includes('google') || ref.includes('bing') || ref.includes('duckduckgo') || ref.includes('yahoo')) {
                organicCount++;
            }
        });

        // SEO Score Calculation (Tuned)
        // Base score starts higher (60) instead of relying purely on ratio which fluctuates wildly
        let seoScore = 60;

        // Add points for organic traffic presence
        if (organicCount > 0) seoScore += 10;
        if (organicCount > 50) seoScore += 10;

        // Speed Bonus
        if (avgLcp > 0 && avgLcp < 2500) seoScore += 10;

        // Error Penalty/Bonus
        if (filteredErrorCount === 0) seoScore += 10;

        if (seoScore > 100) seoScore = 100;

        return {
            today: result.today || 0,
            yesterday: result.yesterday || 0,
            lastMonth: result.lastMonth || 0,
            threeMonthsAgo: result.threeMonths || 0,
            eightMonthsAgo: result.eightMonths || 0,
            healthScore: avgLcp === 0 && filteredErrorCount === 0 ? 100 : score,
            avgLcp,
            errorCount: filteredErrorCount, // Return filtered count
            recentErrors: recentErrors,
            seoScore,
            organicCount,
            isDemo: false
        };

    } catch (e: any) {
        console.error('Sanity Analytics Error:', e);
        return {
            today: 0, yesterday: 0, lastMonth: 0, threeMonthsAgo: 0, eightMonthsAgo: 0,
            healthScore: 0, avgLcp: 0, errorCount: 0, recentErrors: [],
            seoScore: 0, organicCount: 0, isDemo: false,
            error: `Data Fetch Error: ${e.message}`
        };
    }
}
