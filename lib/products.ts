import { createClient, type SanityClient } from 'next-sanity';
import { groq } from 'next-sanity';
import { Product, Project } from './types';
export type { Product, Project };

let client: SanityClient;
try {
    client = createClient({
        apiVersion: '2024-11-28',
        dataset: 'production',
        projectId: '22qqjddz',
        useCdn: true, // Enable CDN for production speed
    });
} catch (e) {
    console.error("Sanity client creation failed:", e);
    // Mock client to prevent build crash
    client = {
        fetch: async () => []
    } as unknown as SanityClient;
}



// GROQ Queries
const productsQuery = groq`*[_type == "product"] {
  _id,
  title,
  sku,
  "slug": slug.current,
  subtitle,
  tag,
  "category": category->{ title, "slug": slug.current, description },
  range,
  specs,
  priceRange,
  priceTier,
  description,
  "imageUrl": images[0].asset->url,
  "variants": variants[]{ _key, name, family, color, "slug": slug.current, "imageUrl": image.asset->url, "imageRef": image.asset._ref, "altText": image.alt, "gallery": gallery[].asset->url, "galleryRefs": gallery[].asset._ref, badge },

  "resources": {
    "technicalSheets": resources.technicalSheets[]{ title, "fileUrl": asset->url },
    "bimModels": resources.bimModels[]{ title, "fileUrl": asset->url },
    "productCatalogues": resources.productCatalogues[]{ title, "fileUrl": asset->url }
  },
  "relatedProjects": *[_type == "project" && references(^._id)] {
    title,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    location
  },
  "seo": {
    "metaTitle": seo.metaTitle,
    "metaDescription": seo.metaDescription,
    "keywords": seo.keywords,
    "openGraphImage": seo.openGraphImage.asset->url
  }
}`;

const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0] {
  ...,
  "slug": slug.current,
  priceTier,
  "images": images[].asset->url,
  "variants": variants[]{ _key, name, family, color, "slug": slug.current, "imageUrl": image.asset->url, "altText": image.alt, "gallery": gallery[].asset->url, badge },

  "resources": {
    "technicalSheets": resources.technicalSheets[]{ title, "fileUrl": asset->url },
    "bimModels": resources.bimModels[]{ title, "fileUrl": asset->url },
    "productCatalogues": resources.productCatalogues[]{ title, "fileUrl": asset->url }
  },
  "category": category->{ title, "slug": slug.current, description },
  "relatedProjects": *[_type == "project" && references(^._id)] {
    title,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    location
  },
  "seo": {
    "metaTitle": seo.metaTitle,
    "metaDescription": seo.metaDescription,
    "keywords": seo.keywords,
    "openGraphImage": seo.openGraphImage.asset->url
  }
}`;

// Fetch functions
import { enhanceProducts, enhanceProduct } from './seo-content';

// ... (existing imports)

// Fetch functions
export async function getProducts(): Promise<Product[]> {
    try {
        console.log('Fetching products from Sanity...');
        const products = await client.fetch(productsQuery, {}, { next: { revalidate: 60 } });

        if (!products || products.length === 0) {
            console.warn('No products found in Sanity.');
            return [];
        }

        console.log(`Fetched ${products.length} products from Sanity.`);
        // Enhanced via SEO Content Module
        return enhanceProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function getDashboardProducts(): Promise<Product[]> {
    try {
        const adminClient = client.withConfig({ useCdn: false });
        console.log('Fetching fresh products for dashboard...');
        const products = await adminClient.fetch(productsQuery, {}, {
            next: { revalidate: 0 },
            cache: 'no-store'
        });

        return enhanceProducts(products || []);
    } catch (error) {
        console.error('Error fetching dashboard products:', error);
        return [];
    }
}

export async function getCategories(): Promise<string[]> {
    try {
        const categories = await client.fetch(groq`*[_type == "category"] | order(title asc) { title }`, {}, { next: { revalidate: 60 } });
        return categories.map((c: any) => c.title);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
    try {
        const product = await client.fetch(productBySlugQuery, { slug }, { next: { revalidate: 60 } });
        if (!product) {
            return undefined;
        }
        // Enhanced via SEO Content Module
        return enhanceProduct(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return undefined;
    }
}

export async function getRelatedProducts(category: string, currentSlug: string): Promise<Product[]> {
    const products = await getProducts();
    // Filter by category match (simple string match for now)
    return products
        .filter(p => (p.tag === category || p.category?.title === category || p.category?.slug === category) && p.slug !== currentSlug)
        .slice(0, 4);
}

// Enhanced Collection Fetcher (Unifies Category and Collection documents)
export async function getCollectionBySlug(collectionSlug: string): Promise<any | undefined> {
    try {
        const query = groq`*[(_type == "collection" || _type == "category") && slug.current == $slug][0] {
            "id": _id,
            "_type": _type,
            title,
            description,
            filterTags,
            "displayOrder": displayOrder,
            "seo": {
                "metaTitle": seo.metaTitle,
                "metaDescription": seo.metaDescription,
                "keywords": seo.keywords,
                "openGraphImage": seo.openGraphImage.asset->url,
                "openGraphImages": seo.openGraphImages[].asset->url
            },
            "imageUrl": select(
                _type == "collection" => featuredImage.asset->url,
                _type == "category" => image.asset->url
            )
        }`;

        const collection = await client.fetch(query, { slug: collectionSlug }, { next: { revalidate: 60 } });
        return collection || undefined;
    } catch (error) {
        console.error('Error fetching collection:', error);
        return undefined;
    }
}

// Optimized query for OG Image generation for Categories
export async function getCategoryHero(categorySlug: string): Promise<{ title: string, imageUrl: string } | undefined> {
    try {
        // 1. Try to find the actual Category document first
        const categoryQuery = groq`*[_type == "category" && slug.current == $slug][0] {
            title,
            "imageUrl": image.asset->url
        }`;

        const categoryDoc = await client.fetch(categoryQuery, { slug: categorySlug }, { next: { revalidate: 3600 } });

        // 2. Fallback: Find a representative product
        const productQuery = groq`*[_type == "product" && (category->slug.current == $slug || tag == $slug)][0] {
            title,
            "imageUrl": images[0].asset->url
        }`;

        const productDoc = await client.fetch(productQuery, { slug: categorySlug }, { next: { revalidate: 3600 } });

        // Mapping for Titles (Legacy Fallback)
        const slugToTitle: Record<string, string> = {
            'exposed-bricks': 'Exposed Bricks',
            'brick-wall-tiles': 'Brick Wall Tiles',
            'terracotta-jaali': 'Terracotta Jali',
            'floor-tiles': 'Floor Tiles',
            'roof-tiles': 'Roof Tiles',
            'facades': 'Clay Facade Panels'
        };

        // Logic: specific category doc > product fallback > hardcoded fallback
        const title = categoryDoc?.title
            || slugToTitle[categorySlug]
            || (productDoc ? `${productDoc.title} Collection` : 'UrbanClay Collection');

        const imageUrl = categoryDoc?.imageUrl || productDoc?.imageUrl;

        if (title && imageUrl) {
            return { title, imageUrl };
        }
        return undefined;
    } catch (e) {
        console.error('Error fetching category hero', e);
        return undefined;
    }
}





const projectsQuery = groq`*[_type == "project"] {
  _id,
  title,
  "slug": slug.current,
  location,
  type,
  "isFeatured": isFeatured,
  description,
  "imageUrl": image.asset->url,
  "gallery": gallery[].asset->url,
  "productsUsed": productsUsed[]->{
    title,
    "slug": slug.current,
    "imageUrl": images[0].asset->url, 
    "category": category->slug.current
  }
}`;

const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  ...,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  "gallery": gallery[].asset->url,
  "productsUsed": productsUsed[]->{
    title,
    "slug": slug.current,
    "imageUrl": images[0].asset->url,
    "category": category->slug.current
  }
}`;

export async function getProjects(): Promise<Project[]> {
    try {
        const projects = await client.fetch(projectsQuery, {}, { next: { revalidate: 60 } });
        return projects || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}


export async function getProject(slug: string): Promise<Project | undefined> {
    try {
        const project = await client.fetch(projectBySlugQuery, { slug }, { next: { revalidate: 3600 } });
        if (!project) {
            return undefined;
        }
        return project;
    } catch (error) {
        console.error('Error fetching project:', error);
        return undefined;
    }
}

export interface HomePageData {
    heroImageUrl?: string;
    heroHeading?: string;
    heroSubheading?: string;
    ourStoryImageUrl?: string;
}

const homePageQuery = groq`*[_type == "homePage"][0] {
  "heroImageUrl": heroImage.asset->url,
  heroHeading,
  heroSubheading,
  "ourStoryImageUrl": ourStoryImage.asset->url
}`;

export async function getHomePageData(): Promise<HomePageData | null> {
    try {
        const data = await client.fetch(homePageQuery, {}, { next: { revalidate: 60 } });
        return data;
    } catch (error) {
        console.error('Error fetching home page data:', error);
        return null;
    }
}

export interface GuideData {
    spectrumItems: {
        title: string;
        imageUrl: string;
        description: string;
        features: string[];
        bestFor?: string;
        link?: string;
    }[];
    comparisonRows: {
        feature: string;
        wirecut: string;
        pressed: string;
        handmade: string;
    }[];
    glossaryItems: {
        term: string;
        definition: string;
        icon?: any;
    }[];
}

const guideQuery = groq`*[_type == "selectionGuide"][0] {
  "spectrumItems": spectrumItems[]{
    title,
    "imageUrl": image.asset->url,
    description,
    features
  },
  comparisonRows,
  glossaryItems
}`;

export async function getGuideData(): Promise<GuideData | null> {
    try {
        const data = await client.fetch(guideQuery, {}, { next: { revalidate: 60 } });
        return data;
    } catch (error) {
        console.error('Error fetching guide data:', error);
        return null;
    }
}

export interface Resource {
    _id: string;
    title: string;
    description?: string;
    type: string;
    url?: string;
    size?: string;
    _createdAt: string;
}

export async function getResources(): Promise<Resource[]> {
    try {
        const query = groq`*[_type == "resource"] | order(_createdAt desc) {
            _id,
            title,
            description,
            type,
            "url": file.asset->url,
            size,
            _createdAt
        }`;
        const resources = await client.fetch(query, {}, { next: { revalidate: 60 } });
        return resources || [];
    } catch (error) {
        console.error('Error fetching resources:', error);
        return [];
    }
}

export async function getTextures(): Promise<any[]> {
    try {
        const query = groq`*[_type == "product" && defined(texturePackage.seamlessPreview)] {
            _id,
            title,
            "previewUrl": texturePackage.seamlessPreview.asset->url,
            "downloadUrl": texturePackage.downloadFile.asset->url
        }`;
        const textures = await client.fetch(query, {}, { next: { revalidate: 60 } });
        return textures || [];
    } catch (error) {
        console.error('Error fetching textures:', error);
        return [];
    }
}
