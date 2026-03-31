import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/studio/', '/pay/'],
            },
            {
                userAgent: 'GPTBot',
                allow: ['/', '/llms.txt'],
            },
            {
                userAgent: 'Claude-bot',
                allow: ['/', '/llms.txt'],
            }
        ],
        sitemap: 'https://claytile.in/sitemap.xml',
        host: 'https://claytile.in',
    };
}
