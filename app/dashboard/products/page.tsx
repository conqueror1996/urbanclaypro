'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, Product } from '@/lib/products';

// Types for our robust hierarchy
type ViewMode = 'list' | 'create' | 'edit';

export default function ProductDashboardPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
            if (selectedProduct) {
                // keep selected product in sync
                const updated = data.find(p => p._id === selectedProduct._id);
                if (updated) setSelectedProduct(updated);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch products on mount
    useEffect(() => {
        refresh();
    }, []);

    const handleCreateProduct = async (title: string, category: string) => {
        if (!title) return;
        try {
            const res = await fetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'create_product',
                    data: { title, category }
                })
            });
            const json = await res.json();
            if (json.success) {
                await refresh();
                setViewMode('list');
                const newProd = products.find(p => p._id === json.product._id) || json.product;
                if (newProd) {
                    setSelectedProduct(newProd);
                    setViewMode('edit');
                }
            }
        } catch (e) { alert('Failed to create'); }
    };

    const groupedProducts = products.reduce((acc, product: any) => {
        const cat = product.tag || product.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <div className="h-[calc(100vh-80px)] flex gap-8">
            {/* LEFT SIDEBAR: Product Tree */}
            <div className="w-1/3 bg-white rounded-3xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-[#1a1512] font-serif text-xl">Catalog Hierarchy</h2>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Category &gt; Range</p>
                    </div>
                    <button
                        onClick={() => { setSelectedProduct(null); setViewMode('create'); }}
                        className="w-8 h-8 bg-[var(--terracotta)] text-white rounded-full flex items-center justify-center hover:bg-[#a85638] transition-colors shadow-lg shadow-orange-900/20"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100/80 animate-pulse rounded-2xl" />)}
                        </div>
                    ) : (
                        Object.entries(groupedProducts).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                    {category}
                                </h3>
                                <div className="space-y-2 pl-4 border-l border-gray-100 ml-1">
                                    {items.map(product => (
                                        <div
                                            key={product._id}
                                            onClick={() => { setSelectedProduct(product); setViewMode('edit'); }}
                                            className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${selectedProduct?._id === product._id
                                                ? 'bg-orange-50 border-[var(--terracotta)] ring-1 ring-[var(--terracotta)]'
                                                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                                                {/* Placeholder for image */}
                                                {(product as any).imageUrl && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={(product as any).imageUrl} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className={`font-bold text-sm truncate ${selectedProduct?._id === product._id ? 'text-[#2A1E16]' : 'text-gray-700'}`}>{product.title}</h4>
                                                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                                    Range / Series
                                                </p>
                                            </div>
                                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: Editor */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col relative">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' && !selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 opacity-50"
                        >
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            </div>
                            <h3 className="font-serif text-2xl text-gray-300">Select a Range</h3>
                            <p className="text-gray-400 mt-2">Manage your Product Ranges and their individual Sub-variants.</p>
                        </motion.div>
                    )}

                    {viewMode === 'edit' && selectedProduct && (
                        <ProductEditor product={selectedProduct} key={selectedProduct._id} onRefresh={refresh} />
                    )}

                    {viewMode === 'create' && (
                        <CreateProductWizard onCancel={() => setViewMode('list')} onCreate={handleCreateProduct} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}


function CreateProductWizard({ onCancel, onCreate }: { onCancel: () => void, onCreate: (t: string, c: string) => void }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<string[]>(['Brick Wall Tiles', 'Exposed Bricks', 'Jaali', 'Roof Tile', 'Floor Tiles']); // Default seed
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    // Fetch existing categories on mount
    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch('/api/products/manage?intent=categories');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setCategories(data);
                }
            } catch (e) {
                console.error("Failed to load categories", e);
            }
        }
        loadCategories();
    }, []);

    const handleCreateCategory = async () => {
        if (!newCategory) return;
        // Optimistic update
        setCategories([...categories, newCategory]);
        setCategory(newCategory);
        setIsCreatingCategory(false);
        // We relying on the backend create_product to auto-create the category for now, 
        // OR we can explicitly call the new create_category value if desired, but not strictly needed 
        // as the produce creation handles it. Visual feedback is enough.
    };

    return (
        <div className="p-10 flex flex-col items-center justify-center h-full max-w-lg mx-auto w-full">
            <h3 className="text-2xl font-serif mb-6">New Product Range</h3>
            <div className="w-full space-y-5">

                {/* Visual Category Selector */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category (Collection)</label>
                        {!isCreatingCategory ? (
                            <button onClick={() => setIsCreatingCategory(true)} className="text-[10px] font-bold text-[var(--terracotta)] hover:underline uppercase">+ New Category</button>
                        ) : (
                            <button onClick={() => setIsCreatingCategory(false)} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase">Cancel</button>
                        )}
                    </div>

                    {!isCreatingCategory ? (
                        <div className="relative">
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--terracotta)] appearance-none"
                            >
                                <option value="" disabled>Select a Category...</option>
                                {Array.from(new Set(categories)).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                placeholder="Enter New Category Name..."
                                className="flex-1 p-3 bg-white border-2 border-[var(--terracotta)]/20 rounded-xl outline-none focus:border-[var(--terracotta)]"
                            />
                            <button
                                onClick={handleCreateCategory}
                                disabled={!newCategory}
                                className="bg-[var(--terracotta)] text-white px-4 rounded-xl font-bold text-sm hover:bg-[#a85638] disabled:opacity-50"
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Range Name (Variant Name)</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Vintage Series"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--terracotta)]"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button onClick={onCancel} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                    <button
                        onClick={() => onCreate(title, category)}
                        disabled={!title || !category}
                        className="flex-1 py-3 bg-[var(--terracotta)] text-white font-bold rounded-xl shadow-lg hover:bg-[#a85638] disabled:opacity-50 disabled:shadow-none"
                    >
                        Create Range
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- SUB COMPONENTS ---

// ... imports
import VariantCreator from '@/components/admin/VariantCreator';
import VariantEditor from '@/components/admin/VariantEditor';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';

// ... existing code ...

export function ProductEditor({ product, onRefresh }: { product: Product, onRefresh: () => void }) {
    const [activeTab, setActiveTab] = useState<'details' | 'products' | 'specs' | 'assets' | 'seo'>('details');
    const [form, setForm] = useState(product);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<any>(null);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingVariant, setEditingVariant] = useState<any>(null);

    // Sync form if product prop updates externally
    useEffect(() => { setForm(product); }, [product]);

    // ... existing handleSave, handleDelete ...
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'update_product',
                    data: {
                        _id: form._id,
                        title: form.title,
                        tag: form.tag,
                        priceRange: form.priceRange,
                        description: form.description,
                        specs: form.specs || {},
                        seo: form.seo || {}
                    }
                })
            });
            onRefresh();
        } catch (e) {
            console.error(e);
            alert("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        // if (!confirm(`Are you sure you want to delete "${product.title}"? This cannot be undone.`)) return;

        try {
            const res = await fetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'delete_document',
                    data: { id: product._id }
                })
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Failed to delete");
            }

            window.location.reload(); // Hard reload to clear state and refresh list
        } catch (e) {
            console.error(e);
            alert("Failed to delete product: " + (e as Error).message);
        }
    };

    const handleUpdateVariant = async (data: { variantKey: string, name: string; family?: string; imageAssetId: string; galleryAssetIds: string[] }) => {
        try {
            const res = await fetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'update_variant',
                    data: {
                        productId: form._id,
                        variantKey: data.variantKey,
                        data: {
                            name: data.name,
                            family: data.family,
                            imageAssetId: data.imageAssetId,
                            galleryAssetIds: data.galleryAssetIds
                        }
                    }
                })
            });
            const json = await res.json();
            if (json.success) {
                onRefresh();
                setEditingVariant(null);
            } else {
                throw new Error(json.error || "Failed to update variant");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to update variant");
        }
    };

    const handleVariantSave = async ({ name, family, files }: { name: string, family?: string, files: File[] }) => {
        if (!files.length) return;

        // 1. Upload All Assets in Parallel
        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            return res.json();
        });

        const results = await Promise.all(uploadPromises);
        const assetIds = results.map(r => r.success ? r.asset._id : null).filter(Boolean);

        if (assetIds.length === 0) throw new Error("Image upload failed");

        // 2. Add Variant with Main Image + Gallery
        const mainAssetId = assetIds[0];
        const galleryAssetIds = assetIds.slice(1);

        await fetch('/api/products/manage', {
            method: 'POST',
            body: JSON.stringify({
                action: 'add_variant',
                data: {
                    productId: form._id,
                    name,
                    family,
                    imageAssetId: mainAssetId,
                    galleryAssetIds
                }
            })
        });
        onRefresh();
    };

    const handleGenerateSEO = async () => {
        if (!form.title || !form.description) {
            alert("Please ensure the product has a Title and Description before generating SEO.");
            return;
        }
        setIsGeneratingSeo(true);
        setAiSuggestion(null);
        try {
            const res = await fetch('/api/ai/generate-seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    currentTags: form.seo?.keywords
                })
            });
            const json = await res.json();
            if (json.success) {
                setAiSuggestion(json.data);
            } else {
                throw new Error(json.error);
            }
        } catch (e: any) {
            alert("SEO Generation Failed: " + e.message);
        } finally {
            setIsGeneratingSeo(false);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full relative"
        >
            {/* Modal */}
            <AnimatePresence>
                {showVariantModal && (
                    <VariantCreator
                        onClose={() => setShowVariantModal(false)}
                        onSave={handleVariantSave}
                    />
                )}
                {showDeleteModal && (
                    <DeleteConfirmationModal
                        isOpen={showDeleteModal}
                        productTitle={form.title}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={confirmDelete}
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-[#1a1512]">{form.title}</h1>
                        <div className="flex gap-4 mt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <span>Range: {(form as any).tag}</span>
                            <span>•</span>
                            <span>{(form as any).slug?.current || form.slug}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete Range"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>

                    {/* View Live Link */}
                    <Link
                        href={((form as any).slug?.current || form.slug) ? `/products/${(form.tag || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${(form as any).slug?.current || form.slug}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold uppercase hover:bg-white hover:shadow-sm transition-all text-gray-500 flex items-center gap-2 ${!((form as any).slug?.current || form.slug) ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <span>View Live</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </Link>

                    {/* Action Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg bg-[var(--terracotta)] text-white text-xs font-bold uppercase shadow-lg shadow-orange-900/20 hover:bg-[#a85638] transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>


            {/* Tabs */}
            <div className="flex px-8 border-b border-gray-100">
                {['details', 'products', 'specs', 'seo'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab
                            ? 'border-[var(--terracotta)] text-[var(--terracotta)]'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab === 'products' ? 'Sub-variants' : tab === 'seo' ? 'SEO (AI)' : tab}
                    </button>
                ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 pointer-events-auto">

                <div>
                    {activeTab === 'products' && (
                        <div className="space-y-8">
                            <AnimatePresence>
                                {editingVariant && (
                                    <VariantEditor
                                        variant={editingVariant}
                                        onClose={() => setEditingVariant(null)}
                                        onSave={handleUpdateVariant}
                                    />
                                )}
                            </AnimatePresence>

                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm">Product Level Management</h4>
                                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                        Manage individual <strong>Sub-variants / Products</strong> within the {form.title} range.
                                    </p>
                                </div>
                            </div>

                            {/* Variants Grid */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-serif text-lg">Sub-variants</h3>
                                </div>

                                <div className="grid grid-cols-5 gap-4">
                                    {(product as any).variants?.map((variant: any, vIdx: number) => (
                                        <div
                                            key={vIdx}
                                            onClick={() => setEditingVariant(variant)}
                                            className="group bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-[var(--terracotta)] transition-all cursor-pointer relative"
                                        >
                                            <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                {variant.imageUrl && <img src={variant.imageUrl} alt="" className="w-full h-full object-cover" />}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </div>
                                            </div>
                                            <p className="font-bold text-xs text-center truncate">{variant.name}</p>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setShowVariantModal(true)}
                                        className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] hover:bg-[var(--terracotta)]/5 transition-all"
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        <span className="text-[10px] font-bold uppercase">AI Add Product</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    )
                    }

                    {
                        activeTab === 'details' && (
                            <div className="space-y-6 max-w-2xl">
                                {/* Main Image Uploader */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Product Image</label>
                                    <div className="flex items-start gap-4">
                                        <div className="w-32 h-32 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 relative group">
                                            {(form as any).imageUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={(form as any).imageUrl} alt="Main" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-bold">Change</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    // Upload logic inline for simplicity
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    try {
                                                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                                        const json = await res.json();
                                                        if (json.success) {
                                                            // Immediately update backend
                                                            await fetch('/api/products/manage', {
                                                                method: 'POST',
                                                                body: JSON.stringify({
                                                                    action: 'update_product',
                                                                    data: {
                                                                        _id: form._id,
                                                                        images: [{
                                                                            _key: crypto.randomUUID(),
                                                                            _type: 'image',
                                                                            asset: { _type: 'reference', _ref: json.asset._id }
                                                                        }]
                                                                    }
                                                                })
                                                            });
                                                            onRefresh();
                                                        }
                                                    } catch (err) { alert('Upload failed'); console.error(err); }
                                                }}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-500 flex-1 pt-2">
                                            <p className="mb-2">Upload a high-quality main image for this product range. This will be shown on the catalog and dashboard list.</p>
                                            <p className="text-gray-400">Supported: JPG, PNG, WEBP. Max 5MB.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Range Name (Variant Name)</label>
                                    <input type="text" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                        <select value={form.tag || ""} onChange={e => setForm({ ...form, tag: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3">
                                            <option value="" disabled>Select a Category...</option>
                                            <option value="Brick Wall Tiles">Brick Wall Tiles</option>
                                            <option value="Exposed Bricks">Exposed Bricks</option>
                                            <option value="Jaali">Jaali</option>
                                            <option value="Roof Tile">Roof Tiles</option>
                                            <option value="Floor Tiles">Floor Tiles</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price Range Display</label>
                                        <input type="text" value={form.priceRange || ""} onChange={e => setForm({ ...form, priceRange: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                    <textarea rows={6} value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === 'specs' && (
                            <div className="max-w-2xl space-y-6">
                                <div className="bg-orange-50 p-4 rounded-xl border border-[var(--terracotta)]/20 flex gap-3 text-sm text-[var(--terracotta)]">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p>These specifications apply to the entire range. Sub-variants share these specs.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Size (Dimensions)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 230 x 75 x 20 mm"
                                            value={form.specs?.size || ''}
                                            onChange={e => setForm({ ...form, specs: { ...form.specs, size: e.target.value } as any })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Coverage</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 48 pcs / sq. mt."
                                            value={form.specs?.coverage || ''}
                                            onChange={e => setForm({ ...form, specs: { ...form.specs, coverage: e.target.value } as any })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Water Absorption</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 8-10%"
                                            value={form.specs?.waterAbsorption || ''}
                                            onChange={e => setForm({ ...form, specs: { ...form.specs, waterAbsorption: e.target.value } as any })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Compressive Strength</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. > 25 N/mm²"
                                            value={form.specs?.compressiveStrength || ''}
                                            onChange={e => setForm({ ...form, specs: { ...form.specs, compressiveStrength: e.target.value } as any })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Firing Temperature</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 1000°C - 1200°C"
                                            value={form.specs?.firingTemperature || ''}
                                            onChange={e => setForm({ ...form, specs: { ...form.specs, firingTemperature: e.target.value } as any })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Application</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Interior / Exterior / Cladding"
                                            value={form.specs?.application || ''}
                                            onChange={e => setForm({ ...form, specs: { ...form.specs, application: e.target.value } as any })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[var(--terracotta)] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === 'seo' && (
                            <div className="max-w-3xl space-y-8">
                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex justify-between items-start gap-6">
                                    <div>
                                        <h4 className="font-bold text-purple-900 text-lg flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            AI SEO Agent
                                        </h4>
                                        <p className="text-sm text-purple-700 mt-2 leading-relaxed">
                                            Generate optimized metadata for Google using our AI agent.
                                            The agent analyzes your product description and market trends to suggest the best tags.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleGenerateSEO}
                                        disabled={isGeneratingSeo}
                                        className="px-5 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {isGeneratingSeo ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Generating...
                                            </>
                                        ) : (
                                            <>Generate Suggestion</>
                                        )}
                                    </button>
                                </div>

                                {/* Comparison / Edit Area */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Current Data */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Current Metadata</h3>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Title <span className="text-gray-300 font-normal">({(form.seo?.metaTitle || '').length}/60)</span></label>
                                            <input
                                                type="text"
                                                value={form.seo?.metaTitle || ''}
                                                onChange={e => setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:border-[var(--terracotta)] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Description <span className="text-gray-300 font-normal">({(form.seo?.metaDescription || '').length}/160)</span></label>
                                            <textarea
                                                rows={4}
                                                value={form.seo?.metaDescription || ''}
                                                onChange={e => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:border-[var(--terracotta)] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Keywords</label>
                                            <textarea
                                                rows={3}
                                                value={form.seo?.keywords?.join(', ') || ''}
                                                onChange={e => setForm({ ...form, seo: { ...form.seo, keywords: e.target.value.split(',').map(s => s.trim()) } })}
                                                placeholder="Comma separated..."
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:border-[var(--terracotta)] outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* AI Suggestion - Only shows if generated */}
                                    <div className={`space-y-6 transition-opacity duration-500 ${aiSuggestion ? 'opacity-100' : 'opacity-30 pointer-events-none grayscale'}`}>
                                        <div className="flex justify-between items-end border-b pb-2">
                                            <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest">AI Suggestion</h3>
                                            {aiSuggestion && (
                                                <button
                                                    onClick={() => setForm({
                                                        ...form,
                                                        seo: {
                                                            ...form.seo,
                                                            metaTitle: aiSuggestion.metaTitle,
                                                            metaDescription: aiSuggestion.metaDescription,
                                                            keywords: aiSuggestion.keywords,
                                                            aiInsights: aiSuggestion.aiInsights
                                                        }
                                                    })}
                                                    className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                                                >
                                                    Apply All
                                                </button>
                                            )}
                                        </div>

                                        {aiSuggestion ? (
                                            <>
                                                <div className="group relative">
                                                    <p className="text-sm font-medium text-gray-800 p-3 bg-white border border-purple-100 rounded-lg shadow-sm">
                                                        {aiSuggestion.metaTitle}
                                                    </p>
                                                    <button
                                                        onClick={() => setForm({ ...form, seo: { ...form.seo, metaTitle: aiSuggestion.metaTitle } })}
                                                        className="absolute top-1/2 -translate-y-1/2 right-2 text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>

                                                <div className="group relative">
                                                    <p className="text-sm text-gray-600 p-3 bg-white border border-purple-100 rounded-lg shadow-sm">
                                                        {aiSuggestion.metaDescription}
                                                    </p>
                                                    <button
                                                        onClick={() => setForm({ ...form, seo: { ...form.seo, metaDescription: aiSuggestion.metaDescription } })}
                                                        className="absolute top-2 right-2 text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>

                                                <div className="group relative">
                                                    <div className="flex flex-wrap gap-2 p-3 bg-white border border-purple-100 rounded-lg shadow-sm">
                                                        {aiSuggestion.keywords?.map((k: string, i: number) => (
                                                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{k}</span>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => setForm({ ...form, seo: { ...form.seo, keywords: aiSuggestion.keywords } })}
                                                        className="absolute top-2 right-2 text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>

                                                <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100">
                                                    <p className="text-xs text-purple-800 font-medium mb-1">AI Reasoning:</p>
                                                    <p className="text-xs text-purple-600 italic">"{aiSuggestion.aiInsights}"</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-xl">
                                                <p className="text-gray-400 text-sm">Click "Generate Suggestion" to see AI recommendations here.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div >
            </div >
        </motion.div >
    );
}
