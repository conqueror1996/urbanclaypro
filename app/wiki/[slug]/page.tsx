
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WikiTOC from '@/components/WikiTOC';

// Cache for 1 hour
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const articles = await client.fetch(`*[_type == "wikiArticle"]{ "slug": slug.current }`);
    return articles;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const article = await client.fetch(`
        *[_type == "wikiArticle" && slug.current == $slug][0]{
            title,
            summary,
            "slug": slug.current
        }
    `, { slug });

    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | UrbanClay Technical`,
        description: article.summary,
        openGraph: {
            title: article.title,
            description: article.summary,
            type: 'article',
            url: `https://claytile.in/wiki/${slug}`,
        }
    };
}

// Utility to generate IDs for headings
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

const ptComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) return null;
            return (
                <figure className="my-10 group">
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                        <img
                            src={urlForImage(value).width(1000).url()}
                            alt={value.alt || 'Technical Illustration'}
                            className="w-full h-auto object-contain max-h-[500px]"
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="text-center text-sm text-gray-500 mt-3 font-medium">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
        infoBox: ({ value }: any) => {
            const styles = {
                Tip: 'bg-emerald-50 border-emerald-200 text-emerald-900',
                Warning: 'bg-amber-50 border-amber-200 text-amber-900',
                Note: 'bg-blue-50 border-blue-200 text-blue-900'
            };
            const icons = {
                Tip: '💡',
                Warning: '⚠️',
                Note: 'ℹ️'
            };
            const type = value.type || 'Note';
            // @ts-ignore
            const styleClass = styles[type] || styles.Note;
            // @ts-ignore
            const icon = icons[type] || 'ℹ️';

            return (
                <div className={`p-6 my-8 rounded-lg border flex gap-4 ${styleClass}`}>
                    <div className="text-2xl select-none">{icon}</div>
                    <div className="flex-1">
                        <strong className="block font-bold mb-1 uppercase text-xs tracking-wider opacity-70">{type}</strong>
                        <div className="text-sm md:text-base leading-relaxed">{value.text}</div>
                    </div>
                </div>
            );
        }
    },
    block: {
        h2: ({ children, value }: any) => {
            const id = slugify(value.children[0].text);
            return (
                <h2 id={id} className="scroll-mt-32 text-2xl md:text-3xl font-serif text-[#2A1E16] mt-16 mb-6 border-b border-gray-100 pb-2">
                    {children}
                </h2>
            );
        },
        h3: ({ children, value }: any) => {
            const id = slugify(value.children[0].text);
            return (
                <h3 id={id} className="scroll-mt-32 text-xl md:text-2xl font-serif text-[#2A1E16] mt-10 mb-4">
                    {children}
                </h3>
            );
        },
        normal: ({ children }: any) => (
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                {children}
            </p>
        ),
    },
    list: {
        bullet: ({ children }: any) => <ul className="my-6 space-y-2 list-none pl-4">{children}</ul>,
        number: ({ children }: any) => <ol className="my-6 space-y-2 list-decimal pl-6 text-gray-700">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }: any) => (
            <li className="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-[var(--terracotta)] before:rounded-full text-gray-700">
                {children}
            </li>
        ),
    }
}

import JsonLd from '@/components/JsonLd';

export default async function WikiArticlePage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch full article with relations
    const article = await client.fetch(`
        *[_type == "wikiArticle" && slug.current == $slug][0]{
            title,
            summary,
            category,
            difficulty,
            content,
            _updatedAt,
            _createdAt,
            relatedProducts[]->{
                title,
                "slug": slug.current,
                "image": images[0]
            },
            relatedDownloads[]->{
                title,
                "url": file.asset->url,
                size
            }
        }
    `, { slug });

    if (!article) notFound();

    // EXTRACT HEADINGS FOR TOC
    const headings = (article.content || [])
        .filter((block: any) => block._type === 'block' && ['h2', 'h3'].includes(block.style))
        .map((block: any) => ({
            id: slugify(block.children[0].text),
            text: block.children[0].text,
            level: block.style
        }));

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: article.title,
        description: article.summary,
        image: article.relatedProducts?.[0]?.image ? urlForImage(article.relatedProducts[0].image).url() : 'https://claytile.in/og-image.png',
        datePublished: article._createdAt,
        dateModified: article._updatedAt,
        author: {
            '@type': 'Organization',
            name: 'UrbanClay'
        },
        proficiencyLevel: article.difficulty
    };

    return (
        <div className="min-h-screen bg-white">
            <JsonLd data={jsonLd} />
            <Header />

            <main className="pt-32 pb-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <div className="flex items-center text-xs md:text-sm text-gray-400 mb-8 border-b border-gray-100 pb-4">
                    <Link href="/wiki" className="hover:text-[var(--terracotta)] font-medium">Wiki</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/wiki?category=${article.category}`} className="hover:text-[var(--terracotta)] capitalize">{article.category}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate max-w-[300px] border-b border-dotted border-gray-300">{article.title}</span>
                </div>

                {/* 3-COLUMN ROBUST LAYOUT */}
                <div className="grid lg:grid-cols-[240px_1fr_300px] gap-8 lg:gap-16">

                    {/* COL 1: TABLE OF CONTENTS (Desktop Sticky) */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32">
                            <WikiTOC headings={headings} />
                        </div>
                    </aside>

                    {/* COL 2: MAIN CONTENT */}
                    <article className="min-w-0">
                        <header className="mb-10">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                                    ${article.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                        article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'}`}>
                                    {article.difficulty} Level
                                </span>
                                <span className="text-xs text-gray-400 font-mono">
                                    Last Updated: {new Date(article._updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-serif text-[#2A1E16] mb-6 leading-[1.15]">
                                {article.title}
                            </h1>
                            <p className="text-xl text-gray-500 font-light leading-relaxed border-l-4 border-[var(--terracotta)] pl-6 py-1">
                                {article.summary}
                            </p>
                        </header>

                        <div className="prose prose-lg matches-prose max-w-none prose-headings:font-serif prose-headings:text-[#2A1E16] prose-a:text-[var(--terracotta)] prose-img:rounded-xl">
                            <PortableText value={article.content} components={ptComponents} />
                        </div>
                    </article>

                    {/* COL 3: RESOURCES & RELATED (Right Sticky) */}
                    <aside className="space-y-8">
                        <div className="sticky top-32 space-y-8">

                            {/* Download Box */}
                            <div className="bg-[#faf9f6]/80 backdrop-blur rounded-xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="font-serif text-lg text-[#2A1E16] mb-4 flex items-center gap-2">
                                    <span>📥</span> Downloads
                                </h3>

                                {article.relatedDownloads && article.relatedDownloads.length > 0 ? (
                                    <ul className="space-y-3">
                                        {article.relatedDownloads.map((doc: any, i: number) => (
                                            <li key={i}>
                                                <a href={doc.url} target="_blank" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[var(--terracotta)] hover:shadow-md transition-all group">
                                                    <div className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded text-xs font-bold">PDF</div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 group-hover:text-[var(--terracotta)] truncate">{doc.title}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{doc.size}</div>
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No downloadable assets available.</p>
                                )}
                            </div>

                            {/* Related Products */}
                            {article.relatedProducts && article.relatedProducts.length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                    <h3 className="font-serif text-lg text-[#2A1E16] mb-4">Related Materials</h3>
                                    <div className="space-y-4">
                                        {article.relatedProducts.map((prod: any, i: number) => (
                                            <Link key={i} href={`/products/collection/${prod.slug}`} className="flex gap-4 group">
                                                <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                                                    {prod.image && <img src={urlForImage(prod.image).width(200).url()} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[var(--terracotta)] leading-tight mb-1">{prod.title}</h4>
                                                    <span className="text-xs text-gray-400 group-hover:underline">View Specs →</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ask an Expert */}
                            <div className="bg-[var(--terracotta)]/5 rounded-xl p-6 border border-[var(--terracotta)]/10 text-center">
                                <h3 className="font-serif text-lg text-[#2A1E16] mb-2">Need Technical Help?</h3>
                                <p className="text-sm text-gray-600 mb-4">Our engineers can assist with custom specs and installation queries.</p>
                                <Link href="/contact" className="inline-block bg-white text-[var(--terracotta)] border border-[var(--terracotta)] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[var(--terracotta)] hover:text-white transition-colors">
                                    Contact Support
                                </Link>
                            </div>

                        </div>
                    </aside>

                </div>
            </main>
            <Footer />
        </div>
    );
}

