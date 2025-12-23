
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getJournalPost } from '@/lib/journal';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import SocialShare from '@/components/SocialShare';
import { PortableText } from '@portabletext/react';
import { urlForImage } from '@/sanity/lib/image';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getJournalPost(slug);

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
                    url: post.mainImage || 'https://urbanclay.in/og-default.jpg',
                    width: 1200,
                    height: 630,
                    alt: post.title
                }
            ]
        }
    };
}

const ptComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) {
                return null;
            }
            return (
                <figure className="my-12 -mx-6 md:-mx-12 lg:-mx-24 group">
                    <div className="overflow-hidden rounded-xl shadow-2xl bg-gray-100">
                        <img
                            src={urlForImage(value).width(1200).url()}
                            alt={value.alt || 'UrbanClay Journal Image'}
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="text-center text-sm font-medium text-gray-500 mt-4 tracking-wide">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        }
    },
    block: {
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-[6px] border-[var(--terracotta)] pl-8 py-4 my-12 bg-[#faf7f5] rounded-r-2xl">
                <p className="text-2xl md:text-3xl font-serif italic text-[#2A1E16] leading-relaxed">
                    &ldquo;{children}&rdquo;
                </p>
            </blockquote>
        ),
        h2: ({ children }: any) => (
            <h2 className="text-3xl md:text-4xl font-serif text-[#2A1E16] mt-16 mb-6 leading-tight border-b border-[#2A1E16]/10 pb-4">
                {children}
            </h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-2xl md:text-3xl font-serif text-[#4a3525] mt-12 mb-4 leading-snug">
                {children}
            </h3>
        ),
        normal: ({ children }: any) => (
            <p className="text-lg md:text-xl text-gray-700 leading-8 mb-6 font-light antialiased first-of-type:first-letter:text-6xl first-of-type:first-letter:font-serif first-of-type:first-letter:text-[var(--terracotta)] first-of-type:first-letter:mr-3 first-of-type:first-letter:float-left first-of-type:first-letter:leading-[0.8]">
                {children}
            </p>
        ),
    },
    marks: {
        strong: ({ children }: any) => <strong className="font-semibold text-[#2A1E16]">{children}</strong>,
        link: ({ value, children }: any) => {
            const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
            return (
                <a href={value?.href} target={target} rel={target === '_blank' ? 'noindex nofollow' : undefined} className="text-[var(--terracotta)] underline decoration-[var(--terracotta)]/30 underline-offset-4 hover:decoration-[var(--terracotta)] transition-all">
                    {children}
                </a>
            )
        }
    }
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getJournalPost(slug);

    if (!post) notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'image': post.mainImage ? [post.mainImage] : undefined,
        'datePublished': post.date, // Assumes post.date is ISO formatted or close to it. If not, might need parsing.
        'author': {
            '@type': 'Organization',
            'name': 'UrbanClay'
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'UrbanClay',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://urbanclay.in/urbanclay-logo.png'
            }
        },
        'description': post.excerpt,
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://urbanclay.in/journal/${slug}`
        }
    };

    return (
        <div className="bg-[#fcfbf9] min-h-screen selection:bg-[var(--terracotta)] selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />

            <article className="pt-32 pb-24">
                {/* Immersive Header */}
                <div className="max-w-5xl mx-auto px-6 mb-20">
                    <div className="flex flex-col items-center text-center">
                        <span className="inline-block px-4 py-1.5 border border-[var(--terracotta)] text-[var(--terracotta)] text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-8">
                            {post.category}
                        </span>

                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#2A1E16] leading-[1.1] mb-8 tracking-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10 font-light">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-sm font-medium text-gray-400 uppercase tracking-widest border-t border-b border-gray-200 py-4 w-full justify-center max-w-md">
                            <span>{post.date}</span>
                            <span className="w-1 h-1 bg-[var(--terracotta)] rounded-full"></span>
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>

                {/* Hero Image - Cinematic */}
                {(post.mainImage || post.imageUrl) && (
                    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mb-20">
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                src={post.mainImage || post.imageUrl}
                                alt={post.title}
                                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-[2s] ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                )}

                {/* Content Column */}
                <div className="max-w-3xl mx-auto px-6">
                    <div className="prose prose-xl prose-stone max-w-none">
                        <PortableText value={post.body} components={ptComponents} />
                    </div>

                    {/* Editorial Divider */}
                    <div className="flex items-center justify-center my-20 opacity-30">
                        <div className="w-20 h-[1px] bg-[#2A1E16]"></div>
                        <div className="px-4 font-serif text-2xl text-[#2A1E16]">❦</div>
                        <div className="w-20 h-[1px] bg-[#2A1E16]"></div>
                    </div>

                    {/* Social Share */}
                    <div className="bg-white rounded-2xl p-10 shadow-lg border border-[#e5e0d8] text-center">
                        <h3 className="text-2xl font-serif text-[#2A1E16] mb-4">Share this story</h3>
                        <p className="text-gray-500 mb-8 font-light">Inspire others with sustainable architecture</p>
                        <div className="flex justify-center">
                            <SocialShare
                                url={`https://urbanclay.in/journal/${slug}`}
                                title={post.title}
                                description={post.excerpt}
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-16 flex items-center justify-between">
                        <Link
                            href="/journal"
                            className="group flex items-center gap-3 text-gray-500 hover:text-[var(--terracotta)] transition-colors"
                        >
                            <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[var(--terracotta)] transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </span>
                            <span className="font-medium tracking-wide text-sm uppercase">Back to Journal</span>
                        </Link>
                    </div>
                </div>
            </article>

            {/* Premium CTA */}
            <section className="relative py-28 overflow-hidden bg-[#2A1E16]">
                <div className="absolute inset-0 opacity-10">
                    <img src="/pattern-grid.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
                        Bring this aesthetic to your project.
                    </h2>
                    <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light">
                        Explore our curated collection of premium terracotta tiles and facades.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/#quote"
                            className="inline-flex items-center justify-center bg-[var(--terracotta)] text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#a85638] transition-all hover:scale-105 shadow-xl shadow-orange-900/30"
                        >
                            Request Samples
                        </Link>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center bg-transparent border border-white/20 text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                        >
                            View Catalogue
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
