
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
        metaTitle: 'Premium Facing Bricks & Exposed Wirecut Bricks | UrbanClay India',
        metaDescription: 'India\'s finest range of Exposed Wirecut Bricks and Facing Bricks. Low efflorescence, high compressive strength, and available in Red, Grey & Chocolate tones.',
        keywords: ['exposed bricks', 'wirecut bricks', 'facing bricks', 'red clay bricks', 'facade bricks india', 'architectural bricks']
    },
    'brick-wall-tiles': {
        displayTitle: 'Brick Wall Tiles',
        metaTitle: 'Thin Brick Cladding Tiles & Interior Veneers | Manufacturer India',
        metaDescription: 'Real clay Brick Cladding tiles for interior and exterior walls. Achieve the exposed brick aesthetic with our lightweight, easy-to-install thin brick veneers.',
        keywords: ['brick cladding tiles', 'exposed brick tiles', 'wall cladding', 'interior brick veneer', 'thin bricks', 'facade tiles']
    },
    'terracotta-jaali': {
        displayTitle: 'Terracotta Jali',
        metaTitle: 'Terracotta Jaali Blocks & Breeze Blocks | Ventilation Screens',
        metaDescription: 'Sustainable Terracotta Jaali blocks for passive cooling and facade screening. Explore our range of geometric clay breeze blocks for modern Indian architecture.',
        keywords: ['terracotta jaali', 'jaali blocks', 'breeze blocks', 'ventilation blocks', 'clay jali', 'facade screens', 'breeze bricks']
    },
    'floor-tiles': {
        displayTitle: 'Terracotta Floor Tiles',
        metaTitle: 'Terracotta Floor Tiles & Clay Pavers | Natural & Slip-Resistant',
        metaDescription: 'Handcrafted Terracotta Floor Tiles and heavy-duty Clay Pavers. Cool underfoot, eco-friendly, and perfect for verandas, patios, and heritage restoration.',
        keywords: ['terracotta floor tiles', 'clay pavers', 'handmade tiles', 'rustic flooring', 'red floor tiles', 'weathering tiles']
    },
    'roof-tiles': {
        displayTitle: 'Roof Tiles',
        metaTitle: 'Clay Roof Tiles & Mangalore Tiles | Heat Resistant Roofing',
        metaDescription: 'Premium Clay Roof Tiles for superior thermal insulation. Authentic Mangalore tiles and modern interlocking flat roof tiles for Indian homes.',
        keywords: ['clay roof tiles', 'mangalore tiles', 'roofing tiles interior', 'cooling roof tiles', 'weather proof tiles', 'kerala roof tiles']
    },
    'facades': {
        displayTitle: 'Clay Facade Panels',
        metaTitle: 'Ventilated Facade Systems & Cladding Panels | UrbanClay',
        metaDescription: 'High-performance Terracotta Facade Panels and Louvers. Advanced dry-cladding systems for sustainable, energy-efficient commercial buildings.',
        keywords: ['ventilated facade', 'clay facade panels', 'terracotta cladding', 'facade louvers', 'architectural facade', 'dry cladding']
    },
    'wirecut-bricks': {
        displayTitle: 'Wirecut Bricks',
        metaTitle: 'Wirecut Bricks Manufacturer | Precision Exposed Masonry',
        metaDescription: 'Machine-made Wirecut Bricks with sharp edges and uniform texture. The preferred choice for modern exposed brick architecture in India.',
        keywords: ['wirecut bricks', 'machine bricks', 'exposed masonry', 'red wirecut', 'bangalore bricks', 'facing bricks']
    },
    'breeze-blocks': {
        displayTitle: 'Breeze Blocks',
        metaTitle: 'Clay Breeze Blocks & Decorative Jaali | Partition Screens',
        metaDescription: 'Mid-century modern Clay Breeze Blocks for stylish ventilation. Create stunning light patterns and privacy screens with our natural terracotta range.',
        keywords: ['breeze blocks', 'ventilation blocks', 'hollow blocks', 'screen wall', 'terracotta jali', 'claustra blocks']
    },
    'handmade-bricks': {
        displayTitle: 'Handmade Bricks',
        metaTitle: 'Artisanal Handmade Bricks | Antique & Reclaimed Look',
        metaDescription: 'Authentic Handmade Clay Bricks for a timeless, rustic aesthetic. Unique textures and varied tones for heritage and luxury residential projects.',
        keywords: ['handmade bricks', 'artisanal bricks', 'reclaimed look bricks', 'textured clay bricks', 'custom bricks', 'soft mud bricks']
    },
    'cement-jaali': {
        displayTitle: 'Cement Jali',
        metaTitle: 'Concrete Jaali Blocks & Ventilation Grills | Modern Designs',
        metaDescription: 'Durable Cement Jaali blocks for robust architectural screening. Minimalist, geometric designs for contemporary building facades and compound walls.',
        keywords: ['cement jaali', 'concrete jali', 'rcc jaali', 'modern jali design', 'industrial ventilation', 'breeze blocks India']
    },
    'terracotta-louvers': {
        displayTitle: 'Terracotta Louvers',
        metaTitle: 'Terracotta Baguettes & Louvers | Solar Shading Systems',
        metaDescription: 'Architectural Terracotta Baguettes and Louvers for effective sun shading and linear facade aesthetics. Sustainable vertical screening solutions.',
        keywords: ['terracotta louvers', 'clay baguettes', 'sun shading', 'vertical fins', 'facade louvers', 'solar shading']
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

const DEFAULT_OG_IMAGE = 'https://claytile.in/api/og?title=UrbanClay&subtitle=Premium%20Terracotta%20Products';

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
        let uniqueImages = Array.from(new Set(combinedImages)).filter((img): img is string => !!img).slice(0, 5);

        if (uniqueImages.length === 0) {
            uniqueImages = [DEFAULT_OG_IMAGE];
        }

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
                // Use default instead of potentially broken specific slug OG
                images = [DEFAULT_OG_IMAGE];
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
