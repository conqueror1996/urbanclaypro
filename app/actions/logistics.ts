'use server';

import { CITIES } from '@/lib/locations';
import { getProducts } from '@/lib/products';

import { client } from '@/sanity/lib/client';

async function getDynamicHubs() {
    try {
        const hubs = await client.fetch(`*[_type == "logisticsHub" && isActive == true] {
            name, lat, lng, locationName, type
        }`);
        if (hubs && hubs.length > 0) return hubs;

        // Fallback to legacy hub if none configured in Sanity
        return [{ name: 'Bangalore Studio', lat: 12.9716, lng: 77.5946, region: 'South' }];
    } catch (e) {
        return [{ name: 'Bangalore Studio', lat: 12.9716, lng: 77.5946, region: 'South' }];
    }
}

// Tiered rates based on total weight (kg)
const FREIGHT_TIERS = [
    { maxWeight: 1000, ratePerTonKm: 12, minCharge: 3500 },  // LTL (Less than Truck Load) - Expensive
    { maxWeight: 5000, ratePerTonKm: 8, minCharge: 8000 },   // Medium Load
    { maxWeight: 20000, ratePerTonKm: 5, minCharge: 15000 }, // Full Truck Load (FTL) - Efficiency
    { maxWeight: Infinity, ratePerTonKm: 4.5, minCharge: 25000 }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export async function estimateFreight(locationName: string, weightKg: number, productName?: string) {
    const destination = CITIES[locationName.toLowerCase()];
    if (!destination) return { success: false, error: "City not found in database" };

    // 1. Dynamic Weight Check if product provided
    let verifiedWeight = weightKg;
    let autoCalculated = false;

    if (productName) {
        const products = await getProducts();
        const product = products.find(p => p.title.toLowerCase().includes(productName.toLowerCase()));
        if (product?.specs?.unitWeightKg) {
            // Attempt to extract numeric quantity from string like "5000 units" or "1000 sqft"
            const qtyMatch = weightKg.toString().match(/\d+/);
            const qty = qtyMatch ? parseInt(qtyMatch[0]) : 1;
            verifiedWeight = qty * product.specs.unitWeightKg;
            autoCalculated = true;
        }
    }

    // 2. Find Closest Hub
    const hubs = await getDynamicHubs();
    let closestHub = hubs[0];
    let minDistance = Infinity;

    hubs.forEach((hub: any) => {
        const dist = calculateDistance(hub.lat, hub.lng, destination.coordinates.lat, destination.coordinates.lng);
        if (dist < minDistance) {
            minDistance = dist;
            closestHub = hub;
        }
    });

    // 3. Apply Tiered Pricing
    const tier = FREIGHT_TIERS.find(t => verifiedWeight <= t.maxWeight) || FREIGHT_TIERS[FREIGHT_TIERS.length - 1];
    const weightTons = verifiedWeight / 1000;

    let baseFreight = weightTons * minDistance * tier.ratePerTonKm;
    const finalFreight = Math.max(baseFreight, tier.minCharge);

    return {
        success: true,
        data: {
            distanceKm: Math.round(minDistance),
            weightKg: Math.round(verifiedWeight),
            estimatedCost: Math.round(finalFreight),
            hub: closestHub.name,
            tier: verifiedWeight > 10000 ? 'FTL (Full Truck Load)' : 'LTL (Part Load)',
            rateInfo: `₹${tier.ratePerTonKm}/ton-km`,
            autoCalculated
        }
    };
}
