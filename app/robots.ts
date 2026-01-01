import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/studio/', // Disallow Sanity Studio
            },
            {
                userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'ClaudeBot', 'PerplexityBot'],
                allow: '/',
            }
        ],
        sitemap: 'https://claytile.in/sitemap.xml',
    };
}
