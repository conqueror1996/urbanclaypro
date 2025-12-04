import { createClient, type SanityClient } from 'next-sanity';
import { groq } from 'next-sanity';

let client: SanityClient;
try {
    client = createClient({
        apiVersion: '2024-11-28',
        dataset: 'production',
        projectId: '22qqjddz',
        useCdn: false,
    });
} catch (e) {
    console.error("Sanity client creation failed:", e);
    // Mock client to prevent build crash
    client = {
        fetch: async () => []
    } as unknown as SanityClient;
}

export interface Product {
    slug: string;
    title: string;
    subtitle: string;
    tag: string;
    specs: {
        size: string;
        waterAbsorption: string;
        compressiveStrength: string;
        firingTemperature: string;
    };
    priceRange: string;
    description: string;
    images?: any[];
    imageUrl?: string;
    variants?: {
        name: string;
        imageUrl: string;
        altText?: string;
        gallery?: string[];
    }[];
    collections?: {
        name: string;
        description?: string;
        priceRange?: string;
        specs?: {
            size?: string;
            thickness?: string;
            coverage?: string;
            weight?: string;
            waterAbsorption?: string;
            compressiveStrength?: string;
        };
        variants: {
            name: string;
            imageUrl: string;
            gallery?: string[];
        }[];
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
}

// Fallback Products
export const fallbackProducts: Product[] = [
    {
        slug: 'wirecut-bricks',
        title: 'Wirecut Bricks',
        subtitle: 'Precision & Durability',
        tag: 'Best Seller',
        specs: {
            size: '9" x 4" x 3"',
            waterAbsorption: '< 10%',
            compressiveStrength: '> 35 N/mm²',
            firingTemperature: '1000°C'
        },
        priceRange: '₹12 - ₹18 per piece',
        description: 'High-quality wirecut bricks known for their uniform shape and high compressive strength. Ideal for exposed brickwork.',
        imageUrl: '',
        variants: [],
        collections: []
    },
    {
        slug: 'exposed-bricks',
        title: 'Exposed Bricks',
        subtitle: 'Rustic & Timeless',
        tag: 'Trending',
        specs: {
            size: '9" x 4" x 3"',
            waterAbsorption: '< 12%',
            compressiveStrength: '> 25 N/mm²',
            firingTemperature: '950°C'
        },
        priceRange: '₹15 - ₹22 per piece',
        description: 'Classic exposed bricks that add a rustic charm to any building. Perfect for facades and interior feature walls.',
        imageUrl: '',
        variants: [],
        collections: []
    },
    {
        slug: 'terracotta-jaalis',
        title: 'Terracotta Jaalis',
        subtitle: 'Ventilation & Aesthetics',
        tag: 'New Arrival',
        specs: {
            size: '8" x 8" x 2.5"',
            waterAbsorption: '< 15%',
            compressiveStrength: '> 15 N/mm²',
            firingTemperature: '900°C'
        },
        priceRange: '₹45 - ₹60 per piece',
        description: 'Decorative terracotta blocks that provide natural ventilation and light control while enhancing the building elevation.',
        imageUrl: '',
        variants: [],
        collections: []
    },
    {
        slug: 'linear-cladding',
        title: 'Linear Cladding',
        subtitle: 'Sleek & Modern',
        tag: 'Architectural',
        specs: {
            size: '300mm x 50mm x 20mm',
            waterAbsorption: '< 6%',
            compressiveStrength: '> 40 N/mm²',
            firingTemperature: '1100°C'
        },
        priceRange: '₹80 - ₹120 per sqft',
        description: 'Long format linear bricks for a contemporary, horizontal aesthetic.',
        imageUrl: 'https://images.unsplash.com/photo-1620626012053-1c167f7ebc8d?q=80&w=300&auto=format&fit=crop',
        variants: [],
        collections: []
    }
];

// GROQ Queries
const productsQuery = groq`*[_type == "product"] {
  _id,
  title,
  "slug": slug.current,
  subtitle,
  tag,
  specs,
  priceRange,
  description,
  "imageUrl": images[0].asset->url,
  "variants": variants[]{ name, "imageUrl": image.asset->url, "altText": image.alt, "gallery": gallery[].asset->url },
  "collections": collections[]{
    name,
    description,
    priceRange,
    specs,
    "variants": variants[]{ name, "imageUrl": image.asset->url, "gallery": gallery[].asset->url }
  },
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
  }
}`;

const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0] {
  ...,
  "slug": slug.current,
  "images": images[].asset->url,
  "variants": variants[]{ name, "imageUrl": image.asset->url, "altText": image.alt, "gallery": gallery[].asset->url },
  "collections": collections[]{
    name,
    description,
    priceRange,
    specs,
    "variants": variants[]{ name, "imageUrl": image.asset->url, "gallery": gallery[].asset->url }
  },
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
  }
}`;

// Fetch functions
export async function getProducts(): Promise<Product[]> {
    try {
        console.log('Fetching products from Sanity...');
        const products = await client.fetch(productsQuery, {}, { next: { revalidate: 60 } });
        if (!products || products.length === 0) {
            console.warn('No products found in Sanity, using fallback data.');
            return fallbackProducts;
        }
        console.log(`Fetched ${products.length} products from Sanity.`);
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return fallbackProducts;
    }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
    try {
        const product = await client.fetch(productBySlugQuery, { slug }, { next: { revalidate: 60 } });
        if (!product) {
            return fallbackProducts.find(p => p.slug === slug);
        }
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return fallbackProducts.find(p => p.slug === slug);
    }
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
    productsUsed?: string[];
}

// Fallback Projects
export const fallbackProjects: Project[] = [
    {
        slug: 'bhairavi-residence',
        title: 'Bhairavi Residence',
        location: 'Juhu, Mumbai',
        type: 'Residential',
        description: 'Exposed brick facade using 9×3×18mm tiles with almond-cream grout for a timeless aesthetic.',
        imageUrl: '',
        gallery: ['', '', ''],
        productsUsed: ['Exposed Brick Tiles']
    },
    {
        slug: 'courtyard-cafe',
        title: 'Courtyard Café',
        location: 'Koregaon Park, Pune',
        type: 'Hospitality',
        description: 'Terracotta jaali walls providing ventilation and light play in the central courtyard.',
        imageUrl: '',
        gallery: ['', '', ''],
        productsUsed: ['Terracotta Jaali']
    },
    {
        slug: 'tech-park-lobby',
        title: 'Tech Park Lobby',
        location: 'Whitefield, Bangalore',
        type: 'Commercial',
        description: 'Linear brick tiles creating a sleek, modern feature wall in the main reception area.',
        imageUrl: '',
        gallery: ['', '', ''],
        productsUsed: ['Linear Brick Tiles']
    }
];

const projectsQuery = groq`*[_type == "project"] {
  _id,
  title,
  "slug": slug.current,
  location,
  type,
  description,
  "imageUrl": image.asset->url,
  "gallery": gallery[].asset->url,
  "productsUsed": productsUsed[]->title
}`;

const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  ...,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  "gallery": gallery[].asset->url,
  "productsUsed": productsUsed[]->title
}`;

export async function getProjects(): Promise<Project[]> {
    try {
        const projects = await client.fetch(projectsQuery, {}, { next: { revalidate: 60 } });
        if (!projects || projects.length === 0) {
            return fallbackProjects;
        }
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return fallbackProjects;
    }
}

export async function getProject(slug: string): Promise<Project | undefined> {
    try {
        const project = await client.fetch(projectBySlugQuery, { slug }, { next: { revalidate: 3600 } });
        if (!project) {
            return fallbackProjects.find(p => p.slug === slug);
        }
        return project;
    } catch (error) {
        console.error('Error fetching project:', error);
        return fallbackProjects.find(p => p.slug === slug);
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
