import { MetadataRoute } from 'next';
import { getProducts, getProjects } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://urbanclay.in';

    // Fetch dynamic data
    const products = await getProducts();
    const projects = await getProjects();

    // Static pages
    const staticPages = [
        { route: '', priority: 1.0 },
        { route: '/products', priority: 0.9 },
        { route: '/projects', priority: 0.9 },
        { route: '/guide', priority: 0.8 },
        { route: '/architects', priority: 0.8 },
        { route: '/our-story', priority: 0.7 },
        { route: '/resources', priority: 0.6 },
        { route: '/privacy-policy', priority: 0.3 },
    ].map(({ route, priority }) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
        priority,
    }));

    // Dynamic Product pages
    const productPages = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Dynamic Project pages
    const projectPages = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...productPages, ...projectPages];
}
