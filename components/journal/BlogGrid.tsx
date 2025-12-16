import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function BlogGrid() {
    return (
        <section className="py-24 bg-[#FAF7F3]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-[var(--terracotta)] font-bold uppercase tracking-widest text-sm mb-3">The Clay Journal</h2>
                    <h1 className="font-serif text-4xl md:text-5xl text-[#2A1E16]">Insights on Architecture</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/journal/${post.slug}`}
                            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-[#2A1E16]">
                                {/* Placeholder Gradient since we don't have real images yet */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-[#2A1E16] to-[#4a3e36] group-hover:scale-105 transition-transform duration-700 opacity-90`} />
                                <div className="absolute inset-0 flex items-center justify-center text-white/10 text-6xl font-serif font-bold">
                                    UC
                                </div>
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2A1E16] rounded-full">
                                    {post.category}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="text-xs text-[var(--terracotta)] font-bold mb-3">{post.date} • {post.readTime}</div>
                                <h3 className="font-serif text-xl md:text-2xl text-[#2A1E16] leading-tight mb-4 group-hover:text-[var(--terracotta)] transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto flex items-center text-xs font-bold uppercase tracking-wider text-[#2A1E16] group-hover:gap-3 transition-all">
                                    Read Article <span className="ml-2">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
