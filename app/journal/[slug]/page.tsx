import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BLOG_POSTS } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import SocialShare from '@/components/SocialShare';

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
                    url: `https://urbanclay.in/api/og?slug=${slug}&type=article`,
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
        <div className="bg-white min-h-screen">
            <Header />

            <article className="pt-32 pb-24">
                {/* Clean Header */}
                <div className="max-w-4xl mx-auto px-6 mb-20">
                    {/* Category */}
                    <div className="text-center mb-8">
                        <span className="inline-block px-4 py-1.5 bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-xs font-bold uppercase tracking-wider rounded-full">
                            {post.category}
                        </span>
                    </div>

                    {/* Title - Clean & Large */}
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2A1E16] leading-tight mb-8 text-center">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-10 text-center max-w-3xl mx-auto">
                        {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-8">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>

                    {/* Social Share */}
                    <div className="flex justify-center">
                        <SocialShare
                            url={`https://urbanclay.in/journal/${slug}`}
                            title={post.title}
                            description={post.excerpt}
                        />
                    </div>
                </div>

                {/* Content - Clean & Readable */}
                <div className="max-w-3xl mx-auto px-6">
                    <div
                        className="
                            prose prose-lg md:prose-xl
                            prose-headings:font-serif prose-headings:text-[#2A1E16]
                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                            prose-strong:text-[#2A1E16] prose-strong:font-semibold
                            prose-a:text-[var(--terracotta)] prose-a:font-medium hover:prose-a:underline
                            prose-ul:my-6 prose-ol:my-6
                            prose-li:text-gray-700 prose-li:my-2
                            prose-li:marker:text-[var(--terracotta)]
                            prose-blockquote:border-l-4 prose-blockquote:border-[var(--terracotta)] 
                            prose-blockquote:pl-6 prose-blockquote:italic
                            prose-img:rounded-xl prose-img:shadow-lg
                            max-w-none
                        "
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Bottom Share */}
                    <div className="mt-16 pt-8 border-t border-gray-200">
                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                            <h3 className="text-xl font-serif text-[#2A1E16] mb-4">Enjoyed this article?</h3>
                            <p className="text-gray-600 mb-6">Share it with others who might find it helpful</p>
                            <div className="flex justify-center">
                                <SocialShare
                                    url={`https://urbanclay.in/journal/${slug}`}
                                    title={post.title}
                                    description={post.excerpt}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
                        <Link
                            href="/journal"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--terracotta)] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back to Journal</span>
                        </Link>

                        <Link
                            href="/#quote"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--terracotta)] text-white rounded-lg font-medium hover:bg-[#a85638] transition-all"
                        >
                            <span>Get Quote</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </article>

            {/* Simple CTA */}
            <section className="bg-[#2A1E16] py-20 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="font-serif text-3xl md:text-4xl mb-6">Ready to start your project?</h2>
                    <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                        Get expert advice and free samples for your terracotta project
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/#quote"
                            className="inline-block bg-[var(--terracotta)] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#a85638] transition-all"
                        >
                            Request Consultation
                        </Link>
                        <Link
                            href="/products"
                            className="inline-block bg-white/10 border border-white/20 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all"
                        >
                            View Products
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
