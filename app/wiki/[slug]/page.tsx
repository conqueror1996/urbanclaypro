
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

    // Minimal fetch for metadata
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

const ptComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) return null;
            return (
                <figure className="my-10 group">
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                        <img
                            src={urlForImage(value).width(1000).url()}
                            alt={value.alt || 'Technical Illustration'}
                            className="w-full h-auto object-contain max-h-[500px]"
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="text-center text-sm text-gray-400 mt-3 italic">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
        infoBox: ({ value }: any) => {
            const styles = {
                Tip: 'bg-green-50 border-green-200 text-green-800',
                Warning: 'bg-red-50 border-red-200 text-red-800',
                Note: 'bg-blue-50 border-blue-200 text-blue-800'
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
                    <div>
                        <strong className="block font-bold mb-1 uppercase text-xs tracking-wider opacity-70">{type}</strong>
                        <p className="text-sm md:text-base leading-relaxed">{value.text}</p>
                    </div>
                </div>
            );
        }
    },
    block: {
        h2: ({ children }: any) => (
            <h2 className="text-2xl md:text-3xl font-serif text-[#2A1E16] mt-12 mb-6 border-b border-gray-100 pb-2">
                {children}
            </h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-xl md:text-2xl font-serif text-[#2A1E16] mt-8 mb-4">
                {children}
            </h3>
        ),
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

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-400 mb-8">
                    <Link href="/wiki" className="hover:text-[var(--terracotta)]">Wiki</Link>
                    <span className="mx-2">/</span>
                    <span className="capitalize">{article.category}</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate max-w-[200px]">{article.title}</span>
                </div>

                <div className="grid lg:grid-cols-[1fr_350px] gap-12">

                    {/* Main Content */}
                    <article>
                        <header className="mb-10">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 
                                ${article.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                    article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'}`}>
                                {article.difficulty} Level
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif text-[#2A1E16] mb-6 leading-tight">
                                {article.title}
                            </h1>
                            <p className="text-xl text-gray-500 font-light leading-relaxed border-l-4 border-[var(--terracotta)] pl-6">
                                {article.summary}
                            </p>
                        </header>

                        <div className="prose prose-lg max-w-none">
                            <PortableText value={article.content} components={ptComponents} />
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-8">

                        {/* Download Box */}
                        <div className="bg-[#faf9f6] p-6 rounded-xl border border-gray-100 sticky top-32">
                            <h3 className="font-serif text-lg text-[#2A1E16] mb-4">Resources</h3>

                            {article.relatedDownloads && article.relatedDownloads.length > 0 ? (
                                <ul className="space-y-3">
                                    {article.relatedDownloads.map((doc: any, i: number) => (
                                        <li key={i}>
                                            <a href={doc.url} target="_blank" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[var(--terracotta)] transition-colors group">
                                                <span className="text-2xl">📄</span>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-[var(--terracotta)]">{doc.title}</div>
                                                    <div className="text-xs text-gray-400">{doc.size} • PDF</div>
                                                </div>
                                                <span className="text-gray-300">⬇</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 mb-4">No specific downloads for this article.</p>
                            )}

                            <hr className="my-6 border-gray-200" />

                            <h3 className="font-serif text-lg text-[#2A1E16] mb-4">Related Products</h3>
                            {article.relatedProducts && article.relatedProducts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {article.relatedProducts.map((prod: any, i: number) => (
                                        <Link key={i} href={`/products/collection/${prod.slug}`} className="flex items-center gap-3 group">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                {prod.image && <img src={urlForImage(prod.image).width(100).url()} className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 group-hover:text-[var(--terracotta)] transition-colors">{prod.title}</div>
                                                <div className="text-xs text-gray-500">View Product →</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Link href="/products" className="text-sm text-[var(--terracotta)] underline">Browse Catalog</Link>
                            )}

                        </div>
                    </aside>

                </div>
            </main>
            <Footer />
        </div>
    );
}
