
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
    priceTier?: string;
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
        badge?: string;
        color?: string;
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
