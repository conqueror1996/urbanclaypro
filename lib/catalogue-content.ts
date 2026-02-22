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

export function generateArtisticDescription(product: { title: string; tag?: string; category?: any }): string {
    const category = product.tag || product.category?.title || 'Terracotta';
    return `Experience the timeless elegance of ${product.title}. This premium ${category} product is crafted with precision to elevate your architectural projects. Perfect for those who seek a blend of tradition and modern aesthetics.`;
}
