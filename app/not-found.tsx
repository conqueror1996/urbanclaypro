import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--sand)] flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
                <div className="w-24 h-24 bg-[var(--terracotta)] rounded-2xl mb-8 flex items-center justify-center shadow-xl shadow-orange-900/10 rotate-3 hover:rotate-6 transition-transform duration-500">
                    <span className="text-5xl text-white font-serif font-bold">404</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#2A1E16] mb-6">Page Not Found</h2>
                <p className="text-[#5d554f] max-w-md mb-10 text-lg leading-relaxed">
                    The page you are looking for might have been moved, deleted, or possibly never existed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/"
                        className="px-8 py-3.5 bg-[var(--ink)] text-white rounded-full font-medium hover:bg-[#4a3e36] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/products"
                        className="px-8 py-3.5 bg-white text-[var(--ink)] border border-[var(--line)] rounded-full font-medium hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition-all"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
