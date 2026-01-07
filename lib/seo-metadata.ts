
import { Metadata } from 'next';
import { Product } from './types';
import { getCollectionBySlug, getProducts } from './products';

export const CATEGORY_METADATA: Record<string, {
    displayTitle: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[]
}> = {
    'exposed-bricks': {
        displayTitle: 'Exposed Bricks',
        metaTitle: 'Premium Exposed Wirecut Bricks | Red, Grey & Beige Facade Bricks',
        metaDescription: 'Buy India\'s finest range of wirecut and handmade exposed bricks. Perfect for sustainable, breathable, and timeless facades. Available in Bangalore, Mumbai, Delhi.',
        keywords: ['exposed bricks', 'wirecut bricks', 'facing bricks', 'red clay bricks', 'facade bricks india']
    },
    'brick-wall-tiles': {
        displayTitle: 'Brick Wall Tiles',
        metaTitle: 'Thin Brick Cladding Tiles & Interior Brick Venners | Urban Clay',
        metaDescription: 'Transform your interiors and exteriors with thin brick cladding tiles. Get the authentic exposed brick look with easy installation and minimal weight.',
        keywords: ['brick cladding tiles', 'exposed brick tiles', 'wall cladding', 'interior brick veneer', 'thin bricks']
    },
    'terracotta-jaali': {
        displayTitle: 'Terracotta Jali',
        metaTitle: 'Terracotta Jaali Blocks & Ventilation Breeze Blocks | Urban Clay',
        metaDescription: 'Natural terracotta ventilation blocks (Jaali) that reduce indoor temperature and add artistic shadow patterns to building facades. Sustainable cooling solutions.',
        keywords: ['terracotta jaali', 'jaali blocks', 'breeze blocks', 'ventilation blocks', 'clay jali', 'facade screens']
    },
    'floor-tiles': {
        displayTitle: 'Floor Tiles',
        metaTitle: 'Handmade Terracotta Floor Tiles & Paving Bricks | Urban Clay',
        metaDescription: 'Handcrafted terracotta floor tiles for a rustic, earthen touch. Cool underfoot, durable, and naturally slip-resistant. Perfect for farmhouses and verandas.',
        keywords: ['terracotta floor tiles', 'clay pavers', 'handmade tiles', 'rustic flooring', 'red floor tiles']
    },
    'roof-tiles': {
        displayTitle: 'Roof Tiles',
        metaTitle: 'Premium Clay Roof Tiles for Indian Climate | Urban Clay',
        metaDescription: 'Weather-proof clay roof tiles that offer superior thermal insulation. Authentic Mangalore and pot tiles for heritage and modern tropical roofs.',
        keywords: ['clay roof tiles', 'mangalore tiles', 'roofing tiles interior', 'cooling roof tiles', 'weather proof tiles']
    },
    'facades': {
        displayTitle: 'Clay Facade Panels',
        metaTitle: 'Ventilated Clay Facade Systems & Louvers | Urban Clay',
        metaDescription: 'Advanced ventilated facade systems for commercial and high-end residential projects. Energy-efficient, rain-screen cladding, and baguettes.',
        keywords: ['ventilated facade', 'clay facade panels', 'terracotta cladding', 'facade louvers', 'architectural facade']
    },
    'wirecut-bricks': {
        displayTitle: 'Wirecut Bricks',
        metaTitle: 'Machine-Cut Wirecut Bricks | Uniform Facade Masonry',
        metaDescription: 'Precision-made wirecut bricks for modern exposed brick facades. High strength, sharp edges, and consistent sizing.',
        keywords: ['wirecut bricks', 'machine bricks', 'exposed masonry', 'red wirecut', 'bangalore bricks']
    },
    'breeze-blocks': {
        displayTitle: 'Breeze Blocks',
        metaTitle: 'Terracotta Breeze Blocks & Ventilation Jali | Urban Clay',
        metaDescription: 'Sustainable terracotta breeze blocks for natural ventilation and shading. Perfect for tropical architecture and screening.',
        keywords: ['breeze blocks', 'ventilation blocks', 'hollow blocks', 'screen wall', 'terracotta jali']
    }
};

export const resolveCategoryKey = (slug: string): string | undefined => {
    if (CATEGORY_METADATA[slug]) return slug;
    const normalize = slug.toLowerCase().replace(/s$/, '');

    // Reverse lookup or common synonyms
    if (normalize === 'exposed-brick') return 'exposed-bricks';
    if (normalize === 'brick-wall-tile') return 'brick-wall-tiles';
    if (normalize === 'floor-tile') return 'floor-tiles';
    if (normalize === 'roof-tile') return 'roof-tiles';
    if (normalize === 'facade') return 'facades';
    if (normalize === 'jaali' || normalize === 'jali' || normalize === 'cement-jaali') return 'terracotta-jaali';

    return undefined;
};

export const truncate = (text: string | undefined, length: number): string => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
};

export async function getCategoryMetadata(categorySlug: string): Promise<Metadata | null> {
    // 1. Try Dynamic Collection from CMS
    const dynamicCollection = await getCollectionBySlug(categorySlug);
    if (dynamicCollection) {
        const allProducts = await getProducts();
        const tagsToMatch = dynamicCollection.filterTags || [dynamicCollection.title, categorySlug];
        const categoryProducts = allProducts.filter((p: any) =>
            tagsToMatch.some((tag: string) =>
                tag && (
                    p.category?.title === tag ||
                    p.tag === tag ||
                    p.category?.slug === tag ||
                    p.category?.slug === tag?.toLowerCase().replace(/ /g, '-')
                )
            )
        );

        const productImages = categoryProducts.map(p => p.imageUrl).filter(Boolean).slice(0, 4);
        const seoImages = dynamicCollection.seo?.openGraphImages || [];
        const combinedImages = [...(dynamicCollection.seo?.openGraphImage ? [dynamicCollection.seo.openGraphImage] : []), ...seoImages, ...productImages];
        const uniqueImages = Array.from(new Set(combinedImages)).filter((img): img is string => !!img).slice(0, 5);

        const metaTitle = dynamicCollection.seo?.metaTitle || `${dynamicCollection.title} Collection | Premium Terracotta | UrbanClay`;
        const metaDescription = truncate(dynamicCollection.seo?.metaDescription || dynamicCollection.description || `Explore our exclusive ${dynamicCollection.title} collection. Sustainable, handcrafted terracotta solutions for modern architecture.`, 155);

        return {
            title: metaTitle,
            description: metaDescription,
            openGraph: {
                title: metaTitle,
                description: metaDescription,
                images: uniqueImages.map(url => ({
                    url,
                    width: 1200,
                    height: 630,
                    alt: `${dynamicCollection.title} - UrbanClay`
                })),
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: metaTitle,
                description: metaDescription,
                images: uniqueImages,
            }
        };
    }

    // 2. Fallback to Hardcoded
    const categoryKey = resolveCategoryKey(categorySlug);
    const categoryData = categoryKey ? CATEGORY_METADATA[categoryKey] : null;

    if (categoryData) {
        const allProducts = await getProducts();
        const categoryProducts = allProducts.filter((p: any) =>
            p.category?.title === categoryData.displayTitle ||
            p.tag === categoryData.displayTitle ||
            p.category?.slug === categoryKey
        );

        const productImages = categoryProducts.map(p => p.imageUrl).filter(Boolean).slice(0, 4);
        let images = productImages.length > 0 ? (productImages as string[]) : [];

        if (images.length === 0) {
            const { getCategoryHero } = await import('./products');
            const hero = await getCategoryHero(categorySlug);
            if (hero?.imageUrl) {
                images = [hero.imageUrl];
            } else {
                images = [`https://claytile.in/api/og?slug=${categorySlug}&type=category`];
            }
        }

        return {
            title: categoryData.metaTitle,
            description: categoryData.metaDescription,
            openGraph: {
                title: categoryData.metaTitle,
                description: categoryData.metaDescription,
                images: images.map(url => ({
                    url,
                    width: 1200,
                    height: 630,
                    alt: categoryData.displayTitle
                })),
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: categoryData.metaTitle,
                description: categoryData.metaDescription,
                images: images,
            }
        };
    }

    return null;
}
