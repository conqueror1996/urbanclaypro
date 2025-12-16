import { ImageResponse } from 'next/og';
import { getProduct } from '@/lib/products';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    // Slug might be a path like "category/product" or just "product"
    // logic in getProduct usually expects just the end slug or handles it.
    // Our getProduct expects the specific product slug.
    // If canonicalPath includes category "exposed-brick/red-wirecut", we need just "red-wirecut".
    // Let's assume the passed slug param is the PRODUCT slug, or we parse it.
    // In page.tsx we will pass the full path or just the slug?
    // Let's pass the product slug explicitly.

    const slugParam = searchParams.get('slug'); // Should be the actual product ID slug

    if (!slugParam) {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1a1512',
                        color: '#e7dbd1',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div style={{ fontSize: 60, fontWeight: 'bold' }}>URBANCLAY</div>
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }

    // Handle slashes if passed "category/slug" -> take last part
    const slugParts = slugParam.split('/');
    const productSlug = slugParts[slugParts.length - 1];

    const product = await getProduct(productSlug);

    if (!product) {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1a1512',
                        color: '#e7dbd1',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div style={{ fontSize: 60, fontWeight: 'bold', textTransform: 'uppercase' }}>UrbanClay</div>
                    <div style={{ fontSize: 30, opacity: 0.6, marginTop: 20 }}>Product Not Found</div>
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    backgroundColor: '#1a1512',
                    fontFamily: '"DM Sans", sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        width: '55%',
                        height: '100%',
                        position: 'relative',
                        backgroundColor: '#2c241f',
                    }}
                >
                    {/* Use standard img for remote resources in edge runtime response */}
                    <img
                        src={product.imageUrl || 'https://urbanclay.in/og-fallback.jpg'}
                        alt={product.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0) 80%, rgba(26,21,18,1) 100%)'
                    }} />
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '45%',
                        height: '100%',
                        padding: '60px 50px',
                        justifyContent: 'center',
                        backgroundColor: '#1a1512',
                        color: '#fff',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '40px',
                        opacity: 0.7
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ea580c' }} />
                        <span style={{ fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#e7dbd1' }}>URBANCLAY</span>
                    </div>

                    <div style={{
                        fontSize: 56,
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '20px',
                        color: '#fff',
                        textTransform: 'capitalize'
                    }}>
                        {product.title}
                    </div>

                    <div style={{ display: 'flex' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 20px',
                            borderRadius: '100px',
                            backgroundColor: 'rgba(234, 88, 12, 0.15)',
                            border: '1px solid rgba(234, 88, 12, 0.3)',
                            color: '#fb923c',
                            fontSize: 20,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {product.category?.title || product.tag || 'Collection'}
                        </div>
                    </div>

                    <div style={{
                        marginTop: 'auto',
                        fontSize: 22,
                        color: '#525252',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{ height: 1, width: 40, backgroundColor: '#333' }} />
                        <span>urbanclay.in</span>
                    </div>

                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
