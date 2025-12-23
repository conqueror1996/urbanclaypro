import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProducts } from '@/lib/products';

export const metadata: Metadata = {
    title: 'Buy Terracotta Tiles in Pune | Free Samples & Delivery',
    description: 'Premium terracotta tiles, clay bricks & jaali panels in Pune. Handmade, wirecut & pressed. Free samples. Fast delivery across Pune & Pimpri-Chinchwad. ISO certified.',
    keywords: [
        'terracotta tiles Pune',
        'clay tiles Pune',
        'brick tiles Pune',
        'jaali panels Pune',
        'tiles online Pune',
        'exposed brick tiles Pune',
        'buy tiles Pune',
        'terracotta cladding Pune',
        'terracotta facade Pune',
        'clay roof tiles Pune',
        'brick veneer Pune',
        'architectural tiles Pune',
    ],
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function PunePage() {
    const products = await getProducts();

    const featuredCategories = [
        {
            title: 'Exposed Bricks', // Corrected: Plural
            displayTitle: 'Exposed Bricks',
            keyword: 'Wirecut',
            description: 'Wirecut, handmade & pressed bricks for facades'
        },
        {
            title: 'Brick Wall Tiles', // Corrected: "Brick Wall Tiles"
            displayTitle: 'Brick Tiles',
            keyword: 'Cladding',
            description: 'Thin cladding veneers for walls'
        },
        {
            title: 'Cement Jali', // Corrected: "Cement Jali" (closest match found)
            displayTitle: 'Jaali Panels',
            keyword: 'Jali',
            description: 'Decorative terracotta & cement screens'
        }
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': 'UrbanClay Pune',
        'image': 'https://urbanclay.in/og-image.png',
        '@id': 'https://urbanclay.in/pune',
        'url': 'https://urbanclay.in/pune',
        'telephone': '+918080081951',
        'priceRange': '₹₹',
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Pune',
            'addressLocality': 'Pune',
            'addressRegion': 'Maharashtra',
            'postalCode': '411001',
            'addressCountry': 'IN'
        },
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 18.5204,
            'longitude': 73.8567
        },
        'openingHoursSpecification': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],
            'opens': '09:00',
            'closes': '19:00'
        },
        'sameAs': [
            'https://www.instagram.com/urbanclay',
            'https://www.facebook.com/urbanclay'
        ],
        'areaServed': [
            'Pune',
            'Pimpri-Chinchwad',
            'Kothrud',
            'Viman Nagar',
            'Hinjewadi'
        ]
    };

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />

            <main className="pt-32 pb-20">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-serif text-[#2A1E16] mb-6">
                            Premium Terracotta Tiles in <span className="text-[var(--terracotta)]">Pune</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Buy handcrafted terracotta tiles, clay bricks & jaali panels.
                            Free samples. Fast delivery across Pune & Pimpri-Chinchwad.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-6 bg-[var(--sand)] rounded-2xl">
                            <div className="text-4xl mb-2">🚚</div>
                            <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
                            <p className="text-sm text-gray-600">Across Pune</p>
                        </div>
                        <div className="text-center p-6 bg-[var(--sand)] rounded-2xl">
                            <div className="text-4xl mb-2">📦</div>
                            <h3 className="font-bold text-lg mb-2">Free Samples</h3>
                            <p className="text-sm text-gray-600">Order up to 5 samples free</p>
                        </div>
                        <div className="text-center p-6 bg-[var(--sand)] rounded-2xl">
                            <div className="text-4xl mb-2">✓</div>
                            <h3 className="font-bold text-lg mb-2">ISO Certified</h3>
                            <p className="text-sm text-gray-600">Premium quality guaranteed</p>
                        </div>
                    </div>
                </section>

                <section className="bg-gray-50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-serif text-center mb-12">Our Products in Pune</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Dynamically Filtered Products */}
                            {featuredCategories.map((cat) => {
                                // Find a representative product for this category
                                const product = products.find(p => p.category?.title === cat.title || p.tag === cat.title || p.title.includes(cat.keyword));
                                if (!product) return null;

                                return (
                                    <Link key={cat.title} href={`/products?category=${encodeURIComponent(cat.title)}`} className="group">
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="text-xl font-serif mb-2 group-hover:text-[var(--terracotta)]">{cat.displayTitle}</h3>
                                                <p className="text-sm text-gray-600 mb-4 flex-1">{cat.description}</p>
                                                <span className="text-sm font-bold text-[var(--terracotta)]">View Collection →</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <h2 className="text-3xl font-serif text-center mb-12">We Deliver Across Pune</h2>

                    <div className="grid md:grid-cols-4 gap-4 text-center">
                        {[
                            'Koregaon Park', 'Viman Nagar', 'Hinjewadi', 'Wakad',
                            'Baner', 'Aundh', 'Kothrud', 'Karve Nagar',
                            'Pimpri-Chinchwad', 'Hadapsar', 'Magarpatta', 'Kharadi',
                            'Kalyani Nagar', 'Deccan', 'Shivajinagar', 'Camp'
                        ].map((area) => (
                            <div key={area} className="py-3 px-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                {area}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-[#2A1E16] text-white py-20">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-3xl font-serif mb-6">Ready to Transform Your Space?</h2>
                        <p className="text-xl mb-8 text-white/80">
                            Order free samples or speak with our Pune team today
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/#quote"
                                className="px-8 py-4 bg-[var(--terracotta)] text-white rounded-full font-bold hover:bg-[#a85638] transition-all"
                            >
                                Get Free Quote
                            </Link>
                            <a
                                href="tel:+918080081951"
                                className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-[#2A1E16] transition-all"
                            >
                                Call: +91 80800 81951
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
