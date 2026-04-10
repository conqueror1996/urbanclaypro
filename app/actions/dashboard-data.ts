'use server';

import { writeClient } from '@/sanity/lib/write-client';
import { getDashboardProducts, getDashboardCategories } from '@/lib/products';

export async function serverFetch(query: string, params: any = {}) {
    try {
        const data = await writeClient.fetch(query, params);
        return { success: true, data };
    } catch (error: any) {
        console.error('Server fetch error:', error);
        return { success: false, error: error.message };
    }
}

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
            "siteCount": count(*[_type == "site" && status != "completed"]),
            "feedback": *[_type == "feedback"] { workmanshipRating, materialRating, serviceRating }
        }`;

        const data = await writeClient.fetch(query);
        const leads = data.leads || [];

        const stats = {
            total: leads.length,
            serious: leads.filter((l: any) => l.isSerious).length,
            new: leads.filter((l: any) => l.status === 'new').length,
            converted: leads.filter((l: any) => l.status === 'converted').length,
            abandoned: leads.filter((l: any) => l.status === 'payment_pending').length,
            vendors: data.vendorCount || 0,
            labours: data.labourCount || 0,
            stocks: data.stockCount || 0,
            disputes: data.disputeCount || 0,
            sites: data.siteCount || 0,
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

export async function getProductMetadata() {
    try {
        const query = `*[_type == "product"]{
            _id,
            title,
            "slug": slug.current,
            "seoTitle": seo.metaTitle,
            "seoDesc": seo.metaDescription,
            "seoImage": seo.openGraphImage,
            "variants": variants[]{ name, "image": image },
            description
        }`;

        const data = await writeClient.fetch(query);
        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch product metadata:', error);
        return { success: false, error: 'Failed to load data' };
    }
}

export async function getLeadsData() {
    try {
        const query = `{
            "leads": *[_type == "lead"] | order(submittedAt desc) {
                _id, role, firmName, product, city, quantity, timeline,
                contact, email, address, notes, requirement,
                isSerious, status, submittedAt,
                isSampleRequest, sampleItems, fulfillmentStatus, shippingInfo,
                adminNotes, ip
            },
            "products": *[_type == "product"]{title, "imageUrl": images[0].asset->url},
            "footprintsCount": count(*[_type == "footprint"])
        }`;
        const data = await writeClient.fetch(query);
        return { success: true, ...data };
    } catch (error: any) {
        console.error('Error fetching leads data:', error);
        return { success: false, error: error.message };
    }
}

export async function getLeadHistory(ip: string) {
    try {
        const query = `*[_type == "footprint" && ip == $ip && !defined(errors)] | order(timestamp desc) [0...10] { path, timestamp }`;
        const history = await writeClient.fetch(query, { ip });
        return { success: true, history };
    } catch (error: any) {
        console.error('Error fetching lead history:', error);
        return { success: false, error: error.message };
    }
}

export async function getAdminProductsAndCategories() {
    try {
        const [products, categories] = await Promise.all([
            getDashboardProducts(),
            getDashboardCategories()
        ]);
        return { success: true, products, categories };
    } catch (error: any) {
        console.error('Error fetching admin data:', error);
        return { success: false, error: error.message };
    }
}
