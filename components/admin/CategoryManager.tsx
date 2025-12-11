
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProcessedFile {
    file: File;
    preview: string;
}

interface Category {
    _id: string;
    title: string;
    description?: string;
    slug?: { current: string };
    imageUrl?: string;
    displayOrder?: number;
}

interface CategoryManagerProps {
    categories: Category[];
    onRefresh: () => void;
}

export default function CategoryManager({ categories, onRefresh }: CategoryManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<{ title: string; description: string; displayOrder: number; imageFile?: ProcessedFile }>({
        title: '',
        description: '',
        displayOrder: 0
    });
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = () => setForm({ title: '', description: '', displayOrder: 0, imageFile: undefined });

    const handleEdit = (cat: Category) => {
        setEditingId(cat._id);
        setForm({
            title: cat.title,
            description: cat.description || '',
            displayOrder: cat.displayOrder || 0
        });
        setIsCreating(true);
    };

    const handleSave = async () => {
        if (!form.title) return alert("Title is required");

        setIsSaving(true);
        try {
            let assetId = null;

            // 1. Upload Image if present
            if (form.imageFile) {
                const formData = new FormData();
                formData.append('file', form.imageFile.file);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
                const uploadJson = await uploadRes.json();
                if (uploadJson.success) assetId = uploadJson.asset._id;
            }

            // 2. Save Category
            const payload = {
                action: editingId ? 'update_category' : 'create_category',
                data: {
                    _id: editingId,
                    title: form.title,
                    description: form.description,
                    displayOrder: Number(form.displayOrder),
                    ...(assetId && { imageAssetId: assetId })
                }
            };

            const res = await fetch('/api/products/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            if (json.success) {
                resetForm();
                setIsCreating(false);
                setEditingId(null);
                onRefresh();
            } else {
                alert("Failed to save: " + json.error);
            }
        } catch (e) {
            console.error(e);
            alert("Error saving category");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        try {
            await fetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'delete_document',
                    data: { id }
                })
            });
            onRefresh();
        } catch (e) { alert("Failed to delete"); }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-2xl font-serif text-[#1a1512]">Categories</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage product categories and taxonomy.</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => { resetForm(); setIsCreating(true); }}
                        className="px-6 py-3 bg-[var(--terracotta)] text-white rounded-xl font-bold text-sm hover:bg-[#a85638] transition-all shadow-lg shadow-orange-900/20"
                    >
                        + New Category
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                {isCreating ? (
                    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">{editingId ? 'Edit Category' : 'Create New Category'}</h3>
                            <button onClick={() => { setIsCreating(false); setEditingId(null); }} className="text-sm text-gray-500 hover:text-gray-800">Cancel</button>
                        </div>

                        {/* Image Upload */}
                        <div className="w-full aspect-[21/9] bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 relative group overflow-hidden flex items-center justify-center">
                            {form.imageFile ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={form.imageFile.preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                editingId && categories.find(c => c._id === editingId)?.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={categories.find(c => c._id === editingId)?.imageUrl} alt="Existing" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <p className="text-xs font-bold uppercase tracking-widest">Upload Cover Image</p>
                                    </div>
                                )
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setForm({ ...form, imageFile: { file, preview: URL.createObjectURL(file) } });
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category Name</label>
                                <input
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-lg font-serif outline-none focus:border-[var(--terracotta)]"
                                    placeholder="e.g. Handmade Brick"
                                    autoFocus
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-[var(--terracotta)]"
                                    rows={3}
                                    placeholder="Brief description for the website..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Order</label>
                                <input
                                    type="number"
                                    value={form.displayOrder}
                                    onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-[var(--terracotta)]"
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 bg-[var(--terracotta)] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#a85638] disabled:opacity-50 transition-all"
                            >
                                {isSaving ? 'Saving...' : (editingId ? 'Update Category' : 'Create Category')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <div key={cat._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group relative">
                                <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden">
                                    {cat.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={cat.imageUrl} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                            <span className="text-xs uppercase font-bold">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-[#1a1512]">{cat.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description || 'No description'}</p>
                                    </div>
                                    <span className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">#{cat.displayOrder ?? 0}</span>
                                </div>

                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(cat)} className="p-2 bg-white rounded-lg shadow-sm text-blue-500 hover:bg-blue-50">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(cat._id, cat.title)} className="p-2 bg-white rounded-lg shadow-sm text-red-500 hover:bg-red-50">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
