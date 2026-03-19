import { MetadataRoute } from 'next';
import { getProducts, getProjects } from '@/lib/products';
import { getJournalPosts } from '@/lib/journal';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://claytile.in';

    // Core Pages
    const routes = [
        '',
        '/products',
        '/projects',
        '/our-story',
        '/flexible-brick-tile',
        '/terracotta-panels',
        '/exposed-brick',
        '/handmade-brick-tiles',
        '/terracotta-jali',
        '/terracotta-tiles-india',
        '/guide',
        '/resources',
        '/journal',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Products
    const products = await getProducts();
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.category?.slug || 'collection'}/${product.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Dynamic Projects
    const projects = await getProjects();
    const projectRoutes = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Dynamic Journals
    const journals = await getJournalPosts();
    const journalRoutes = journals.map((post) => ({
        url: `${baseUrl}/journal/${post.slug}`,
        lastModified: post.publishedAt || new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...productRoutes, ...projectRoutes, ...journalRoutes];
}
