import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/studio/', '/pay/'],
            },
        ],
        sitemap: 'https://claytile.in/sitemap.xml',
        host: 'https://claytile.in',
    };
}
