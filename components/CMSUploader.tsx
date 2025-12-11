'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, getProducts } from '@/lib/products';

const DEFAULT_CATEGORIES = [
    'Brick Wall Tiles',
    'Exposed Bricks',
    'Jaali',
    'Roof Tile',
    'Terracotta Panels',
    'Clay Ceiling Tile',
    'Floor Tiles'
];

export default function CMSUploader() {
    const [mode, setMode] = useState<'project' | 'product'>('project');
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // --- PRODUCT MODE STATE ---
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // --- PRODUCT SPECS STATE ---
    const [activeSubTab, setActiveSubTab] = useState<'photos' | 'specs'>('photos');
    const [specs, setSpecs] = useState({
        price: '',
        dimensions: '',
        coverage: '',
        application: '',
        description: ''
    });

    // --- NEW PRODUCT STATE ---
    const [isCreating, setIsCreating] = useState(false);
    const [newProdTitle, setNewProdTitle] = useState('');
    const [newProdCategory, setNewProdCategory] = useState(''); // Can be existing or new

    // --- EXISTING PROJECT STATE ---
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [architect, setArchitect] = useState('');
    const [description, setDescription] = useState('');

    const [files, setFiles] = useState<File[]>([]);

    // Fetch products helper
    const refreshProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Initial load
    useEffect(() => {
        refreshProducts();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleCreateProduct = async () => {
        if (!newProdTitle || !newProdCategory) return alert("Title and Category required");

        try {
            const res = await fetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'create_product',
                    data: { title: newProdTitle, category: newProdCategory }
                })
            });
            const json = await res.json();
            if (json.success) {
                alert('Product Created!');
                setIsCreating(false);
                setNewProdTitle('');
                setNewProdTitle('');
                // Refresh products
                await refreshProducts();
                // Auto select
                setSelectedCategory(newProdCategory);
                // We might want to auto-select product too but let's stick to category refresh
            }
        } catch (e) { console.error(e); alert('Failed to create'); }
    };

    const handleSaveSpecs = async () => {
        if (!selectedProduct) return;
        setStatus('uploading'); // Use same status state for loading UI
        setMessage('Saving Specifications...');

        try {
            const res = await fetch('/api/products/manage', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'update_specs',
                    data: { productId: selectedProduct, specifications: specs }
                })
            });
            if (res.ok) {
                setStatus('success');
                setMessage('Specifications Updated!');
                await refreshProducts(); // Fetch fresh data
                setTimeout(() => setStatus('idle'), 2000);
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    // Load specs when product selected
    useEffect(() => {
        if (selectedProduct) {
            const p = products.find(p => p._id === selectedProduct);
            if (p) {
                setSpecs({
                    price: p.price || (p as any).priceRange || '',
                    dimensions: (p as any).dimensions || (p.specs?.size) || '',
                    coverage: (p as any).coverage || (p.specs?.coverage) || '',
                    application: (p as any).application || (p.specs?.application) || '',
                    description: p.description || ''
                });
            }
        }
    }, [selectedProduct, products]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) { alert("Please select image(s)"); return; }

        setStatus('uploading');

        let successCount = 0;
        let failCount = 0;

        // Loop through all files
        for (let i = 0; i < files.length; i++) {
            const currentFile = files[i];
            setMessage(`Uploading ${i + 1} of ${files.length}: ${currentFile.name}...`);

            const formData = new FormData();
            formData.append('file', currentFile);

            if (mode === 'project') {
                formData.append('type', 'project');
                formData.append('title', title);
                formData.append('location', location);
                formData.append('architect', architect);
                formData.append('description', description);
            } else {
                if (!selectedProduct) { alert("Select a product"); setStatus('idle'); return; }
                formData.append('type', 'product-image');
                formData.append('productId', selectedProduct);
            }

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) successCount++;
                else failCount++;

            } catch (err) {
                console.error(err);
                failCount++;
            }
        }

        if (successCount === files.length) {
            setStatus('success');
            setMessage(mode === 'project' ? 'All project assets created!' : `${successCount} images added to gallery!`);
            setFiles([]);
            setTitle('');
            // Don't clear product selection, user might want to add more to same product
        } else if (successCount > 0) {
            setStatus('error');
            setMessage(`Uploaded ${successCount}, Failed ${failCount}. Check logs.`);
        } else {
            setStatus('error');
            setMessage('All uploads failed.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-4 border-b border-gray-200 pb-4">
                <button
                    onClick={() => setMode('project')}
                    className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${mode === 'project' ? 'border-[var(--terracotta)] text-[var(--terracotta)]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Add New Project
                </button>
                <button
                    onClick={() => setMode('product')}
                    className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${mode === 'product' ? 'border-[var(--terracotta)] text-[var(--terracotta)]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Update Product Photos
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* --- LEFT: FORM INPUTS --- */}
                <div className="space-y-6">
                    {mode === 'project' ? (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Title</label>
                                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[var(--terracotta)]" placeholder="e.g. The Brick House" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                                    <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[var(--terracotta)]" placeholder="New Delhi" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Architect</label>
                                    <input type="text" value={architect} onChange={e => setArchitect(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[var(--terracotta)]" placeholder="Studio Lotus" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[var(--terracotta)]" placeholder="Project details and concept..." />
                            </div>
                        </>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Product Hierarchy</label>
                                {!isCreating && (
                                    <button onClick={() => { setIsCreating(true); setNewProdCategory(selectedCategory); }} className="text-[10px] font-bold text-[var(--terracotta)] uppercase tracking-wider hover:underline">+ New Product</button>
                                )}
                            </div>

                            {isCreating ? (
                                <div className="bg-orange-50 p-4 rounded-xl border border-[var(--terracotta)] mb-6">
                                    <h4 className="font-bold text-[#2A1E16] text-sm mb-3">Create New Product</h4>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Category Name (e.g. Exposed Brick)"
                                            value={newProdCategory}
                                            onChange={e => setNewProdCategory(e.target.value)}
                                            list="categories"
                                            className="w-full text-sm p-2 border rounded"
                                        />
                                        <datalist id="categories">
                                            {Array.from(new Set([
                                                ...DEFAULT_CATEGORIES,
                                                ...products.map((p: any) => p.tag || p.category).filter(Boolean)
                                            ])).map((c: any) => <option key={c} value={c} />)}
                                        </datalist>

                                        <input
                                            type="text"
                                            placeholder="Product Title (e.g. Rustic Red Wirecut)"
                                            value={newProdTitle}
                                            onChange={e => setNewProdTitle(e.target.value)}
                                            className="w-full text-sm p-2 border rounded"
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => setIsCreating(false)} className="text-xs text-gray-500 px-3 py-1">Cancel</button>
                                            <button onClick={handleCreateProduct} className="text-xs bg-[var(--terracotta)] text-white px-3 py-1 rounded font-bold">Create</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* BREADCRUMB */}
                                    <div className="flex items-center text-xs font-bold uppercase tracking-widest mb-6 bg-gray-50 p-3 rounded-lg">
                                        <span className={selectedCategory ? "text-gray-500" : "text-[var(--terracotta)]"}>Catalog</span>
                                        {selectedCategory && (
                                            <>
                                                <span className="mx-2 text-gray-300">/</span>
                                                <span className={selectedProduct ? "text-gray-500" : "text-[var(--terracotta)]"}>{selectedCategory}</span>
                                            </>
                                        )}
                                        {selectedProduct && (
                                            <>
                                                <span className="mx-2 text-gray-300">/</span>
                                                <span className="text-[var(--terracotta)]">
                                                    {(products.find(p => (p as any)._id === selectedProduct) as any)?.title}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* 1. Category Selection */}
                                    <div className="mb-6">
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-2">1. Select Category</p>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from(new Set([
                                                ...DEFAULT_CATEGORIES,
                                                ...products.map((p: any) => p.tag || p.category || 'Other')
                                            ])).map(cat => (
                                                <button
                                                    key={cat as string}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory(cat as string);
                                                        setSelectedProduct('');
                                                        setActiveSubTab('photos');
                                                    }}
                                                    className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === cat
                                                        ? 'bg-[var(--terracotta)] text-white border-[var(--terracotta)]'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-[var(--terracotta)] hover:text-[var(--terracotta)]'
                                                        }`}
                                                >
                                                    {cat as string}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Variant/Product Selection */}
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-2">2. Select Product</p>
                                        {selectedCategory ? (
                                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                                                {products
                                                    .filter((p: any) => (p.tag || p.category || 'Other') === selectedCategory)
                                                    .map((p: any) => (
                                                        <div
                                                            key={p._id}
                                                            onClick={() => setSelectedProduct(p._id)}
                                                            className={`cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all ${selectedProduct === p._id
                                                                ? 'border-[var(--terracotta)] bg-orange-50 ring-1 ring-[var(--terracotta)]'
                                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: p.color || '#ccc' }} />
                                                            <div>
                                                                <h4 className={`text-sm font-bold ${selectedProduct === p._id ? 'text-[#2A1E16]' : 'text-gray-600'}`}>
                                                                    {p.title}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                                                <p className="text-xs text-gray-400">Select a category above to see variants.</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* --- RIGHT: ACTIONS --- */}
                <div className="flex flex-col">
                    {mode === 'project' ? (
                        <>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Images (Select Multiple)</label>
                            <label className="flex-grow border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-50 hover:border-[var(--terracotta)]/50 transition-all group min-h-[300px]">
                                <input type="file" onChange={handleFileChange} accept="image/*" multiple className="hidden" />

                                {files.length > 0 ? (
                                    <div className="text-center w-full">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="font-bold text-xl">{files.length}</span>
                                        </div>
                                        <span className="font-bold text-gray-800">{files.length} Files Selected</span>
                                        <div className="text-xs text-gray-400 mt-2 max-h-20 overflow-y-auto">
                                            {files.map((f, i) => <div key={i}>{f.name}</div>)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center group-hover:scale-105 transition-transform">
                                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--terracotta)]/10 group-hover:text-[var(--terracotta)] transition-colors">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <span className="font-bold text-gray-400 group-hover:text-[var(--terracotta)]">Click to Upload Images</span>
                                        <p className="text-xs text-gray-300 mt-2">JPG, PNG, WEBP (Select Multiple)</p>
                                    </div>
                                )}
                            </label>

                            <button
                                onClick={handleSubmit}
                                disabled={status === 'uploading' || files.length === 0}
                                className="w-full mt-4 bg-[#2A1E16] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[var(--terracotta)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all relative overflow-hidden"
                            >
                                {status === 'uploading' ? 'Uploading...' : 'Create Project & Upload Assets'}
                            </button>
                        </>
                    ) : (
                        // PRODUCT MODE RIGHT COLUMN
                        <>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">3. Manage Content</label>
                            <div className="flex gap-2 mb-4 bg-gray-50 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setActiveSubTab('photos')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeSubTab === 'photos' ? 'bg-white shadow text-[#2A1E16]' : 'text-gray-400'}`}
                                >Photos</button>
                                <button
                                    type="button"
                                    onClick={() => setActiveSubTab('specs')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeSubTab === 'specs' ? 'bg-white shadow text-[#2A1E16]' : 'text-gray-400'}`}
                                >Specifications</button>
                            </div>

                            {!selectedProduct ? (
                                <div className="flex-grow border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-8 bg-gray-50/50">
                                    <p className="text-sm text-gray-400">Select a product to editing.</p>
                                </div>
                            ) : activeSubTab === 'photos' ? (
                                <>
                                    <label className="flex-grow border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-50 hover:border-[var(--terracotta)]/50 transition-all group min-h-[300px]">
                                        <input type="file" onChange={handleFileChange} accept="image/*" multiple className="hidden" />

                                        {files.length > 0 ? (
                                            <div className="text-center w-full">
                                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <span className="font-bold text-xl">{files.length}</span>
                                                </div>
                                                <span className="font-bold text-gray-800">{files.length} Files Selected</span>
                                                <div className="text-xs text-gray-400 mt-2 max-h-20 overflow-y-auto">
                                                    {files.map((f, i) => <div key={i}>{f.name}</div>)}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center group-hover:scale-105 transition-transform">
                                                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--terracotta)]/10 group-hover:text-[var(--terracotta)] transition-colors">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                                <span className="font-bold text-gray-400 group-hover:text-[var(--terracotta)]">Click to Upload Images</span>
                                                <p className="text-xs text-gray-300 mt-2">JPG, PNG, WEBP (Select Multiple)</p>
                                            </div>
                                        )}
                                    </label>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={status === 'uploading' || files.length === 0}
                                        className="w-full mt-4 bg-[#2A1E16] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[var(--terracotta)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all relative overflow-hidden"
                                    >
                                        {status === 'uploading' ? 'Uploading...' : 'Upload Photos'}
                                    </button>
                                </>
                            ) : (
                                <div className="flex-grow space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price Info</label>
                                        <input className="w-full text-sm p-3 bg-gray-50 rounded-lg border border-gray-200" value={specs.price} onChange={e => setSpecs({ ...specs, price: e.target.value })} placeholder="e.g. Rs. 120 / sq.ft" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dimensions</label>
                                            <input className="w-full text-sm p-3 bg-gray-50 rounded-lg border border-gray-200" value={specs.dimensions} onChange={e => setSpecs({ ...specs, dimensions: e.target.value })} placeholder="9x3x2 inches" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Coverage</label>
                                            <input className="w-full text-sm p-3 bg-gray-50 rounded-lg border border-gray-200" value={specs.coverage} onChange={e => setSpecs({ ...specs, coverage: e.target.value })} placeholder="50 sq.ft / box" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Application</label>
                                        <input className="w-full text-sm p-3 bg-gray-50 rounded-lg border border-gray-200" value={specs.application} onChange={e => setSpecs({ ...specs, application: e.target.value })} placeholder="Interior / Exterior Facade" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Long Description & Specs</label>
                                        <textarea rows={4} className="w-full text-sm p-3 bg-gray-50 rounded-lg border border-gray-200" value={specs.description} onChange={e => setSpecs({ ...specs, description: e.target.value })} placeholder="Detailed spec sheet..." />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSaveSpecs}
                                        className="w-full mt-4 bg-[var(--terracotta)] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#a85638] transition-all"
                                    >
                                        Save Specifications
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {message && (
                        <p className={`text-center text-xs mt-3 ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
