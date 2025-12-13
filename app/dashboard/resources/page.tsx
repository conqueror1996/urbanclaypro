'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getResources, Resource } from '@/lib/products';
import { authenticatedFetch } from '@/lib/auth-utils';

type ViewMode = 'list' | 'create' | 'edit';

export default function ResourcesDashboardPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [resources, setResources] = useState<Resource[]>([]);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const data = await getResources();
            setResources(data);
            if (selectedResource) {
                const updated = data.find(r => r._id === selectedResource._id);
                if (updated) setSelectedResource(updated);
            }
        } catch (e) {
            console.error("Failed to load resources", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleDelete = async (resource: Resource) => {
        if (!confirm(`Are you sure you want to delete "${resource.title}"?`)) return;
        try {
            await authenticatedFetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'delete_document',
                    data: { id: resource._id }
                })
            });
            await refresh();
            setViewMode('list');
            setSelectedResource(null);
        } catch (e) { alert("Failed to delete"); }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex gap-8">
            {/* LEFT SIDEBAR: List */}
            <div className="w-1/3 bg-white rounded-3xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="font-bold text-[#1a1512] font-serif text-xl">Downloads</h2>
                    <button
                        onClick={() => { setSelectedResource(null); setViewMode('create'); }}
                        className="w-8 h-8 bg-[var(--terracotta)] text-white rounded-full flex items-center justify-center hover:bg-[#a85638] transition-colors shadow-lg shadow-orange-900/20"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100/80 animate-pulse rounded-2xl" />)}
                        </div>
                    ) : (
                        resources.map((res) => (
                            <div
                                key={res._id}
                                onClick={() => { setSelectedResource(res); setViewMode('edit'); }}
                                className={`group p-4 rounded-xl border transition-all cursor-pointer flex gap-4 items-center ${selectedResource?._id === res._id
                                    ? 'bg-orange-50 border-[var(--terracotta)] ring-1 ring-[var(--terracotta)]'
                                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                                    {res.type === 'BIM/CAD' ? 'CAD' : 'PDF'}
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <h4 className={`font-bold text-sm truncate ${selectedResource?._id === res._id ? 'text-[#2A1E16]' : 'text-gray-900'}`}>{res.title}</h4>
                                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
                                        {res.type} • {res.size || 'Unknown Size'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: Editor */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col relative p-8">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' && !selectedResource && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 opacity-50"
                        >
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="font-serif text-2xl text-gray-300">Select a Resource</h3>
                            <p className="text-gray-400 mt-2">Manage technical sheets, BIM files, and brochures.</p>
                        </motion.div>
                    )}

                    {(viewMode === 'create' || (viewMode === 'edit' && selectedResource)) && (
                        <ResourceEditor
                            key={selectedResource?._id || 'new'}
                            resource={selectedResource}
                            onSave={refresh}
                            onCancel={() => { setViewMode('list'); setSelectedResource(null); }}
                            onDelete={() => selectedResource && handleDelete(selectedResource)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ResourceEditor({ resource, onSave, onCancel, onDelete }: { resource: Resource | null, onSave: () => void, onCancel: () => void, onDelete: () => void }) {
    const [form, setForm] = useState(resource || { title: '', type: 'Technical Guide', description: '', size: '' });
    const [file, setFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!form.title) return alert("Title required");
        setIsSaving(true);
        try {
            let fileAssetId = null;

            if (file) {
                const fd = new FormData();
                fd.append('file', file);
                const upRes = await authenticatedFetch('/api/upload', { method: 'POST', body: fd });
                const upJson = await upRes.json();
                if (!upJson.success) throw new Error("Upload failed");
                fileAssetId = upJson.asset._id;
            } else if (!resource) {
                return alert("File is required for new resources");
            }

            const payload: any = { ...form };
            if (fileAssetId) payload.fileAssetId = fileAssetId;
            // Add manual size entry if user typed it, otherwise simple logic? 
            // Ideally we get size from asset metadata but that's async. 
            // For now, if we uploaded a file, let's update the size label roughly if possible 
            if (file) {
                const mb = (file.size / (1024 * 1024)).toFixed(1);
                payload.size = `${mb} MB`;
            }

            await authenticatedFetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: resource ? 'update_resource' : 'create_resource',
                    data: resource ? { _id: resource._id, ...payload } : payload
                })
            });

            onSave();
            if (!resource) onCancel(); // Close creator after create
        } catch (e) {
            console.error(e);
            alert("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-serif text-[#1a1512]">{resource ? 'Edit Resource' : 'New Resource'}</h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Upload Documents</p>
                </div>
                <div className="flex gap-3">
                    {resource && (
                        <button onClick={onDelete} className="px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-lg">Delete</button>
                    )}
                    <button onClick={onCancel} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-[var(--terracotta)] text-white font-bold rounded-lg shadow-lg hover:bg-[#a85638] disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Resource'}
                    </button>
                </div>
            </div>

            <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. Installation Guide - Exposed Brick" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <option>Technical Guide</option>
                            <option>BIM/CAD</option>
                            <option>Brochure</option>
                            <option>Manual</option>
                            <option>Report</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Size Label (Optional)</label>
                        <input value={form.size || ''} onChange={e => setForm({ ...form, size: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. 4.2 MB" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Brief description of contents..." />
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">File Upload</label>

                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[var(--terracotta)] hover:bg-[var(--terracotta)]/5 transition-all relative group cursor-pointer">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={e => e.target.files && setFile(e.target.files[0])}
                        />
                        <div className="pointer-events-none">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-[var(--terracotta)] group-hover:bg-white group-hover:shadow-md transition-all">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            </div>
                            <p className="font-bold text-gray-900">{file ? file.name : "Click to Upload File"}</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, ZIP, DWG supported</p>
                            {resource?.url && !file && (
                                <p className="text-xs text-green-600 font-bold mt-2">✓ Current file active</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
