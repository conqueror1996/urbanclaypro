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
        return `High-performance ${title}. Lightweight, weather-resistant, and engineered for rapid installation.`;
    }
    if (category.includes('jaali') || category.includes('breeze')) {
        return `Precision-crafted ${title} screens for natural ventilation and distinctive architectural light filtering.`;
    }
    if (category.includes('brick') || category.includes('exposed')) {
        return `Sintered clay ${title} units. Authentic, high-thermal-mass bricks for commanding facades.`;
    }
    if (category.includes('panel') || category.includes('facade')) {
        return `Advanced ${title} facade systems. Large-format terracotta panels for energy-efficient architecture.`;
    }

    // Fallback based on name fragments if category is missing/generic
    const lowerName = title.toLowerCase();
    if (lowerName.includes('block')) return `Sculptural ${title} units. A perfect synthesis of structural integrity and tectonic lightness.`;
    if (lowerName.includes('red')) return `Rich, earth-toned ${title}. Naturally fired for deep color saturation and extreme durability.`;

    return `Premium ${title} by UrbanClay. A sophisticated synthesis of ancient earth and modern precision.`;
}

export function generateUniqueNarrative(product: Product): string {
    const title = product.title;
    const category = (product.category?.title || product.tag || 'Terracotta').toLowerCase();
    
    // Check for explicit distinctive character first
    if (product.distinctiveCharacter && product.distinctiveCharacter.trim().length > 0) {
        return product.distinctiveCharacter;
    }

    // 1. Templates by category
    if (category.includes('jaali') || category.includes('jali') || category.includes('screen')) {
        const stories = [
            `Modern architecture meets traditional Indian craftsmanship in the ${title} series. This collection is engineered to transform sunlight into a rhythmic choreography of light and shadow, elevating simple walls into breathing skins.`,
            `The ${title} collection redefines the iconic Indian Jaali for the 21st century. Beyond its striking geometric repetition, it serves as a critical lung for the building, facilitating natural ventilation while maintaining intimate privacy.`,
            `Crafted for those who understand the poetry of perforated masonry, the ${title} series offers a sophisticated interplay of voids and solids. It is not just a screen; it is a climate-responsive architectural statement.`
        ];
        return stories[Math.abs(hashString(product.slug)) % stories.length];
    }

    if (category.includes('brick') || category.includes('exposed') || category.includes('wirecut')) {
        const stories = [
            `The ${title} series is a celebration of the raw, tectonic power of earth. Fired at extreme temperatures, each unit possesses a depth of color and a subtle grain that captures the passage of time on every façade it graces.`,
            `Honesty in materials is at the heart of the ${title} collection. These bricks are designed for commanding surfaces that don't just stand but age with a grace that only authentic, kiln-fired terracotta can provide.`,
            `From the rich, variegated tones to the crisp, industrial precision of its edges, the ${title} series represents the pinnacle of contemporary brickwork. It is the architect's choice for monumental character.`
        ];
        return stories[Math.abs(hashString(product.slug)) % stories.length];
    }

    if (category.includes('tile') || category.includes('cladding')) {
        const stories = [
            `The ${title} series brings the warmth of the earth to vertical surfaces with unprecedented lightness. It is a refined cladding system that offers the timeless appeal of terracotta without the weight of traditional masonry.`,
            `Sophistication meets sustainability in the ${title} collection. These tiles are meticulously crafted to provide a high-end, tactile experience, turning ordinary walls into exceptional architectural narratives.`,
            `Designed for high-performance facades and curated interiors alike, the ${title} series offers a versatile palette of textures. Each tile is a testament to the enduring beauty of natural clay.`
        ];
        return stories[Math.abs(hashString(product.slug)) % stories.length];
    }

    // Default Fallback with some variety
    const generalStories = [
        `${title} is where the legacy of clay meets the precision of modern engineering. It is crafted for spaces that demand an authentic soul and a lasting architectural presence.`,
        `The character of ${title} is defined by its subtle variations in tone and texture—a hallmark of true terracotta. It offers a sophisticated, grounding element to any contemporary project.`,
        `Beyond its functional durability, ${title} is designed to be a tactile experience. It connects the built environment back to the earth through its rich, natural materiality.`
    ];

    return generalStories[Math.abs(hashString(product.slug)) % generalStories.length];
}

// Simple deterministic hash for string
function hashString(str: string): number {
    let hash = 0;
    if (!str) return 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
