'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBlogDraft } from '@/app/actions/generate-blog';
import { publishBlog } from '@/app/actions/publish-blog';
import { getHomePageData } from '@/lib/products';
import { updateHomePageFirms } from '@/app/actions/manage-home';
import { Plus, Trash2, Save, Sparkles, Home } from 'lucide-react';

export default function ContentEnginePage() {
    const [activeTab, setActiveTab] = useState<'blog' | 'home'>('blog');
    const [isLoading, setIsLoading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    // Homepage Management State
    const [firms, setFirms] = useState<{ name: string }[]>([]);
    const [isSavingHome, setIsSavingHome] = useState(false);

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

    // Load Homepage Data
    useEffect(() => {
        const loadHomeData = async () => {
            const data = await getHomePageData();
            if (data?.trustedFirms) {
                setFirms(data.trustedFirms);
            }
        };
        loadHomeData();
    }, []);

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

    const handleSaveFirms = async () => {
        setIsSavingHome(true);
        try {
            const res = await updateHomePageFirms(firms);
            if (res.success) {
                alert('Homepage firms updated successfully!');
            } else {
                alert('Failed to update firms: ' + res.error);
            }
        } catch (err) {
            alert('Error updating firms');
        } finally {
            setIsSavingHome(false);
        }
    };

    const addFirm = () => setFirms([...firms, { name: '' }]);
    const removeFirm = (index: number) => setFirms(firms.filter((_, i) => i !== index));
    const updateFirm = (index: number, name: string) => {
        const newFirms = [...firms];
        newFirms[index].name = name;
        setFirms(newFirms);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <header className="mb-10">
                <h1 className="text-3xl font-serif text-[#2A1E16] mb-2">UrbanClay Content Engine ✍️</h1>
                <p className="text-gray-500">
                    Manage your website content, from AI-generated blogs to homepage technical authority assets.
                </p>
            </header>

            {/* TAB SYSTEM */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('blog')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'blog' ? 'bg-[#2A1E16] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'}`}
                >
                    <Sparkles size={14} />
                    Blog AI
                </button>
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'home' ? 'bg-[#2A1E16] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'}`}
                >
                    <Home size={14} />
                    Homepage Assets
                </button>
            </div>

            {activeTab === 'blog' ? (
                <>
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
                </>
            ) : (
                <div className="bg-white rounded-2xl p-8 border border-[#e5e0d8] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-serif text-[#2A1E16]">Trusted Architect Firms</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage the rolling ticker on the homepage.</p>
                        </div>
                        <button
                            onClick={addFirm}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--terracotta)] hover:text-[#2A1E16] transition-colors"
                        >
                            <Plus size={16} />
                            Add Firm
                        </button>
                    </div>

                    <div className="space-y-4 mb-10">
                        {firms.map((firm, idx) => (
                            <div key={idx} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-2 duration-200" style={{ animationDelay: `${idx * 50}ms` }}>
                                <div className="flex-1 bg-[#faf9f8] p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase w-4">{idx + 1}</span>
                                    <input
                                        type="text"
                                        value={firm.name}
                                        onChange={(e) => updateFirm(idx, e.target.value)}
                                        placeholder="Firm Name (e.g. Morphogenesis)"
                                        className="flex-1 bg-transparent outline-none text-[var(--ink)] font-medium placeholder:text-gray-300"
                                    />
                                </div>
                                <button
                                    onClick={() => removeFirm(idx)}
                                    className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}

                        {firms.length === 0 && (
                            <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
                                <p className="text-gray-400 text-sm">No firms added yet.</p>
                                <button onClick={addFirm} className="mt-2 text-[var(--terracotta)] font-bold text-xs uppercase tracking-widest">Add First Firm</button>
                            </div>
                        )}
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleSaveFirms}
                            disabled={isSavingHome}
                            className="px-10 py-4 bg-[#2A1E16] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#4a3525] transition-all disabled:opacity-50 flex items-center gap-3"
                        >
                            {isSavingHome ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save Homepage Assets</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
