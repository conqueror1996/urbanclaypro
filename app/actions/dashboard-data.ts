'use server';

import { writeClient } from '@/sanity/lib/write-client';

export async function getDashboardData() {
    try {
        // Fetch all leads to update stats
        // Using writeClient ensures we bypass CDN and get FRESH data immediately
        const query = `{
            "leads": *[_type == "lead"] | order(submittedAt desc),
            "vendorCount": count(*[_type == "vendor"]),
            "labourCount": count(*[_type == "labour"]),
            "stockCount": count(*[_type == "stock"]),
            "disputeCount": count(*[_type == "dispute" && status == "open"]),
            "feedback": *[_type == "feedback"] { workmanshipRating, materialRating, serviceRating }
        }`;

        const data = await writeClient.fetch(query);
        const leads = data.leads || [];

        const stats = {
            total: leads.length,
            serious: leads.filter((l: any) => l.isSerious).length,
            new: leads.filter((l: any) => l.status === 'new').length,
            converted: leads.filter((l: any) => l.status === 'converted').length,
            vendors: data.vendorCount || 0,
            labours: data.labourCount || 0,
            stocks: data.stockCount || 0,
            disputes: data.disputeCount || 0,
            avgRating: data.feedback?.length
                ? (data.feedback.reduce((acc: number, curr: any) => acc + ((curr.workmanshipRating + curr.materialRating + curr.serviceRating) / 3), 0) / data.feedback.length).toFixed(1)
                : '0.0'
        };

        return {
            success: true,
            stats,
            recentLeads: leads.slice(0, 5),
            topPartners: Object.values(leads.reduce((acc: any, lead: any) => {
                const name = lead.company || lead.contact || 'Unknown';
                if (!acc[name]) acc[name] = { name, value: 0, deals: 0, lastActive: lead.submittedAt };
                acc[name].value += (Number(lead.potentialValue) || 0);
                acc[name].deals += 1;
                if (new Date(lead.submittedAt) > new Date(acc[name].lastActive)) acc[name].lastActive = lead.submittedAt;
                return acc;
            }, {}))
                .sort((a: any, b: any) => b.value - a.value)
                .slice(0, 4)
        };

    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        return { success: false, error: 'Failed to load data' };
    }
}
