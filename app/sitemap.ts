import { MetadataRoute } from 'next';
import { getProducts, getProjects } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://urbanclay.in';

    // Fetch dynamic content
    const products = await getProducts();
    const projects = await getProjects();

    // Static pages
    const staticPages = [
        '',
        '/products',
        '/projects',
        '/guide',
        '/architects',
        '/our-story',
        '/journal',
        '/catalogue',
        '/resources',
        '/privacy-policy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Product pages
    const productPages = products.map((product) => ({
        url: `${baseUrl}/products/${product.category?.slug || 'collection'}/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Project pages
    const projectPages = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Category pages (important for SEO)
    const categories = [
        'Exposed Brick',
        'Brick Tiles',
        'Jaali',
        'Floor Tiles',
        'Roof Tiles',
    ].map((category) => ({
        url: `${baseUrl}/products?category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }));

    return [...staticPages, ...productPages, ...projectPages, ...categories];
}
