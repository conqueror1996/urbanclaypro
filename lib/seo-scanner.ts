
import { client } from '@/sanity/lib/client';

export interface SeoCheckResult {
    score: number;
    checks: {
        id: string;
        label: string;
        status: 'pass' | 'fail' | 'warning';
        message: string;
    }[];
    meta: {
        title: string;
        description: string;
        h1: string;
        wordCount: number;
        canonical: string;
        readabilityScore: number;
        internalLinks: number;
        externalLinks: number;
    };
}

// Scrape helper
async function fetchLivePageData(path: string) {
    try {
        // Cache Busting: Add timestamp to force fresh server render
        const bust = `?_t=${Date.now()}`;
        const urlWithBust = path.includes('?') ? `${path}&_t=${Date.now()}` : `${path}${bust}`;

        const res = await fetch(urlWithBust, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load ${path}`);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        return {
            title: doc.title || '',
            description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            h1: doc.querySelector('h1')?.innerText || '',
            canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
            // Get text content but remove scripts/styles for accurate word count
            content: doc.body.innerText.replace(/\s+/g, ' ').trim(),

            // Advanced Signals
            ogTitle: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
            ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
            hasSchema: !!doc.querySelector('script[type="application/ld+json"]'),
            missingAltCount: Array.from(doc.querySelectorAll('img')).filter(img => !img.alt && img.src).length,

            // Link Profile
            internalLinks: Array.from(doc.querySelectorAll('a')).filter(a => a.href && (a.href.startsWith('/') || a.href.includes('urbanclay.in'))).length,
            externalLinks: Array.from(doc.querySelectorAll('a')).filter(a => a.href && a.href.startsWith('http') && !a.href.includes('urbanclay.in')).length,

            // Readability (Flesch Kincaid Approximation)
            readabilityScore: calculateReadability(doc.body.innerText)
        };
    } catch (e) {
        console.warn(`Could not fetch live data for ${path}`, e);
        return null;
    }
}

function calculateReadability(text: string): number {
    const sentences = text.match(/[.!?]+/g)?.length || 1;
    const words = text.match(/\w+/g)?.length || 1;
    // Syllable approx: 3 chars per syllable avg
    const syllables = Math.round(text.length / 3);

    // Flesch Reading Ease Formula
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return Math.min(100, Math.max(0, Math.round(score)));
}

// Analysis Logic
export const analyzePage = (
    data: {
        title: string, description: string, content: string, h1: string, canonical: string,
        ogTitle?: string, ogImage?: string, hasSchema?: boolean, missingAltCount?: number,
        internalLinks?: number, externalLinks?: number, readabilityScore?: number
    },
    keyword: string
): SeoCheckResult => {

    // ... (Previous var destructuring remains same, we just utilize new data)
    const { title, description: desc, content, h1 } = data;

    const checks = [];
    let score = 100;

    // ... (Checks 1-8 remain same) ...

    // 1. Title Checks
    if (title.length < 30) {
        score -= 10;
        checks.push({ id: 'title-short', label: 'Title Length', status: 'warning', message: `Title is too short (${title.length} chars). Aim for 50-60.` });
    } else if (title.length > 65) {
        score -= 5;
        checks.push({ id: 'title-long', label: 'Title Length', status: 'warning', message: 'Title is too long. Google may truncate it.' });
    } else {
        checks.push({ id: 'title-ok', label: 'Title Length', status: 'pass', message: 'Title length is optimal.' });
    }

    if (!title.toLowerCase().includes(keyword.toLowerCase())) {
        score -= 15;
        checks.push({ id: 'title-kw', label: 'Title Keyword', status: 'fail', message: `Title missing focus keyword: "${keyword}"` });
    } else {
        checks.push({ id: 'title-kw', label: 'Title Keyword', status: 'pass', message: 'Focus keyword found in title.' });
    }

    // 2. Heading Checks
    if (!h1) {
        score -= 10;
        checks.push({ id: 'h1-missing', label: 'H1 Tag', status: 'fail', message: 'Page is missing an H1 tag.' });
    } else if (h1.toLowerCase().includes(keyword.toLowerCase())) {
        checks.push({ id: 'h1-kw', label: 'H1 Keyword', status: 'pass', message: 'Focus keyword found in H1.' });
    } else {
        score -= 5;
        checks.push({ id: 'h1-kw', label: 'H1 Keyword', status: 'warning', message: 'H1 tag does not contain focus keyword.' });
    }

    // 3. Description Checks
    if (!desc) {
        score -= 10;
        checks.push({ id: 'meta-missing', label: 'Meta Description', status: 'fail', message: 'Meta description is missing.' });
    } else if (desc.length < 120) {
        score -= 5;
        checks.push({ id: 'meta-short', label: 'Meta Description', status: 'warning', message: 'Description is too short. Aim for 140-160 chars.' });
    } else {
        checks.push({ id: 'meta-ok', label: 'Meta Description', status: 'pass', message: 'Meta description length is good.' });
    }

    // 4. Content Checks
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
        score -= 10;
        checks.push({ id: 'content-thin', label: 'Content Depth', status: 'fail', message: `Thin content detected (${wordCount} words). Aim for 300+.` });
    } else {
        checks.push({ id: 'content-ok', label: 'Content Depth', status: 'pass', message: `Good content depth (${wordCount} words).` });
    }

    // 5. Canonical Check
    if (!data.canonical) {
        score -= 5;
        checks.push({ id: 'canonical-missing', label: 'Canonical URL', status: 'warning', message: 'Canonical link tag is missing.' });
    } else {
        checks.push({ id: 'canonical-ok', label: 'Canonical URL', status: 'pass', message: 'Canonical tag is present.' });
    }

    // 6. Social Media Checks
    if (!data.ogTitle || !data.ogImage) {
        score -= 5;
        checks.push({ id: 'social-missing', label: 'Social Sharing', status: 'warning', message: 'Social preview tags (OpenGraph) are incomplete.' });
    } else {
        checks.push({ id: 'social-ok', label: 'Social Sharing', status: 'pass', message: 'Facebook/LinkedIn preview tags are perfect.' });
    }

    // 7. Media & Alt Text
    if (data.missingAltCount && data.missingAltCount > 0) {
        score -= 5;
        checks.push({ id: 'alt-missing', label: 'Image Accessibility', status: 'warning', message: `${data.missingAltCount} images are missing Alt Text.` });
    } else {
        checks.push({ id: 'alt-ok', label: 'Image Accessibility', status: 'pass', message: 'All images have descriptive Alt Text.' });
    }

    // 8. Schema Markup
    if (data.hasSchema) {
        checks.push({ id: 'schema-ok', label: 'Rich Snippets', status: 'pass', message: 'Structured Data (Schema) detected.' });
    } else {
        checks.push({ id: 'schema-missing', label: 'Rich Snippets', status: 'warning', message: 'No Schema Markup found.' });
    }

    // 9. Link Profile
    if ((data.internalLinks || 0) < 2) {
        score -= 5;
        checks.push({ id: 'internal-missing', label: 'Link Structure', status: 'warning', message: 'Add internal links to other pages to improve crawlability.' });
    } else {
        checks.push({ id: 'internal-ok', label: 'Link Structure', status: 'pass', message: `Good internal linking (${data.internalLinks} links).` });
    }

    // 10. Readability
    const rScore = data.readabilityScore || 0;
    if (rScore < 30) {
        score -= 5;
        checks.push({ id: 'readability-hard', label: 'Content Readability', status: 'warning', message: 'Content is very complex (academic level). Simplify sentences.' });
    } else if (rScore < 50) {
        checks.push({ id: 'readability-med', label: 'Content Readability', status: 'warning', message: 'Content is somewhat difficult to read. Aim for simpler language.' });
    } else {
        checks.push({ id: 'readability-ok', label: 'Content Readability', status: 'pass', message: `Great readability score (${rScore}). Easy to understand.` });
    }

    return {
        score: Math.max(0, score),
        checks: checks as any,
        meta: {
            title,
            description: desc,
            h1,
            wordCount,
            canonical: data.canonical,
            readabilityScore: data.readabilityScore || 0,
            internalLinks: data.internalLinks || 0,
            externalLinks: data.externalLinks || 0
        }
    };
};


export async function scanWebsitePages() {
    // 1. Get List of Pages to Scan with SEO Metadata
    const productSlugs = await client.fetch(`*[_type == "product"]{ _id, _type, "slug": slug.current, title, seo }`);
    const journalSlugs = await client.fetch(`*[_type == "journal"]{ _id, _type, "slug": slug.current, title, seo }`);

    // Helper to pick best keyword
    const getKeyword = (doc: any, defaultKw: string) => {
        if (doc.seo?.keywords && doc.seo.keywords.length > 0) return doc.seo.keywords[0];
        if (doc.title) return doc.title.split('|')[0].trim(); // Use Product Name as fallback
        return defaultKw;
    };

    const targets = [
        { url: '/', keyword: 'Terracotta Tiles', type: 'Page' },
        { url: '/products', keyword: 'Terracotta Cladding', type: 'Page' }, // More specific
        { url: '/projects', keyword: 'Architecture Projects', type: 'Page' },
        { url: '/terracotta-tiles-india', keyword: 'Terracotta Tiles India', type: 'Page' },
        // Dynamic Pages with Smart Keywords
        ...productSlugs.map((p: any) => ({
            url: `/products/${p.slug}`,
            keyword: getKeyword(p, 'Terracotta'),
            type: 'Product',
            id: p._id
        })),
        ...journalSlugs.map((p: any) => ({
            url: `/journal/${p.slug}`,
            keyword: getKeyword(p, 'Architecture'),
            type: 'Journal',
            id: p._id
        }))
    ];

    const results = [];

    // 2. Perform Live Scan (Parallel)
    const scanPromises = targets.map(async (target) => {
        const liveData = await fetchLivePageData(target.url);

        if (liveData) {
            return {
                id: (target as any).id,
                type: target.type,
                url: target.url,
                focusKeyword: target.keyword, // Return this so UI can show it
                ...analyzePage(liveData, target.keyword)
            };
        }
        return null;
    });

    const scanned = await Promise.all(scanPromises);

    // Filter out failed scans and sort by urgency
    return scanned
        .filter(Boolean)
        .sort((a: any, b: any) => a.score - b.score);
}
