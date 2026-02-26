import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/studio/',     // Disallow Sanity Studio
                    '/dashboard/',  // Prevent crawling private CRM/Dashboard
                    '/api/',        // Block API routes from indexing
                    '/_next/',      // Block Next.js internals
                    '/admin/'       // Block admin fallback routes
                ],
            },
            {
                // Explicitly ALLOW major AI Search Bots (AIO Optimization)
                userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'ClaudeBot', 'PerplexityBot', 'OAI-SearchBot'],
                allow: '/',
            },
            {
                // Explicitly BLOCK aggressive scrapers to save crawl budget
                userAgent: ['Omgilibot', 'Omgili', 'Scrapy', 'Baiduspider', 'YandexBot', 'Sogou', 'Exabot', 'facebot', 'ia_archiver'],
                disallow: '/',
            }
        ],
        sitemap: 'https://claytile.in/sitemap.xml',
        host: 'https://claytile.in'
    };
}
