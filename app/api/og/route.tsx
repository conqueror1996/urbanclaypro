import { ImageResponse } from 'next/og';
import { getProduct, getProject, getCategoryHero } from '@/lib/products';

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
    let categoryTitle = 'Collection';
    let label = 'Product';

    if (type === 'project') {
        const project = await getProject(productSlug);
        if (project) {
            item = project;
            categoryTitle = project.location || 'Architecture';
            label = 'Project';
        }
    } else if (type === 'category') {
        // Handle Category Mode
        const categoryData = await getCategoryHero(productSlug);
        if (categoryData) {
            item = categoryData;
            categoryTitle = 'Our Collection';
            label = 'Category';
        }
    } else {
        const product = await getProduct(productSlug);
        if (product) {
            item = product;
            categoryTitle = product.category?.title || product.tag || 'Premium Collection';
        }
    }

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
                {/* 1. Full Bleed Background Image */}
                <img
                    src={item.imageUrl || 'https://urbanclay.in/og-fallback.jpg'}
                    alt={item.title}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.9
                    }}
                />

                {/* 2. Cinematic Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(to top, #1a1512 0%, rgba(26, 21, 18, 0.9) 25%, rgba(0,0,0,0) 60%)',
                }} />

                {/* 3. Content Layer */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '60px 80px',
                }}>
                    {/* Top Brand Mark */}
                    <div style={{
                        position: 'absolute',
                        top: 60,
                        left: 80,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ea580c', display: 'flex' }} />
                        <span style={{
                            fontSize: 24,
                            fontFamily: 'Inter',
                            fontWeight: 700,
                            color: '#fff',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase'
                        }}>UrbanClay</span>
                    </div>

                    {/* Tag / Category Badge */}
                    <div style={{ display: 'flex', marginBottom: '24px' }}>
                        <div style={{
                            padding: '10px 24px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '100px',
                            color: '#ea580c', // Terracotta Orange
                            fontSize: 18,
                            fontFamily: 'Inter',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ea580c' }} />
                            {categoryTitle}
                        </div>
                    </div>

                    {/* Main Title */}
                    <div style={{
                        fontSize: 84,
                        fontFamily: '"Playfair Display"',
                        color: '#ffffff',
                        lineHeight: 1,
                        marginBottom: '16px',
                        textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        maxWidth: '90%'
                    }}>
                        {item.title}
                    </div>

                    {/* Footer / Domain */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginTop: '10px'
                    }}>
                        <div style={{ height: 1, width: 60, backgroundColor: '#ea580c' }} />
                        <span style={{
                            fontSize: 20,
                            fontFamily: 'Inter',
                            color: '#a3a3a3',
                            letterSpacing: '0.05em'
                        }}>Original Terracotta • Handcrafted in India</span>
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
