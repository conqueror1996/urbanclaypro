import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Buy Terracotta Tiles in Delhi NCR | Free Samples & Delivery',
    description: 'Premium terracotta tiles, clay bricks & jaali panels in Delhi NCR. Handmade, wirecut & pressed. Free samples. Fast delivery across Delhi, Gurgaon, Noida, Faridabad. ISO certified.',
    keywords: [
        'terracotta tiles Delhi',
        'clay tiles Delhi',
        'brick tiles Delhi NCR',
        'jaali panels Delhi',
        'tiles online Delhi',
        'terracotta tiles Gurgaon',
        'exposed brick tiles Noida',
        'buy tiles Delhi',
    ],
};

export default function DelhiPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-serif text-[#2A1E16] mb-6">
                            Premium Terracotta Tiles in <span className="text-[var(--terracotta)]">Delhi NCR</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Buy handcrafted terracotta tiles, clay bricks & jaali panels.
                            Free samples. Fast delivery across Delhi, Gurgaon, Noida & Faridabad.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-6 bg-[var(--sand)] rounded-2xl">
                            <div className="text-4xl mb-2">🚚</div>
                            <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
                            <p className="text-sm text-gray-600">Across Delhi NCR</p>
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
                        <h2 className="text-3xl font-serif text-center mb-12">Our Products in Delhi NCR</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            <Link href="/products?category=Exposed Brick" className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                                    <div className="h-48 bg-gradient-to-br from-[#b45a3c] to-[#96472d]"></div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-serif mb-2 group-hover:text-[var(--terracotta)]">Exposed Bricks</h3>
                                        <p className="text-sm text-gray-600 mb-4">Wirecut, handmade & pressed bricks for facades</p>
                                        <span className="text-sm font-bold text-[var(--terracotta)]">View Collection →</span>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/products?category=Brick Tiles" className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                                    <div className="h-48 bg-gradient-to-br from-[#8c7b70] to-[#5d554f]"></div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-serif mb-2 group-hover:text-[var(--terracotta)]">Brick Tiles</h3>
                                        <p className="text-sm text-gray-600 mb-4">Thin cladding veneers for walls</p>
                                        <span className="text-sm font-bold text-[var(--terracotta)]">View Collection →</span>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/products?category=Jaali" className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                                    <div className="h-48 bg-gradient-to-br from-[#d6cbb8] to-[#bfae96]"></div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-serif mb-2 group-hover:text-[var(--terracotta)]">Jaali Panels</h3>
                                        <p className="text-sm text-gray-600 mb-4">Decorative terracotta screens</p>
                                        <span className="text-sm font-bold text-[var(--terracotta)]">View Collection →</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <h2 className="text-3xl font-serif text-center mb-12">We Deliver Across Delhi NCR</h2>

                    <div className="grid md:grid-cols-4 gap-4 text-center">
                        {[
                            'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi',
                            'Gurgaon', 'Noida', 'Greater Noida', 'Faridabad',
                            'Ghaziabad', 'Dwarka', 'Rohini', 'Vasant Kunj',
                            'Saket', 'Hauz Khas', 'Connaught Place', 'Nehru Place'
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
                            Order free samples or speak with our Delhi NCR team today
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
