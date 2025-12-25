import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/studio/', // Disallow Sanity Studio
        },
        sitemap: 'https://claytile.in/sitemap.xml',
    };
}
