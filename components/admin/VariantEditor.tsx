'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface VariantEditorProps {
    variant: {
        _key: string;
        name: string;
        family?: string;
        imageUrl: string;
        imageRef?: string;
        gallery?: string[];
        galleryRefs?: string[];
    };
    onClose: () => void;
    onSave: (data: { variantKey: string, name: string; family?: string; imageAssetId: string; galleryAssetIds: string[] }) => Promise<void>;
}

export default function VariantEditor({ variant, onClose, onSave }: VariantEditorProps) {
    const [name, setName] = useState(variant.name);
    const [family, setFamily] = useState(variant.family || '');
    // State for main image
    const [mainImagePreview, setMainImagePreview] = useState(variant.imageUrl);
    const [mainImageAssetId, setMainImageAssetId] = useState(variant.imageRef);

    // ... (rest of state items are unchanged)

    // State for gallery
    // We maintain a list of objects { url: string, assetId: string }
    const initialGallery = (variant.gallery || []).map((url, i) => ({
        url,
        assetId: variant.galleryRefs?.[i] || '' // Fallback if ref missing, though it shouldn't be if data fresh
    }));

    const [galleryItems, setGalleryItems] = useState<{ url: string; assetId: string }[]>(initialGallery);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const mainFileInputRef = useRef<HTMLInputElement>(null);
    const galleryFileInputRef = useRef<HTMLInputElement>(null);

    // ... (upload handlers unchanged)
    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const json = await res.json();

            if (json.success) {
                setMainImagePreview(URL.createObjectURL(file));
                setMainImageAssetId(json.asset._id);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                return res.json();
            });

            const results = await Promise.all(uploadPromises);
            const newItems = results
                .filter(r => r.success)
                .map((r, i) => ({
                    url: URL.createObjectURL(files[i]), // or use returned url if available, but objectURL faster for preview
                    assetId: r.asset._id
                }));

            setGalleryItems(prev => [...prev, ...newItems]);
        } catch (err) {
            console.error(err);
            alert('Failed to upload images');
        } finally {
            setIsUploading(false);
        }
    };

    const removeGalleryItem = (index: number) => {
        setGalleryItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveClick = async () => {
        if (!name || !mainImageAssetId) {
            alert("Name and Main Image are required");
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                variantKey: variant._key,
                name,
                family: family || undefined,
                imageAssetId: mainImageAssetId,
                galleryAssetIds: galleryItems.map(g => g.assetId).filter(Boolean)
            });
            onClose();
        } catch (e) {
            console.error(e);
            alert('Failed to save variant');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-[#1a1512]">Edit Variant</h3>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Update photos and details</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-gray-200 p-2 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Name & Family Inputs */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Variant Name</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--terracotta)] text-lg font-bold"
                                placeholder="e.g. Deep Rustic Red"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Family (Group)</label>
                            <input
                                value={family}
                                onChange={e => setFamily(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--terracotta)] text-lg font-medium"
                                placeholder="e.g. Red Series"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Image */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Image</label>
                            <div
                                className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group cursor-pointer border border-gray-200"
                                onClick={() => mainFileInputRef.current?.click()}
                            >
                                {mainImagePreview ? (
                                    <Image src={mainImagePreview} alt="Main" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm font-bold bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">Change Photo</span>
                                </div>
                                {isUploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--terracotta)] border-t-transparent rounded-full animate-spin" /></div>}
                            </div>
                            <input ref={mainFileInputRef} type="file" hidden accept="image/*" onChange={handleMainImageUpload} />
                        </div>

                        {/* Gallery */}
                        <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Gallery Images</label>
                                <button
                                    onClick={() => galleryFileInputRef.current?.click()}
                                    className="text-xs font-bold text-[var(--terracotta)] hover:underline flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    Add Photos
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                {galleryItems.map((item, idx) => (
                                    <div key={idx} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group border border-gray-200">
                                        <Image src={item.url} alt="" fill className="object-cover" />
                                        <button
                                            onClick={() => removeGalleryItem(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => galleryFileInputRef.current?.click()}
                                    className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--terracotta)] hover:bg-[var(--terracotta)]/5 transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </button>
                            </div>
                            <input ref={galleryFileInputRef} type="file" hidden accept="image/*" multiple onChange={handleGalleryUpload} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-200 rounded-xl">Cancel</button>
                    <button
                        onClick={handleSaveClick}
                        disabled={isSaving || isUploading}
                        className="px-8 py-3 bg-[var(--terracotta)] text-white font-bold rounded-xl shadow-lg hover:bg-[#a85638] disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
