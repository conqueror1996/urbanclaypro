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
            const date = new Date(d);
            date.setHours(0, 0, 0, 0);
            return date.toISOString();
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

        // Enhanced Query
        const query = `{
            "today": count(*[_type == "footprint" && timestamp >= $todayStart]),
            "yesterday": count(*[_type == "footprint" && timestamp >= $yesterdayStart && timestamp < $todayStart]),
            "lastMonth": count(*[_type == "footprint" && timestamp >= $monthStart && timestamp < $monthEnd]),
            "threeMonths": count(*[_type == "footprint" && timestamp >= $threeStart && timestamp < $threeEnd]),
            "eightMonths": count(*[_type == "footprint" && timestamp >= $eightStart && timestamp < $eightEnd]),
            
            "performance": *[_type == "footprint" && defined(vitals.lcp) && timestamp >= $todayStart] { "lcp": vitals.lcp },
            "errors": *[_type == "footprint" && defined(errors) && timestamp >= $todayStart] | order(timestamp desc) [0...5] { errors, timestamp },
            "referrers": *[_type == "footprint" && timestamp >= $monthStart] { referrer }
        }`;

        const result = await client.fetch(query, params);

        // Process Performance Data for Health Score
        const perfData = result.performance || [];
        const lcpSum = perfData.reduce((acc: number, curr: any) => acc + (curr.lcp || 0), 0);
        const avgLcp = perfData.length > 0 ? Math.round(lcpSum / perfData.length) : 0;

        // Simple Health Score Algo (100 = Perfect)
        let score = 100;
        if (avgLcp > 2500) score -= 20;
        if (avgLcp > 4000) score -= 30;
        const errorCount = result.errors ? result.errors.length : 0;
        score -= (errorCount * 5); // 5 points per error
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

        // SEO Score Calculation
        // 1. Organic Traffic Ratio (Target 40%+)
        const organicRatio = totalReferrers > 0 ? (organicCount / totalReferrers) : 0;
        let seoScore = Math.min(Math.round(organicRatio * 200), 50); // Up to 50 points for traffic mix

        // 2. Technical SEO Bonus (Good Low LCP)
        if (avgLcp > 0 && avgLcp < 2500) seoScore += 30;
        else if (avgLcp < 4000) seoScore += 15;

        // 3. Error Free Bonus
        if (errorCount === 0) seoScore += 20;
        else if (errorCount < 3) seoScore += 10;

        if (seoScore > 100) seoScore = 100;
        // Default to a decent score if no data yet to avoid "0" scaring user
        if (totalReferrers === 0 && avgLcp === 0) seoScore = 85;

        return {
            today: result.today || 0,
            yesterday: result.yesterday || 0,
            lastMonth: result.lastMonth || 0,
            threeMonthsAgo: result.threeMonths || 0,
            eightMonthsAgo: result.eightMonths || 0,
            healthScore: avgLcp === 0 && errorCount === 0 ? 100 : score, // Default to 100 if no data
            avgLcp,
            errorCount,
            recentErrors: result.errors?.map((e: any) => e.errors) || [],
            seoScore,
            organicCount,
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
            healthScore: 0,
            avgLcp: 0,
            errorCount: 0,
            recentErrors: [],
            seoScore: 0,
            organicCount: 0,
            isDemo: false,
            error: `Data Fetch Error: ${e.message}`
        };
    }
}
