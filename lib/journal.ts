import { createClient, groq } from 'next-sanity';

// Re-use client creation logic or import if centralized
// Since products.ts created its own client, I will do the same or better, move client to a shared file.
// But to match existing style, I'll create it here.

const client = createClient({
    apiVersion: '2024-11-28',
    dataset: 'production',
    projectId: '22qqjddz',
    useCdn: false,
});

export interface JournalPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    mainImage?: string;
    publishedAt: string;
    category?: string;
    author?: string;
    body?: any; // Portable Text
    readTime?: string;
    date?: string;
    imageUrl?: string;
    relatedProducts?: {
        title: string;
        slug: string;
        imageUrl: string;
        categorySlug: string;
    }[];
}

export async function getJournalPosts(): Promise<JournalPost[]> {
    try {
        const query = groq`*[_type == "journal"] | order(publishedAt desc) {
            _id,
            title,
            "slug": slug.current,
            excerpt,
            "mainImage": mainImage.asset->url,
            publishedAt,
            author,
            category,
            body
        }`;
        const posts = await client.fetch(query, {}, { next: { revalidate: 60 } });

        // Transform for frontend (add defaults)
        return posts.map((p: any) => ({
            ...p,
            date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently',
            readTime: p.body ? `${Math.ceil(JSON.stringify(p.body).split(' ').length / 200)} min read` : '5 min read',
            category: p.category || 'Architecture'
        }));
    } catch (error) {
        console.error('Error fetching journal posts:', error);
        return [];
    }
}

export async function getJournalPost(slug: string): Promise<JournalPost | null> {
    try {
        const query = groq`*[_type == "journal" && slug.current == $slug][0] {
            _id,
            title,
            "slug": slug.current,
            excerpt,
            "mainImage": mainImage.asset->url,
            publishedAt,
            author,
            category,
            body,
            "relatedProducts": relatedProducts[]->{
                title,
                "slug": slug.current,
                "imageUrl": images[0].asset->url,
                "categorySlug": category->slug.current
            }
        }`;
        const post = await client.fetch(query, { slug }, { next: { revalidate: 60 } });

        if (!post) return null;

        return {
            ...post,
            date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently',
            readTime: post.body ? `${Math.ceil(JSON.stringify(post.body).split(' ').length / 200)} min read` : '5 min read',
            category: post.category || 'Architecture'
        };
    } catch (error) {
        console.error('Error fetching journal post:', error);
        return null;
    }
}

export async function getSuggestedPosts(currentSlug: string): Promise<JournalPost[]> {
    try {
        const query = groq`*[_type == "journal" && slug.current != $currentSlug] | order(publishedAt desc)[0...3] {
            _id,
            title,
            "slug": slug.current,
            excerpt,
            "mainImage": mainImage.asset->url,
            publishedAt,
            category,
            body
        }`;
        const posts = await client.fetch(query, { currentSlug }, { next: { revalidate: 60 } });
        return posts.map((p: any) => ({
            ...p,
            date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently',
            readTime: p.body ? `${Math.ceil(JSON.stringify(p.body).split(' ').length / 200)} min read` : '5 min read',
            category: p.category || 'Architecture'
        }));
    } catch (error) {
        console.error('Error fetching suggested posts:', error);
        return [];
    }
}
