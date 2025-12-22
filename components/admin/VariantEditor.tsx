'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { authenticatedFetch } from '@/lib/auth-utils';

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
    onSave: (data: { variantKey: string, name: string; family?: string; badge?: string; imageAssetId: string; galleryAssetIds: string[] }) => Promise<void>;
    onDelete: (variantKey: string) => Promise<void>;
}

export default function VariantEditor({ variant, onClose, onSave, onDelete }: VariantEditorProps) {
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
    const [badge, setBadge] = useState((variant as any).badge || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const mainFileInputRef = useRef<HTMLInputElement>(null);
    const galleryFileInputRef = useRef<HTMLInputElement>(null);

    // ... (upload handlers unchanged)
    const [isDragging, setIsDragging] = useState(false);

    const uploadFiles = async (files: FileList | File[]) => {
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await authenticatedFetch('/api/upload', { method: 'POST', body: formData });
                return res.json();
            });

            const results = await Promise.all(uploadPromises);
            const newItems = results
                .filter(r => r.success)
                .map((r, i) => ({
                    url: URL.createObjectURL(files[i]),
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

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await authenticatedFetch('/api/upload', { method: 'POST', body: formData });
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

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadFiles(e.target.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // Filter for images
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                uploadFiles(imageFiles);
            }
        }
    };

    const removeGalleryItem = (index: number) => {
        setGalleryItems(prev => prev.filter((_, i) => i !== index));
    };

    // ... (rest is same until render) ...

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
                badge: badge || undefined,
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

    const handleDelete = async () => {
        try {
            await onDelete(variant._key);
            onClose();
        } catch (e) {
            console.error(e);
            alert('Failed to delete variant');
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
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="hover:bg-red-50 p-2 rounded-full transition-colors group"
                            title="Delete Variant"
                        >
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <button onClick={onClose} className="hover:bg-gray-200 p-2 rounded-full transition-colors">
                            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
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

                        <div className="grid grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Badge</label>
                                <select
                                    value={badge}
                                    onChange={e => setBadge(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--terracotta)] text-lg font-medium appearance-none"
                                >
                                    <option value="">None</option>
                                    <option value="New">New</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Hot">Hot</option>
                                    <option value="Best Seller">Best Seller</option>
                                </select>
                            </div>
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
                                {badge && (
                                    <div className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold uppercase text-white rounded shadow-sm z-20 ${badge === 'Hot' ? 'bg-red-600' : 'bg-[var(--terracotta)]'}`}>
                                        {badge}
                                    </div>
                                )}
                                {isUploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--terracotta)] border-t-transparent rounded-full animate-spin" /></div>}
                            </div>
                            <input ref={mainFileInputRef} type="file" hidden accept="image/*" onChange={handleMainImageUpload} />
                        </div>

                        {/* Gallery - With Drag & Drop */}
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

                            <div
                                className={`grid grid-cols-4 gap-4 p-4 rounded-xl transition-all border-2 border-dashed ${isDragging ? 'border-[var(--terracotta)] bg-[var(--terracotta)]/5 ring-4 ring-[var(--terracotta)]/20' : 'border-transparent'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {galleryItems.map((item, idx) => (
                                    <div key={idx} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group border border-gray-200">
                                        <Image src={item.url} alt="" fill className="object-cover" />

                                        {/* Actions Overlay */}
                                        <div className="absolute inset-x-0 top-0 p-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button
                                                onClick={() => {
                                                    // Swap functionality
                                                    const currentMain = { url: mainImagePreview, assetId: mainImageAssetId };
                                                    const selected = item;

                                                    // Set selected as main
                                                    setMainImagePreview(selected.url);
                                                    setMainImageAssetId(selected.assetId);

                                                    // If main had an image, put it in gallery at this position
                                                    // Otherwise remove this position (promoting gallery to main)
                                                    if (currentMain.assetId && currentMain.url) {
                                                        const newGallery = [...galleryItems];
                                                        newGallery[idx] = { url: currentMain.url, assetId: currentMain.assetId };
                                                        setGalleryItems(newGallery);
                                                    } else {
                                                        const newGallery = galleryItems.filter((_, i) => i !== idx);
                                                        setGalleryItems(newGallery);
                                                    }
                                                }}
                                                className="bg-white/90 text-[var(--terracotta)] p-1.5 rounded-full hover:bg-white shadow-sm transition-colors"
                                                title="Set as Main Image"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => removeGalleryItem(idx)}
                                                className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-sm transition-colors"
                                                title="Remove"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => galleryFileInputRef.current?.click()}
                                    className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--terracotta)] hover:bg-[var(--terracotta)]/5 transition-all text-center p-2"
                                >

                                    <div className="flex flex-col items-center gap-1">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        <span className="text-[10px] font-bold uppercase">Or Drop Here</span>
                                    </div>
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Variant?</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete <strong>"{variant.name}"</strong>? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
