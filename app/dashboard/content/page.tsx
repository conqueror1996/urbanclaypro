
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createBlogDraft } from '@/app/actions/generate-blog';
import { publishBlog } from '@/app/actions/publish-blog';

export default function ContentEnginePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    // Draft Result State
    const [draftRequest, setDraftRequest] = useState<{
        success: boolean;
        id?: string;
        title?: string;
        excerpt?: string;
        slug?: string;
        error?: string
    } | null>(null);

    // Final Publish State
    const [publishedResult, setPublishedResult] = useState<{
        success: boolean;
        slug?: string;
        error?: string
    } | null>(null);

    async function handleGenerate(formData: FormData) {
        setIsLoading(true);
        setDraftRequest(null);
        setPublishedResult(null);

        try {
            const res = await createBlogDraft(formData);
            setDraftRequest(res);
        } catch (err) {
            setDraftRequest({ success: false, error: 'Network error or timed out' });
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePublish() {
        if (!draftRequest?.id) return;

        setIsPublishing(true);
        try {
            const res = await publishBlog(draftRequest.id);
            if (res.success) {
                setPublishedResult(res);
                setDraftRequest(null); // Clear draft view
            } else {
                alert('Publish failed: ' + (res as any).error);
            }
        } catch (err) {
            alert('Publish failed due to network error');
        } finally {
            setIsPublishing(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <header className="mb-10">
                <h1 className="text-3xl font-serif text-[#2A1E16] mb-2">UrbanClay Content Engine ✍️</h1>
                <p className="text-gray-500">
                    Use our AI to draft high-quality, SEO-optimized blog posts.
                    Review the draft before publishing to your website.
                </p>
            </header>

            {!draftRequest && !publishedResult && (
                <div className="bg-white rounded-2xl p-8 border border-[#e5e0d8] shadow-sm">
                    <form action={handleGenerate} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Topic / Keyword</label>
                            <input
                                name="topic"
                                type="text"
                                placeholder="e.g. Benefits of Terracotta Facades in Tropical Climate"
                                className="w-full text-lg p-4 bg-[#faf9f8] border border-gray-200 rounded-xl focus:border-[var(--terracotta)] outline-none transition-all placeholder:text-gray-300"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Target Audience</label>
                                <select name="audience" className="w-full p-4 bg-[#faf9f8] border border-gray-200 rounded-xl outline-none">
                                    <option value="Architects">Architects (Technical)</option>
                                    <option value="Homeowners">Homeowners (Inspirational)</option>
                                    <option value="Builders">Builders (Commercial)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tone</label>
                                <select name="tone" className="w-full p-4 bg-[#faf9f8] border border-gray-200 rounded-xl outline-none">
                                    <option value="Educational">Educational & Expert</option>
                                    <option value="Inspirational">Inspirational & Design</option>
                                    <option value="Technical">Technical & Specification</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-[#2A1E16] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#4a3525] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Drafting Content... (takes ~30s)</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Generate Draft</span>
                                        <span>✨</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* DRAFT REVIEW STATE */}
            {draftRequest && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 bg-white rounded-xl border p-8 shadow-lg ${draftRequest.success ? 'border-orange-100' : 'border-red-200'}`}
                >
                    {draftRequest.success ? (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Draft Ready</span>
                                <span className="text-gray-400 text-sm">Review before publishing</span>
                            </div>

                            <h2 className="text-2xl font-serif text-[#2A1E16] mb-4">{draftRequest.title}</h2>
                            <div className="p-6 bg-[#faf9f8] rounded-xl border border-[#e5e0d8] mb-8">
                                <p className="text-gray-600 leading-relaxed italic">
                                    &quot;{draftRequest.excerpt}&quot;
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    className="flex-1 py-4 bg-green-700 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-green-800 transition-all flex items-center justify-center gap-2"
                                >
                                    {isPublishing ? 'Publishing...' : 'Approve & Publish 🚀'}
                                </button>

                                <a
                                    href={`/studio/structure/journal;${draftRequest.id}`}
                                    target="_blank"
                                    className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-all text-center"
                                >
                                    Edit Full Draft
                                </a>

                                <button
                                    onClick={() => setDraftRequest(null)}
                                    className="px-6 py-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-bold text-red-800 mb-2">Generation Failed</h3>
                            <p className="text-red-700">{draftRequest.error}</p>
                            <button onClick={() => setDraftRequest(null)} className="mt-4 text-sm underline">Try Again</button>
                        </div>
                    )}
                </motion.div>
            )}

            {/* PUBLISHED SUCCESS STATE */}
            {publishedResult && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-10 bg-green-50 rounded-2xl border border-green-200 text-center"
                >
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                        🎉
                    </div>
                    <h3 className="text-2xl font-bold text-green-900 mb-2">Published Successfully!</h3>
                    <p className="text-green-800 mb-8 max-w-lg mx-auto">
                        Your blog post is now live and readable by the world. The SEO tags have been automatically optimized.
                    </p>

                    <div className="flex justify-center gap-4">
                        <a
                            href={`/journal/${publishedResult.slug}`}
                            target="_blank"
                            className="px-8 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20"
                        >
                            View Live Post
                        </a>
                        <button
                            onClick={() => setPublishedResult(null)}
                            className="px-8 py-3 bg-white text-green-800 border border-green-200 rounded-xl font-bold hover:bg-green-50 transition-colors"
                        >
                            Create Another
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
