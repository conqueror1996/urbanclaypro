import { MetadataRoute } from 'next';
import { getProducts, getProjects } from '@/lib/products';
import { client } from '@/sanity/lib/client';
import { CITIES } from '@/lib/locations';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://claytile.in';

    // 1. ALL DYNAMIC DATA FETCHING
    const products = await getProducts();
    const projects = await getProjects();
    const posts = await client.fetch(`*[_type == "journal"]{ "slug": slug.current, publishedAt }`);

    // 2. STATIC PAGES
    const staticRoutes = [
        '',
        '/products',
        '/projects',
        '/guide',
        '/architects',
        '/our-story',
        '/journal',
        '/catalogue',
        '/resources',
        '/contact',
        '/privacy-policy',
        '/terms',
        '/terracotta-tiles-india',
        '/wiki',
    ];

    const staticPages = staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 3. CITY PAGES (High SEO Value - Dynamic from Sanity)
    const cityDocs = await client.fetch(`*[_type == "cityPage"]{ "slug": slug.current, _updatedAt }`);
    const allCitySlugs: string[] = cityDocs.map((c: any) => c.slug);

    const cityPages = allCitySlugs.map((slug) => ({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(), // Ideally use _updatedAt from Sanity if available
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }));

    // 4. CATEGORY PAGES (Canonical Pretty URLs)
    const categories = [
        'wirecut-bricks',
        'exposed-bricks',
        'brick-wall-tiles',
        'facades',
        'terracotta-jaali',
        'breeze-blocks',
        'roof-tiles',
        'floor-tiles'
    ].map((slug) => ({
        url: `${baseUrl}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 5. PRODUCT PAGES
    const productPages = products.map((product) => ({
        url: `${baseUrl}/products/${product.category?.slug || 'collection'}/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 6. PROJECT PAGES
    const projectPages = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // 7. JOURNAL / BLOG POSTS (New Content Engine)
    // 7. JOURNAL / BLOG POSTS (New Content Engine)
    const journalPages = posts.map((post: any) => ({
        url: `${baseUrl}/journal/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.75, // Higher than generic pages, content is king
    }));

    // 8. WIKI / TECH ARTICLES (High Authority Content)
    const wikiDocs = await client.fetch(`*[_type == "wikiArticle"]{ "slug": slug.current, _updatedAt }`);
    const wikiPages = wikiDocs.map((doc: any) => ({
        url: `${baseUrl}/wiki/${doc.slug}`,
        lastModified: doc._updatedAt ? new Date(doc._updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8, // Strong Technical SEO signal
    }));

    return [
        ...staticPages,
        ...cityPages,
        ...categories,
        ...productPages,
        ...projectPages,
        ...journalPages,
        ...wikiPages
    ];
}
