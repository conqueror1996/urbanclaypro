import { ImageResponse } from 'next/og';
import { getProduct, getProject, getCategoryHero } from '@/lib/products';
import { CITIES } from '@/lib/locations';
import { getJournalPost } from '@/lib/journal';

export const runtime = 'edge';

// Load fonts dynamically
const fontInter = fetch(new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff')).then(res => res.arrayBuffer());
const fontPlayfair = fetch(new URL('https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWbn2PKdFvXDXbtM.woff')).then(res => res.arrayBuffer());

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'product';
    const slugParam = searchParams.get('slug');

    // Wait for fonts
    const [interData, playfairData] = await Promise.all([fontInter, fontPlayfair]);

    if (!slugParam) {
        return new ImageResponse(
            (
                <div style={{
                    height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#1a1512', color: '#e7dbd1',
                }}>
                    <div style={{ fontSize: 80, fontFamily: '"Playfair Display"', letterSpacing: '-0.02em' }}>URBANCLAY</div>
                </div>
            ),
            { width: 1200, height: 630, fonts: [{ name: 'Playfair Display', data: playfairData, style: 'normal' }] }
        );
    }

    // Handle slashes if passed "category/slug" -> take last part
    const slugParts = slugParam.split('/');
    const productSlug = slugParts[slugParts.length - 1];

    let item: any = null;
    let label = 'Collection';
    let subLabel = '';
    let categoryTitle = 'Premium Collection';

    // 1. PROJECT
    if (type === 'project') {
        const project = await getProject(productSlug);
        if (project) {
            item = project;
            label = 'Project Spotlight';
            subLabel = project.location || 'India';
            categoryTitle = 'Architecture';
        }
    }
    // 2. CATEGORY
    else if (type === 'category') {
        const categoryData = await getCategoryHero(productSlug);
        if (categoryData) {
            item = categoryData;
            label = 'Curated Collection';
            categoryTitle = 'UrbanClay Series';
        }
    }
    // 3. CITY
    else if (type === 'city') {
        const cityData = CITIES[productSlug];
        if (cityData) {
            item = {
                title: `Terracotta in ${cityData.name}`,
                imageUrl: 'https://claytile.in/images/architect-hero-confidence.png', // Fallback or city specific
                priceRange: null
            };
            label = `Serving ${cityData.region} India`;
            categoryTitle = 'Local Experience';
        }
    }
    // 4. JOURNAL
    else if (type === 'journal' || type === 'article') {
        try {
            const post = await getJournalPost(productSlug);
            if (post) {
                item = {
                    title: post.title,
                    imageUrl: post.mainImage || 'https://claytile.in/images/kiln-firing-process.jpg',
                    priceRange: post.readTime // Using price slot for read time
                };
                label = 'The Clay Journal';
                categoryTitle = 'Editorial';
            }
        } catch (e) { console.error(e) }
    }
    // 5. PRODUCT (Default)
    else {
        const product = await getProduct(productSlug);
        if (product) {
            item = product;
            label = product.category?.title || 'Signature Series';
            categoryTitle = product.tag || 'Terracotta';
        }
    }

    // Fallback if item not found
    if (!item) {
        return new ImageResponse(
            (
                <div style={{
                    height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#1a1512', color: '#e7dbd1'
                }}>
                    <div style={{ fontSize: 60, fontFamily: 'Inter', fontWeight: 800 }}>URBANCLAY</div>
                    <div style={{ fontSize: 30, opacity: 0.6, marginTop: 20, fontFamily: 'Inter' }}>Item Not Found</div>
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }

    return new ImageResponse(
        (
            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#1a1512',
                position: 'relative',
            }}>
                {/* 1. Background Image */}
                <img
                    src={item.imageUrl || 'https://claytile.in/og-fallback.jpg'}
                    alt={item.title}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.95
                    }}
                />

                {/* 2. Cinematic Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(to top, #1a1512 0%, rgba(26, 21, 18, 0.95) 30%, rgba(0,0,0,0) 70%)',
                }} />

                {/* 3. Content Layer */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '60px 80px',
                }}>
                    {/* Top Bar: Brand & Label */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Brand */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ea580c', display: 'flex' }} />
                            <span style={{ fontSize: 24, fontFamily: 'Inter', fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                UrbanClay
                            </span>
                        </div>

                        {/* Dynamic Label Badge */}
                        <div style={{
                            padding: '10px 24px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '100px',
                            color: '#ea580c',
                            fontSize: 16,
                            fontFamily: 'Inter',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            textTransform: 'uppercase'
                        }}>
                            {label}
                        </div>
                    </div>

                    {/* Bottom Content */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Meta Tag (e.g., Price, Location, Read Time) */}
                        {(item.priceRange || subLabel) && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '20px',
                                color: 'rgba(255,255,255,0.8)',
                                fontFamily: 'Inter',
                                fontSize: 20,
                                fontWeight: 500
                            }}>
                                {item.priceRange ? <span style={{ color: '#ea580c' }}>{item.priceRange}</span> : null}
                                {subLabel ? <span>{subLabel}</span> : null}
                            </div>
                        )}

                        {/* Main Title */}
                        <div style={{
                            fontSize: item.title.length > 30 ? 72 : 84, // Auto-scale font
                            fontFamily: '"Playfair Display"',
                            color: '#ffffff',
                            lineHeight: 1,
                            marginBottom: '24px',
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            maxWidth: '95%'
                        }}>
                            {item.title}
                        </div>

                        {/* Footer / URL */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                            borderTop: '1px solid rgba(255,255,255,0.2)',
                            paddingTop: '24px',
                            width: '100%'
                        }}>
                            <span style={{ fontSize: 20, fontFamily: 'Inter', color: '#ea580c', fontWeight: 600, marginRight: '16px' }}>claytile.in</span>
                            <span style={{ fontSize: 20, fontFamily: 'Inter', color: '#a3a3a3' }}>
                                {categoryTitle} • Handcrafted in India
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Inter',
                    data: interData,
                    style: 'normal',
                    weight: 400,
                },
                {
                    name: 'Playfair Display',
                    data: playfairData,
                    style: 'normal',
                    weight: 400,
                },
            ],
        }
    );
}
