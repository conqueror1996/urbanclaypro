'use client';

import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { updateCollectionSeo } from '@/app/actions/seo';
import { calculateSeoScore } from '@/lib/seo-utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SeoManagerPage() {
    const [collections, setCollections] = useState<any[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State (Only valid when selectedDoc is present)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });

    useEffect(() => {
        const fetchCollections = async () => {
            const query = `*[_type == "collection"] | order(title asc) {
                _id,
                title,
                slug,
                description,
                seo
            }`;
            const docs = await client.fetch(query);
            setCollections(docs);
            setLoading(false);
        };
        fetchCollections();
    }, []);

    const handleEdit = (doc: any) => {
        setSelectedDoc(doc);
        setFormData({
            title: doc.title || '',
            description: doc.description || '',
            metaTitle: doc.seo?.metaTitle || '',
            metaDescription: doc.seo?.metaDescription || '',
            keywords: (doc.seo?.keywords || []).join(', ')
        });
    };

    const handleSave = async () => {
        if (!selectedDoc) return;
        setSaving(true);

        const payload = {
            ...formData,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
        };

        const result = await updateCollectionSeo(selectedDoc._id, payload);

        if (result.success) {
            // Update local grid immediately
            setCollections(prev => prev.map(c => c._id === selectedDoc._id ? {
                ...c,
                title: formData.title,
                description: formData.description,
                seo: {
                    metaTitle: formData.metaTitle,
                    metaDescription: formData.metaDescription,
                    keywords: payload.keywords
                }
            } : c));
            setSelectedDoc(null); // Close editor on success
        } else {
            alert('Failed to save: ' + result.error);
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-8 h-8 border-4 border-[var(--terracotta)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Calculate score for the active editor or the grid item
    const getScore = (title: string, desc: string, keys: string[]) => {
        const mainKey = keys[0] || '';
        return calculateSeoScore(title, desc, mainKey);
    };

    return (
        <div className="min-h-screen bg-[#Fdfdfd] p-8 text-[var(--ink)]">
            {/* Header */}
            <header className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/dashboard" className="text-gray-400 hover:text-[var(--terracotta)] transition-colors text-sm">
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl font-serif font-medium">SEO Control Center</h1>
                    <p className="text-gray-500 mt-1">Manage search appearance for your {collections.length} key collections.</p>
                </div>
            </header>

            {/* View Switching: Grid vs Editor */}
            <AnimatePresence mode="wait">
                {!selectedDoc ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {collections.map(doc => {
                            const { score } = getScore(
                                doc.seo?.metaTitle || doc.title,
                                doc.seo?.metaDescription || doc.description,
                                doc.seo?.keywords || []
                            );

                            return (
                                <div
                                    key={doc._id}
                                    onClick={() => handleEdit(doc)}
                                    className="group bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:border-[var(--terracotta)]/30 hover:shadow-lg hover:shadow-orange-900/5 transition-all relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-[var(--terracotta)] transition-colors">{doc.title}</h3>
                                            <code className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">/products/{doc.slug?.current}</code>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 ${score > 80 ? 'border-emerald-100 text-emerald-600' :
                                                score > 50 ? 'border-orange-100 text-orange-600' : 'border-red-100 text-red-600'
                                            }`}>
                                            {score}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                        {doc.seo?.metaDescription || doc.description || 'No description set.'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div style={{ width: `${score}%` }} className={`h-full rounded-full ${score > 80 ? 'bg-emerald-500' :
                                                    score > 50 ? 'bg-orange-400' : 'bg-red-400'
                                                }`} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-[var(--terracotta)] opacity-0 group-hover:opacity-100 transition-opacity">Edit →</span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* New Collection Placeholder info - redirect to Sanity */}
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center text-gray-400 hover:border-gray-300 transition-colors">
                            <span className="text-2xl mb-2">✨</span>
                            <p className="text-sm">Create new collections in<br /><a href="/studio" target="_blank" className="underline hover:text-[var(--terracotta)]">Sanity Studio</a></p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]"
                    >
                        {/* LEFT: PREVIEW & ASSISTANT */}
                        <div className="w-full md:w-5/12 bg-gray-50 p-8 border-r border-gray-100 flex flex-col">
                            <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-900 self-start mb-8 flex items-center gap-2 text-sm font-bold">
                                ← Close Editor
                            </button>

                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Live Preview</h3>

                            {/* Google Card */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[8px] text-gray-500">UC</div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-900">UrbanClay</span>
                                        <span className="text-[9px] text-gray-500">https://claytile.in › products › {selectedDoc.slug?.current}</span>
                                    </div>
                                </div>
                                <h4 className="text-[#1a0dab] text-lg hover:underline cursor-pointer truncate font-medium mb-1">
                                    {formData.metaTitle || formData.title || 'Untitled Page'}
                                </h4>
                                <p className="text-sm text-[#4d5156] leading-snug line-clamp-2">
                                    <span className="text-gray-400">{new Date().toLocaleDateString()} — </span>
                                    {formData.metaDescription || formData.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Score Card */}
                            {(() => {
                                const { score, tips } = getScore(
                                    formData.metaTitle || formData.title,
                                    formData.metaDescription || formData.description,
                                    formData.keywords.split(',').map(s => s.trim())
                                );
                                return (
                                    <div className={`p-5 rounded-xl border ${score > 80 ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-200'}`}>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-bold text-sm">Optimization Score</span>
                                            <span className={`text-xl font-bold ${score > 80 ? 'text-emerald-600' : 'text-orange-500'}`}>{score}/100</span>
                                        </div>
                                        <div className="space-y-2">
                                            {tips.length === 0 ? (
                                                <p className="text-xs text-emerald-600 flex items-center gap-2">✅ content is perfectly optimized!</p>
                                            ) : (
                                                tips.map((tip, i) => (
                                                    <p key={i} className="text-xs text-orange-600 flex items-start gap-2">
                                                        <span>⚠️</span> {tip}
                                                    </p>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* RIGHT: EDIT FORM */}
                        <div className="w-full md:w-7/12 p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">Edit Content</h2>
                                    <p className="text-sm text-gray-400">Make changes to improve search ranking.</p>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-[var(--ink)] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                                >
                                    {saving ? 'Saving...' : 'Save Updates'}
                                </button>
                            </div>

                            <div className="space-y-6 max-w-xl">
                                {/* Section: Core */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Page Title (H1)</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all font-serif text-lg"
                                            placeholder="e.g. Exposed Bricks"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Short Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            rows={2}
                                            className="w-full p-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all text-sm"
                                            placeholder="Brief overview of this collection..."
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 my-6" />

                                {/* Section: Google */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-xs font-bold uppercase text-blue-600">Google Link Title</label>
                                            <span className={`text-[10px] ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {formData.metaTitle.length}/60
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.metaTitle}
                                            onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-blue-800 placeholder-blue-800/30"
                                            placeholder={formData.title}
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-xs font-bold uppercase text-gray-500">Google Snippet (Meta Desc)</label>
                                            <span className={`text-[10px] ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {formData.metaDescription.length}/160
                                            </span>
                                        </div>
                                        <textarea
                                            value={formData.metaDescription}
                                            onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                            rows={3}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] transition-all text-sm text-gray-600"
                                            placeholder={formData.description}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Focus Keywords (Comma Sep)</label>
                                        <input
                                            type="text"
                                            value={formData.keywords}
                                            onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                            className="w-full p-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-[var(--terracotta)] focus:ring-0 transition-all text-sm"
                                            placeholder="e.g. exposed bricks, red clay bricks"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
