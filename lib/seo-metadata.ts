
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
        metaTitle: 'Premium Exposed Wirecut Bricks | Authentic Red & Grey Masonry Bricks',
        metaDescription: 'Discover India\'s most versatile range of exposed wirecut bricks. Perfect for load-bearing and partition walls with a natural, earthen aesthetic. High-compressive strength solutions.',
        keywords: ['exposed bricks', 'wirecut bricks', 'facing bricks', 'red clay bricks', 'facade bricks india']
    },
    'brick-wall-tiles': {
        displayTitle: 'Brick Wall Tiles',
        metaTitle: 'Thin Brick Cladding & Interior Brick Veneers | UrbanClay India',
        metaDescription: 'Achieve the classic exposed brick look without the weight. Our thin brick wall tiles are ideal for interior feature walls and modern exterior cladding.',
        keywords: ['brick cladding tiles', 'exposed brick tiles', 'wall cladding', 'interior brick veneer', 'thin bricks']
    },
    'terracotta-jaali': {
        displayTitle: 'Terracotta Jali',
        metaTitle: 'Artistic Terracotta Jali Blocks | Passive Cooling Screen Walls',
        metaDescription: 'Handcrafted terracotta ventilation blocks (Jaali) designed for privacy, light play, and natural ventilation in tropical architecture. Explore unique geometric patterns.',
        keywords: ['terracotta jaali', 'jaali blocks', 'breeze blocks', 'ventilation blocks', 'clay jali', 'facade screens']
    },
    'floor-tiles': {
        displayTitle: 'Terracotta Floor Tiles',
        metaTitle: 'Rustic Handcrafted Floor Tiles | Naturally Slip-Resistant Flooring',
        metaDescription: 'Earthen terracotta floor tiles for verandas, courtyards, and heritage homes. Durable, cool underfoot, and available in multiple sizes and finishes.',
        keywords: ['terracotta floor tiles', 'clay pavers', 'handmade tiles', 'rustic flooring', 'red floor tiles']
    },
    'roof-tiles': {
        displayTitle: 'Roof Tiles',
        metaTitle: 'Premium Clay Roofing Solutions | High Thermal Insulation Tiles',
        metaDescription: 'Weather-proof clay roof tiles that keep interiors naturally cool. From traditional Mangalore designs to modern interlocking roofing tiles.',
        keywords: ['clay roof tiles', 'mangalore tiles', 'roofing tiles interior', 'cooling roof tiles', 'weather proof tiles']
    },
    'facades': {
        displayTitle: 'Clay Facade Panels',
        metaTitle: 'Ventilated Clay Cladding Systems | Energy-Efficient Building Envelopes',
        metaDescription: 'Modular terracotta facade panels for sustainable skyscrapers and residential projects. Advanced rain-screen technology with thermal benefits.',
        keywords: ['ventilated facade', 'clay facade panels', 'terracotta cladding', 'facade louvers', 'architectural facade']
    },
    'wirecut-bricks': {
        displayTitle: 'Wirecut Bricks',
        metaTitle: 'Precision-Cut Wirecut Bricks | Sharp Edges for Modern Masonry',
        metaDescription: 'Machine-produced wirecut bricks for uniform masonry and modern industrial aesthetics. Low maintenance and high aesthetic appeal for urban projects.',
        keywords: ['wirecut bricks', 'machine bricks', 'exposed masonry', 'red wirecut', 'bangalore bricks']
    },
    'breeze-blocks': {
        displayTitle: 'Breeze Blocks',
        metaTitle: 'Decorative Concrete & Clay Breeze Blocks | Visual Separation Screens',
        metaDescription: 'Mid-century modern inspired breeze blocks for architectural screening. Create stunning light patterns and facilitate airflow in your design.',
        keywords: ['breeze blocks', 'ventilation blocks', 'hollow blocks', 'screen wall', 'terracotta jali']
    },
    'handmade-bricks': {
        displayTitle: 'Handmade Bricks',
        metaTitle: 'Artisanal Handmade Clay Bricks | Unique Textures & Earthen Tones',
        metaDescription: 'Each brick is a piece of art. Our handmade clay bricks offer unmatched character and texture for signature architectural masterpieces.',
        keywords: ['handmade bricks', 'artisanal bricks', 'reclaimed look bricks', 'textured clay bricks', 'custom bricks']
    },
    'cement-jaali': {
        displayTitle: 'Cement Jali',
        metaTitle: 'Geometric Cement Jaali Blocks | Minimalist Ventilation Screens',
        metaDescription: 'Modern cement-based ventilation blocks for contemporary industrial and brutalist architecture. Durable, precision-cast jali designs for facade screening.',
        keywords: ['cement jaali', 'concrete jali', 'rcc jaali', 'modern jali design', 'industrial ventilation']
    },
    'terracotta-louvers': {
        displayTitle: 'Terracotta Louvers',
        metaTitle: 'Clay Baguettes & Sun-Shading Louvers | Vertical Facade Finishes',
        metaDescription: 'Sustainable sun-shading solutions using terracotta baguettes and louvers. Enhance building energy efficiency with natural clay architectural elements.',
        keywords: ['terracotta louvers', 'clay baguettes', 'sun shading', 'vertical fins', 'facade louvers']
    }
};

export const resolveCategoryKey = (slug: string): string | undefined => {
    if (CATEGORY_METADATA[slug]) return slug;
    const normalize = slug.toLowerCase().replace(/s$/, '');

    // Reverse lookup or common synonyms
    if (normalize === 'exposed-brick') return 'exposed-bricks';
    if (normalize === 'brick-wall-tile') return 'brick-wall-tiles';
    if (normalize === 'floor-tile') return 'floor-tiles';
    if (normalize === 'roof-tile' || normalize === 'clay-tile') return 'roof-tiles';
    if (normalize === 'facade') return 'facades';
    if (normalize === 'jaali' || normalize === 'jali') return 'terracotta-jaali';
    if (normalize === 'cement-jaali' || normalize === 'cement-jali') return 'cement-jaali';
    if (normalize === 'handmade-brick') return 'handmade-bricks';
    if (normalize === 'wirecut-brick') return 'wirecut-bricks';
    if (normalize === 'breeze-block') return 'breeze-blocks';
    if (normalize === 'terracotta-louver' || normalize === 'terracotta-louvers' || normalize === 'baguette') return 'terracotta-louvers';

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
