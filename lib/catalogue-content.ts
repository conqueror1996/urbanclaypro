import { Product } from '@/lib/products';

interface PremiumSpec {
    label: string;
    value: string;
    detail: string;
}

export function generateLuxurySpecs(product: Product): PremiumSpec[] {
    const title = product.title.toLowerCase();
    const category = (product.category?.title || '').toLowerCase();
    const description = (product.description || '').toLowerCase();

    const specs: PremiumSpec[] = [];

    // 1. EXACT DIMENSIONS LOGIC (User Provided)
    let dimensions = 'Custom Specification';

    if (title.includes('tile')) {
        if (title.includes('linear')) {
            dimensions = '300mm x 55mm x 18mm'; // Linear Brick Tile
        } else if (title.includes('rustic') || title.includes('wirecut')) {
            dimensions = '230mm x 72mm x 17mm'; // Rustic Brick Tile
        } else {
            dimensions = '230mm x 75mm x 18mm'; // Smooth Cladding Tile default
        }
    } else if (title.includes('jaali') || title.includes('screen') || title.includes('breeze')) {
        if (title.includes('w ') || title.includes('w-')) {
            dimensions = '300mm x 200mm x 70mm'; // W Jaali
        } else {
            dimensions = '200mm x 200mm x 60mm'; // Standard Clay Jaali
        }
    } else if (title.includes('brick')) {
        if (title.includes('linear')) {
            dimensions = '230mm x 105mm x 55mm'; // Linear Exposed Brick
        } else {
            dimensions = '230mm x 105mm x 75mm'; // Exposed Brick
        }
    } else {
        // Fallback for other items (like ceilings, pavers) based on common standards
        dimensions = product.specs?.size || 'Standard Architectural Module';
    }

    // Add the Dimension Spec FIRST
    specs.push({
        label: 'Module Size',
        value: dimensions,
        detail: 'Precision-fired dimensions optimized for standard masonry bonds and minimal mortar joints.'
    });

    // 2. CATEGORY SPECIFIC SPECS (Simplified & Clear)

    // === JAALI / PERFORATED ===
    if (title.includes('jaali') || title.includes('screen') || title.includes('perforated')) {
        specs.push({
            label: 'Light Control',
            value: 'Diffused Pattern',
            detail: 'Scatters harsh sunlight into soft, ambient patterns, reducing heat whilst keeping the interior bright.'
        });

        specs.push({
            label: 'Air Circulation',
            value: 'High Velocity',
            detail: 'Open geometry forces air to accelerate through the void, naturally cooling the building envelope.'
        });

        specs.push({
            label: 'Application',
            value: 'Semi-Private Facade',
            detail: 'Creates visual separation from the street without blocking your view of the outside.'
        });

        return specs;
    }

    // === THIN TILES / CLADDING ===
    if (title.includes('tile') || title.includes('cladding') || title.includes('slip')) {
        specs.push({
            label: 'Adhesion',
            value: 'Grooved Backing',
            detail: 'Deep dovetail grooves ensure a permanent mechanical lock with the adhesive mortar.'
        });

        specs.push({
            label: 'Weight',
            value: 'Lightweight Skin',
            detail: 'Reduces structural dead load, perfect for renovations or high-rise facade applications.'
        });

        if (title.includes('rustic') || title.includes('wirecut')) {
            specs.push({
                label: 'Texture',
                value: 'Raw Earth',
                detail: 'Authentic wire-cut surface that hides dust and ages gracefully over decades.'
            });
        } else {
            specs.push({
                label: 'Finish',
                value: 'Smooth Honed',
                detail: 'A refined, soft-touch surface for contemporary, minimalist elevations.'
            });
        }

        return specs;
    }

    // === SOLID BRICKS ===
    // Defaulting to "Solid / Exposed Brick" logic
    specs.push({
        label: 'Durability',
        value: 'High Impact',
        detail: 'Dense body composition resistant to physical impact, abrasion, and extreme weather cycles.'
    });

    specs.push({
        label: 'Thermal Mass',
        value: 'Heat Regulating',
        detail: 'Absorbs heat during the day and releases it at night, naturally stabilizing indoor temperatures.'
    });

    if (title.includes('handmade')) {
        specs.push({
            label: 'Craftsmanship',
            value: 'Hand-Molded',
            detail: 'Each piece is individually formed, ensuring unique variations that machines cannot replicate.'
        });
    } else {
        specs.push({
            label: 'Precision',
            value: 'Machine Molded',
            detail: 'Sharp edges and consistent sizing for clean, modern geometric brickwork.'
        });
    }

    return specs;
}

export function generateArtisticDescription(product: Product): string {
    const title = product.title.toLowerCase();

    // Context-aware "Power Commands" / Branding Statements
    if (title.includes('jaali') || title.includes('screen')) {
        return "Sculpt light. Breathe life. A porous boundary between you and the city.";
    }
    if (title.includes('tile') && title.includes('rustic')) {
        return "The character of ancient stone, engineered for the modern skyscraper.";
    }
    if (title.includes('tile')) {
        return "A lightweight skin of fired earth. Redefine the envelope without the weight.";
    }
    if (title.includes('handmade')) {
        return "Imperfection is the luxury. Every brick tells the story of the hand that made it.";
    }

    // Default
    return "Timeless clay architecture. Built to outlast the century.";
}
