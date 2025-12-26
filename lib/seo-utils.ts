
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
    const powerWords = ['Best', 'Guide', 'Review', '2025', 'Top', 'Free', 'Tips', 'How to', 'Why', 'Premium', 'Buy', 'India'];
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
