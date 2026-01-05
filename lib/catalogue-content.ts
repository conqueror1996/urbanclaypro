import { Product } from '@/lib/types';

interface PremiumSpec {
    label: string;
    value: string;
    detail: string;
}

export function generateLuxurySpecs(product: Product): PremiumSpec[] {
    const title = product.title.toLowerCase();
    const specs: PremiumSpec[] = [];

    // 1. MODULE SIZE (Prioritize CMS)
    let dimensions = product.specs?.size;

    if (!dimensions) {
        // Fallback Inference Logic
        if (title.includes('tile')) {
            if (title.includes('linear')) {
                dimensions = '300mm x 55mm x 18mm';
            } else if (title.includes('rustic') || title.includes('wirecut')) {
                dimensions = '230mm x 72mm x 17mm';
            } else if (title.includes('hexagonal') || title.includes('hexagon')) {
                dimensions = '8" Hexagon (200mm Side)';
            } else {
                dimensions = '230mm x 75mm x 18mm';
            }
        } else if (title.includes('jaali') || title.includes('screen') || title.includes('breeze')) {
            if (title.includes('w ') || title.includes('w-')) {
                dimensions = '300mm x 200mm x 70mm';
            } else {
                dimensions = '200mm x 200mm x 60mm';
            }
        } else if (title.includes('brick')) {
            if (title.includes('linear')) {
                dimensions = '230mm x 105mm x 55mm';
            } else {
                dimensions = '230mm x 105mm x 75mm';
            }
        } else {
            dimensions = 'Standard Architectural Module';
        }
    }

    specs.push({
        label: 'Module Size',
        value: dimensions,
        detail: 'Precision-fired dimensions optimized for standard masonry bonds and minimal mortar joints.'
    });

    // 2. TECHNICAL PERFORMANCE (CMS Data)
    if (product.specs?.waterAbsorption) {
        specs.push({
            label: 'Water Absorption',
            value: product.specs.waterAbsorption,
            detail: 'Engineered density prevents moisture ingress, ensuring long-term structural integrity.'
        });
    }

    if (product.specs?.compressiveStrength) {
        specs.push({
            label: 'Compressive Strength',
            value: product.specs.compressiveStrength,
            detail: 'High load-bearing capacity suitable for structural and load-bearing applications.'
        });
    }

    // 3. CATEGORY SPECIFIC / INFERRED SPECS (If space allows or if CMS data missing)
    // We only add these if we don't have full technical specs, to avoid overcrowding the UI
    const hasTechnicalSpecs = product.specs?.waterAbsorption && product.specs?.compressiveStrength;

    if (!hasTechnicalSpecs) {
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
        }
        // === FLOOR TILES ===
        else if (title.includes('floor') || title.includes('paving')) {
            specs.push({
                label: 'Surface Finish',
                value: 'Natural Matte',
                detail: 'Inherently slip-resistant texture that remains cool underfoot. Perfect for tropical climates.'
            });
            specs.push({
                label: 'Durability',
                value: 'High Traffic',
                detail: 'Fired for extreme hardness, suitable for both residential interiors and heavy-footfall verandas.'
            });
        }
        // === THIN TILES / CLADDING ===
        else if (title.includes('tile') || title.includes('cladding') || title.includes('slip')) {
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
        }
        // === SOLID BRICKS ===
        else {
            specs.push({
                label: 'Durability',
                value: 'High Impact',
                detail: 'Dense body composition resistant to physical impact, abrasion, and extreme weather cycles.'
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
        }
    } else {
        // If we have technical specs, just add one flavor spec based on category
        if (title.includes('jaali')) {
            specs.push({
                label: 'Application',
                value: 'Ventilated Facade',
                detail: 'Designed for passive cooling and light filtration in contemporary perforated skins.'
            });
        } else if (title.includes('tile')) {
            specs.push({
                label: 'Application',
                value: 'Surface Cladding',
                detail: 'Lightweight veneer application for both interior decoration and exterior weatherproofing.'
            });
        } else {
            specs.push({
                label: 'Application',
                value: 'Structural Masonry',
                detail: 'Suitable for both load-bearing walls and exposed aesthetic partitions.'
            });
        }
    }

    return specs;
}

export function generateArtisticDescription(product: Product): string {
    // 1. Use CMS Description if available (and short enough to be a quote)
    if (product.description && product.description.length > 20 && product.description.length < 150) {
        return product.description;
    }

    const title = product.title.toLowerCase();

    // 2. Dynamic Templates based on Title Keywords
    // JAALIS / SCREENS
    if (title.includes('jaali') || title.includes('screen') || title.includes('breeze')) {
        const patterns = [
            "Sculpt light. Breathe life. A porous boundary between you and the city.",
            `The ${product.title} redefines the threshold between inside and out.`,
            "A geometric interplay of shadow and ventilation for the passive home.",
            "Ancient cooling wisdom, re-fired for the contemporary facade.",
            "Filtering harsh sunlight into a soft, dancing pattern on your floors."
        ];
        // Use a pseudo-random index based on title length to keep it consistent per product but varied across products
        return patterns[title.length % patterns.length];
    }

    // TILES / CLADDING
    if (title.includes('tile') || title.includes('cladding') || title.includes('slip')) {
        const patterns = [
            "The character of ancient stone, engineered for the modern skyscraper.",
            "A lightweight skin of fired earth. Redefine the envelope without the weight.",
            `Transform any surface into a monolith of ${title.includes('grey') || title.includes('black') ? 'shadow' : 'warmth'}.`,
            "Precision-cut veneer that brings the geology of the kiln to your interiors.",
            "Tactile minimalism. A surface that demands to be touched."
        ];
        return patterns[title.length % patterns.length];
    }

    // HANDMADE BRICKS
    if (title.includes('handmade') || title.includes('antique')) {
        const patterns = [
            "Imperfection is the luxury. Every brick tells the story of the hand that made it.",
            "Not just a building block, but a piece of frozen history.",
            "Soft edges and wandering textures that machines simply cannot replicate.",
            "Honest, raw, and unpretentious. The ultimate counter-signal to digital perfection.",
            "Warmth that radiates from the core of the clay itself."
        ];
        return patterns[title.length % patterns.length];
    }

    // EXPOSED / WIRECUT BRICKS
    if (title.includes('wirecut') || title.includes('exposed') || title.includes('solid')) {
        const patterns = [
            "Sharp lines for the disciplined architect.",
            "Timeless clay architecture. Built to outlast the century.",
            "The fundamental atom of construction, perfected.",
            "Rigid geometry meets organic material. The best of both worlds.",
            "A dense, iron-rich body designed for unplastered honesty."
        ];
        return patterns[title.length % patterns.length];
    }

    // Default Fallbacks with some variety
    const defaults = [
        "Timeless clay architecture. Built to outlast the century.",
        "Forged in fire, designed for permanence.",
        `The ${product.title} stands as a testament to enduring material quality.`,
        "Natural, sustainable, and undeniably beautiful."
    ];
    return defaults[title.length % defaults.length];
}
