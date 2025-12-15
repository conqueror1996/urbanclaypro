import { createClient, type SanityClient } from 'next-sanity';
import { groq } from 'next-sanity';

let client: SanityClient;
try {
    client = createClient({
        apiVersion: '2024-11-28',
        dataset: 'production',
        projectId: '22qqjddz',
        useCdn: false, // Keep CDN disabled in development for faster updates
    });
} catch (e) {
    console.error("Sanity client creation failed:", e);
    // Mock client to prevent build crash
    client = {
        fetch: async () => []
    } as unknown as SanityClient;
}

export interface Product {
    _id: string;
    slug: string;
    title: string;
    subtitle: string;
    price?: string;
    tag: string;
    category?: {
        title: string;
        slug: string;
        description?: string;
    };
    range?: string; // Range/Collection grouping (e.g., "Handmade Collection")
    specs: {
        size: string;
        coverage?: string;
        application?: string;
        waterAbsorption: string;
        compressiveStrength: string;
        firingTemperature: string;
        weight?: string;
        thickness?: string;
        efflorescence?: string;
    };
    priceRange: string;
    description: string;
    images?: any[];
    imageUrl?: string;
    variants?: {
        _key: string;
        name: string;
        family?: string; // Family group for grouping variants
        slug: string; // Added slug
        imageUrl: string;
        imageRef?: string;
        altText?: string;
        gallery?: string[];
        galleryRefs?: string[];
    }[];

    resources?: {
        technicalSheets?: { title: string; fileUrl: string }[];
        bimModels?: { title: string; fileUrl: string }[];
        productCatalogues?: { title: string; fileUrl: string }[];
    };
    relatedProjects?: {
        title: string;
        slug: string;
        imageUrl: string;
        location?: string;
    }[];
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        aiInsights?: string;
        lastAutomatedUpdate?: string;
        openGraphImage?: string;
    };
}

// GROQ Queries
const productsQuery = groq`*[_type == "product"] {
  _id,
  title,
  "slug": slug.current,
  subtitle,
  tag,
  "category": category->{ title, "slug": slug.current, description },
  range,
  specs,
  priceRange,
  description,
  "imageUrl": images[0].asset->url,
  "variants": variants[]{ _key, name, family, "slug": slug.current, "imageUrl": image.asset->url, "imageRef": image.asset._ref, "altText": image.alt, "gallery": gallery[].asset->url, "galleryRefs": gallery[].asset._ref },

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
  "images": images[].asset->url,
  "variants": variants[]{ _key, name, family, "slug": slug.current, "imageUrl": image.asset->url, "altText": image.alt, "gallery": gallery[].asset->url },

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
export async function getProducts(): Promise<Product[]> {
    try {
        console.log('Fetching products from Sanity...');
        const products = await client.fetch(productsQuery, {}, { next: { revalidate: 60 } });

        if (!products || products.length === 0) {
            console.warn('No products found in Sanity.');
            return [];
        }

        console.log(`Fetched ${products.length} products from Sanity.`);
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
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
        return product;
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

export async function getCollectionBySlug(collectionSlug: string): Promise<Product | undefined> {
    return getProduct(collectionSlug);
}


// Project Interface
export interface Project {
    slug: string;
    title: string;
    location: string;
    type: string;
    description: string;
    imageUrl?: string;
    gallery?: string[];
    productsUsed?: {
        title: string;
        slug: string;
        imageUrl: string;
        category: string;
    }[];
    isFeatured?: boolean;
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
