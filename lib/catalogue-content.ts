import { Product } from '@/lib/types';

export interface SpecItem {
    label: string;
    value: string;
    detail: string;
}

export function generateLuxurySpecs(product: Product, selectedVariant?: NonNullable<Product['variants']>[number] | null): SpecItem[] {
    const specs = product.specs || {};
    const variantSpecs = selectedVariant?.variantSpecs || {};

    const list: SpecItem[] = [];

    // Dimensions
    const dimensions = variantSpecs.dimensions || specs.size;
    if (dimensions) {
        list.push({
            label: 'Dimensions',
            value: dimensions,
            detail: 'Metric nominal format (L x H x W)'
        });
    }

    // Thickness
    const thickness = variantSpecs.thickness || specs.thickness;
    if (thickness) {
        list.push({
            label: 'Thickness',
            value: thickness,
            detail: 'Calibrated precision gauge'
        });
    }

    // Weight
    const weight = variantSpecs.weight || specs.weight;
    if (weight) {
        list.push({
            label: 'Unit Weight',
            value: weight,
            detail: 'Dry mass per tile/brick'
        });
    }

    // Water Absorption
    if (specs.waterAbsorption) {
        list.push({
            label: 'Absorption',
            value: specs.waterAbsorption,
            detail: 'ISO 10545-3 / ASTM C373'
        });
    }

    // Compressive Strength
    if (specs.compressiveStrength) {
        list.push({
            label: 'Strength',
            value: specs.compressiveStrength,
            detail: 'Compressive load resistance'
        });
    }

    // Firing Temp
    if (specs.firingTemperature) {
        list.push({
            label: 'Firing Temp',
            value: specs.firingTemperature,
            detail: 'Kiln sintering point'
        });
    }

    // Inner Curve (Specific to some variants)
    if (variantSpecs.innerCurve) {
        list.push({
            label: 'Curvature',
            value: variantSpecs.innerCurve,
            detail: 'Internal radius'
        });
    }

    // Application
    if (specs.application) {
        list.push({
            label: 'Usage',
            value: specs.application,
            detail: 'Recommended installation zones'
        });
    }

    return list;
}

export function generateArtisticDescription(product: { title: string; tag?: string; category?: any; slug: string }): string {
    const category = (product.tag || product.category?.title || '').toLowerCase();
    const title = product.title;

    if (category.includes('flexible') || category.includes('tile')) {
        return `High-performance ${title} tiles. Lightweight, weather-resistant, and engineered for rapid architectural installation.`;
    }
    if (category.includes('jaali') || category.includes('breeze')) {
        return `Precision-crafted ${title} screens. Designed for natural ventilation, light filtering, and distinctive architectural voids.`;
    }
    if (category.includes('brick') || category.includes('exposed')) {
        return `Sintered clay ${title} units. Authentic, high-thermal-mass bricks for commanding facades and timeless heritage aesthetics.`;
    }
    if (category.includes('panel') || category.includes('facade')) {
        return `Advanced ${title} facade systems. Large-format terracotta panels for energy-efficient, rainscreen-optimized buildings.`;
    }

    // Fallback based on name fragments if category is missing/generic
    const lowerName = title.toLowerCase();
    if (lowerName.includes('block')) return `Sculptural ${title} units. Bridging the gap between structural integrity and tectonic lightness.`;
    if (lowerName.includes('red')) return `Rich, earth-toned ${title}. Naturally fired for deep color saturation and extreme durability.`;

    return `Premium ${title} by UrbanClay. A sophisticated synthesis of ancient earth and modern precision engineering.`;
}
