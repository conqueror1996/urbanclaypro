

export function truncate(text: string, length: number): string {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + '...';
}

export function calculateSeoScore(title: string, description: string, keyword: string) {
    let score = 100;
    const tips: string[] = [];

    const cleanTitle = title || '';
    const cleanDesc = description || '';

    // 1. Title Analysis
    if (cleanTitle.length < 30) {
        score -= 20;
        tips.push("Title too short (< 30 chars).");
    } else if (cleanTitle.length > 60) {
        score -= 10;
        tips.push("Title truncated (> 60 chars).");
    }

    if (keyword && !cleanTitle.toLowerCase().includes(keyword.toLowerCase())) {
        score -= 30;
        tips.push(`Title missing keyword: "${keyword}"`);
    }

    // Power Words
    const powerWords = ['Best', 'Guide', 'Review', '2026', 'Top', 'Free', 'Tips', 'How to', 'Why', 'Premium', 'Buy', 'India'];
    if (!powerWords.some(w => cleanTitle.toLowerCase().includes(w.toLowerCase()))) {
        score -= 10;
        tips.push("Add power word (Best, Guide, Premium) for CTR.");
    }

    // 2. Description Analysis
    if (cleanDesc.length < 120) {
        score -= 10;
        tips.push("Description too short. Explain more.");
    } else if (cleanDesc.length > 165) {
        score -= 5;
        tips.push("Description truncated (> 160 chars).");
    }

    if (keyword && !cleanDesc.toLowerCase().includes(keyword.toLowerCase())) {
        score -= 20;
        tips.push(`Description missing keyword: "${keyword}"`);
    }

    return {
        score: Math.max(0, score),
        tips
    };
}

export function generateSemanticAlt(
    productTitle: string,
    variantName: string = 'Standard',
    category: string = 'Terracotta',
    specs: { waterAbsorption?: string; compressiveStrength?: string; fireRating?: string; fire?: string } = {}
): string {
    const brand = 'UrbanClay India';
    const variantSuffix = variantName && variantName !== 'Standard' ? `${variantName} ` : '';

    // Core high-value keywords based on category
    let application = 'Architectural Facade Cladding';
    const catLower = (category || 'Terracotta').toLowerCase();
    if (catLower.includes('tile')) application = 'Exterior Wall Cladding';
    if (catLower.includes('jali')) application = 'Natural Ventilation Screen';
    if (catLower.includes('brick')) application = 'Premium Masonry Cladding';

    // Performance badges
    const fire = specs.fireRating || specs.fire || 'A1 Fire-Rated';
    const absorption = specs.waterAbsorption ? `Low Water Absorption (${specs.waterAbsorption})` : 'Weather-Resistant';

    return `${variantSuffix}${productTitle} ${category || 'Terracotta'} - ${fire} ${absorption} ${application} by ${brand}`.trim();
}
