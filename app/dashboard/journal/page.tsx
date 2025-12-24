'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { deleteJournalEntry, createJournalEntry, uploadImage, generateAIImage } from './actions';
import Link from 'next/link';

interface JournalEntry {
    _id: string;
    title: string;
    publishedAt: string;
    excerpt: string;
    imageUrl?: string;
}

export default function JournalManagerPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // New Entry Form State
    const [newTitle, setNewTitle] = useState('');
    const [newExcerpt, setNewExcerpt] = useState('');
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

    // Image State
    const [imageId, setImageId] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageMode, setImageMode] = useState<'upload' | 'ai'>('upload');
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fetchJournals = async () => {
        setLoading(true);
        try {
            const query = `*[_type == "journal"] | order(publishedAt desc) { 
                _id, 
                title, 
                publishedAt, 
                excerpt, 
                "imageUrl": mainImage.asset->url 
            }`;
            const data = await client.fetch(query);
            setEntries(data);
        } catch (error) {
            console.error('Failed to fetch journals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

        const res = await deleteJournalEntry(id);
        if (res.success) {
            // Optimistic update or refetch
            setEntries(prev => prev.filter(e => e._id !== id));
            alert('Entry deleted.');
        } else {
            alert('Failed to delete: ' + res.error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle) return alert('Title is required');

        const res = await createJournalEntry({
            title: newTitle,
            excerpt: newExcerpt,
            date: newDate,
            imageId: imageId || undefined
        });

        if (res.success) {
            alert('Journal Entry Created! You can now edit the full content in the Content Studio.');
            setIsCreating(false);
            setNewTitle('');
            setNewExcerpt('');
            setImageId(null);
            setPreviewUrl(null);
            fetchJournals(); // Refetch to show new entry
        } else {
            alert('Failed to create: ' + res.error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await uploadImage(formData);
        if (res.success) {
            setImageId(res.assetId!);
            setPreviewUrl(res.imageUrl!);
        } else {
            alert('Upload failed');
        }
        setIsUploading(false);
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt) return alert("Please enter a prompt");
        setIsGenerating(true);
        const res = await generateAIImage(aiPrompt);
        if (res.success) {
            setImageId(res.assetId!);
            setPreviewUrl(res.imageUrl!);
            if ((res as any).isFallback) {
                alert("⚠️ Note: AI Generation Limit Reached (Billing). Using a high-quality fallback image instead.");
            }
        } else {
            alert('AI Generation failed: ' + res.error);
        }
        setIsGenerating(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-[var(--ink)]">Journal Manager</h2>
                    <p className="text-gray-500 mt-1">Curate your brand narratives and design stories.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/studio"
                        target="_blank"
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-black transition-colors flex items-center gap-2"
                    >
                        <span>Open Content Studio</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </Link>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-[var(--terracotta)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-orange-900/10 hover:bg-[#a85638] transition-colors"
                    >
                        + New Entry
                    </button>
                </div>
            </div>

            {/* CREATE FORM (CONDITIONAL) */}
            {isCreating && (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[var(--terracotta)]/20 mb-8 animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-bold text-[var(--ink)] mb-6">Write New Story</h3>
                    <form onSubmit={handleCreate} className="space-y-6">
                        {/* TITLE & DATE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/50 transition-all font-serif text-lg"
                                    placeholder="e.g. The Art of Terracotta..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Publish Date</label>
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* IMAGE SECTION */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Cover Image</label>

                            <div className="flex gap-4 mb-4">
                                <button type="button" onClick={() => setImageMode('upload')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${imageMode === 'upload' ? 'bg-white shadow-sm text-[var(--ink)]' : 'text-gray-400 hover:text-gray-600'}`}>Upload File</button>
                                <button type="button" onClick={() => setImageMode('ai')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${imageMode === 'ai' ? 'bg-white shadow-sm text-[var(--ink)]' : 'text-gray-400 hover:text-gray-600'}`}>Generate with AI</button>
                            </div>

                            {imageMode === 'upload' ? (
                                <div key="upload-mode" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors">
                                    <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" accept="image/*" />
                                    <label htmlFor="file-upload" className="cursor-pointer block">
                                        <span className="text-gray-500 font-medium">{isUploading ? 'Uploading...' : 'Click to select an image from your computer'}</span>
                                    </label>
                                </div>
                            ) : (
                                <div key="ai-mode" className="flex gap-2">
                                    <input
                                        type="text"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="Describe the image (e.g. 'A rustic terracotta facade in sunlight')"
                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--terracotta)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAiGenerate}
                                        disabled={isGenerating}
                                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {isGenerating ? 'Generating...' : 'Generate'}
                                    </button>
                                </div>
                            )}

                            {previewUrl && (
                                <div className="mt-4 relative group w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreviewUrl(null); setImageId(null); }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Excerpt (Short Summary)</label>
                            <textarea
                                value={newExcerpt}
                                onChange={(e) => setNewExcerpt(e.target.value)}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/50 transition-all font-sans"
                                placeholder="A brief preview of the article..."
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="submit" className="bg-[var(--terracotta)] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#a85638] transition-colors">
                                Create Draft
                            </button>
                            <button type="button" onClick={() => setIsCreating(false)} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* JOURNAL LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-400 font-medium uppercase text-[10px] tracking-widest font-sans">
                        <tr>
                            <th className="px-8 py-4">Article</th>
                            <th className="px-6 py-4">Published</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <tr key={entry._id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            {entry.imageUrl ? (
                                                <img src={entry.imageUrl} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" /></svg>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-[var(--ink)] font-serif text-lg">{entry.title}</h4>
                                                <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{entry.excerpt}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm text-gray-500 font-mono">
                                        {new Date(entry.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-6 text-xs text-gray-400 font-mono">
                                        /{entry.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)}...
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href="/studio"
                                                target="_blank"
                                                className="text-gray-400 hover:text-[var(--terracotta)] p-2 rounded-full hover:bg-orange-50 transition-colors"
                                                title="Edit in Studio"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(entry._id, entry.title)}
                                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-gray-400">
                                    No journal entries found. Start writing your first story.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
