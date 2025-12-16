import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BLOG_POSTS } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) return { title: 'Article Not Found' };

    return {
        title: `${post.title} | The Clay Journal`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            url: `https://urbanclay.in/journal/${slug}`,
            images: [
                {
                    url: `https://urbanclay.in/api/og?slug=${slug}&type=article`, // We can reuse or upgrade the OG generator later
                    width: 1200,
                    height: 630,
                    alt: post.title
                }
            ]
        }
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) notFound();

    return (
        <div className="bg-[#FAF7F3] min-h-screen">
            <Header />

            <article className="pt-32 pb-24">
                {/* Header */}
                <div className="max-w-3xl mx-auto px-6 mb-16 text-center">
                    <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
                        <span className="text-[var(--terracotta)]">{post.category}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                    </div>
                    <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#2A1E16] leading-tight mb-8">
                        {post.title}
                    </h1>
                    <p className="text-xl text-gray-600 italic leading-relaxed">
                        {post.excerpt}
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-6">
                    <div
                        className="prose prose-lg prose-headings:font-serif prose-headings:text-[#2A1E16] prose-p:text-gray-600 prose-a:text-[var(--terracotta)] prose-strong:text-[#2A1E16] hover:prose-a:text-[#2A1E16] transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-16 pt-12 border-t border-gray-200">
                        <Link href="/journal" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-[var(--terracotta)] hover:text-[#2A1E16] transition-colors">
                            ← Back to Journal
                        </Link>
                    </div>
                </div>
            </article>

            {/* CTA */}
            <section className="bg-[var(--terracotta)] py-20 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="font-serif text-3xl md:text-4xl mb-6">Inspired to build with clay?</h2>
                    <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                        Whether you need technical advice on exposed brick masonry or want to see samples of our jaali, our team is here to help.
                    </p>
                    <Link href="/#quote" className="inline-block bg-white text-[var(--terracotta)] px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#2A1E16] hover:text-white transition-all shadow-xl">
                        Request Consultation
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
