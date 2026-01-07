'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion, AnimatePresence } from 'framer-motion';

interface Entity {
    _id: string;
    _type: 'manufacturer' | 'vendor' | 'labour' | 'site';
    name: string;
    title?: string;
    category?: string;
    trade?: string;
    location?: string;
    status?: string;
    phone?: string;
    companyName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientJob?: string;
    clientProfile?: string;
    contactTechnical?: string;
    experience?: number;
    projectCost?: number;
    documents?: any[];
    startDate?: string;
    expectedCompletion?: string;
    feedback?: {
        workmanshipRating: number;
        materialRating: number;
        serviceRating: number;
        comments: string;
        siteImages: any[];
    };
    products?: {
        product?: { title: string; _id: string };
        manualProductName?: string;
        purchaseCost: number;
    }[];
}

export default function OperationsHub() {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'manufacturer' | 'vendor' | 'labour' | 'site'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'manufacturer' | 'vendor' | 'labour' | 'site' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [uploadingFiles, setUploadingFiles] = useState(false);

    // Completion Flow State
    const [completionModalOpen, setCompletionModalOpen] = useState(false);
    const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
    const [selectedSiteEmail, setSelectedSiteEmail] = useState<string | null>(null);
    const [completionDate, setCompletionDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isCompleting, setIsCompleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [globalProducts, setGlobalProducts] = useState<{ _id: string, title: string }[]>([]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const query = `{
                "manufacturers": *[_type == "manufacturer"] | order(_createdAt desc) { 
                    _id, _type, name, location, rating, phone,
                    products[] {
                        "product": product->{ title, _id },
                        manualProductName,
                        purchaseCost
                    }
                },
                "vendors": *[_type == "vendor"] | order(_createdAt desc) { _id, _type, name, companyName, category, status, phone },
                "labours": *[_type == "labour"] | order(_createdAt desc) { _id, _type, name, trade, status, phone, dailyRate, experience, projectCost, documents },
                "sites": *[_type == "site"] | order(_createdAt desc) { 
                    _id, _type, name, location, status, client, clientEmail, clientPhone, clientJob, clientProfile, contactTechnical, startDate, expectedCompletion,
                    "feedback": *[_type == "feedback" && site._ref == ^._id][0] { workmanshipRating, materialRating, serviceRating, comments, siteImages }
                }
            }`;
            const data = await client.fetch(query);

            const combined: Entity[] = [
                ...data.manufacturers,
                ...data.vendors,
                ...data.labours,
                ...data.sites
            ];

            setEntities(combined);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            const res = await fetch('/api/operations/delete', {
                method: 'POST',
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setEntities(entities.filter(e => e._id !== id));
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const url = formData._id ? '/api/operations/update' : '/api/operations/create';

            // Clean and transform data
            let submissionData = { ...formData };
            if (modalType === 'manufacturer' && submissionData.products) {
                submissionData.products = submissionData.products
                    .filter((p: any) => p.product?._id || p.manualProductName)
                    .map((p: any) => ({
                        _key: p._key || Math.random().toString(36).substr(2, 9),
                        product: p.product?._id ? { _type: 'reference', _ref: p.product._id } : undefined,
                        manualProductName: p.manualProductName || undefined,
                        purchaseCost: p.purchaseCost
                    }));
            }

            const body = formData._id
                ? { id: formData._id, data: { ...submissionData, _id: undefined, _type: undefined, _createdAt: undefined, _updatedAt: undefined, _rev: undefined } }
                : { type: modalType, data: submissionData };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({});
                fetchAll();
            }
        } catch (error) {
            console.error('Submit failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchAll();
        const fetchGlobalProducts = async () => {
            const prod = await client.fetch(`*[_type == "product"] { _id, title }`);
            setGlobalProducts(prod);
        };
        fetchGlobalProducts();
    }, []);

    const filtered = entities.filter(e => {
        const matchesSearch = e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e as any).companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' ? true : e._type === activeTab;
        return matchesSearch && matchesTab;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'manufacturer': return '🏭';
            case 'vendor': return '🤝';
            case 'labour': return '👷';
            case 'site': return '🏗️';
            default: return '📄';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'manufacturer': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'vendor': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'labour': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'site': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 relative">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-[150] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--ink)]">Operations Hub</h1>
                    <p className="text-gray-500 mt-1">Unified view of Manufacturers, Vendors, Labours, and Sites.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative group">
                        <button className="bg-[var(--terracotta)] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20 hover:bg-[#a85638] transition-all active:scale-95">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                            Quick Add
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                            {[
                                { label: 'Manufacturer', type: 'manufacturer', icon: '🏭' },
                                { label: 'Vendor', type: 'vendor', icon: '🤝' },
                                { label: 'Labour Force', type: 'labour', icon: '👷' },
                                { label: 'Ongoing Site', type: 'site', icon: '🏗️' }
                            ].map((item) => (
                                <button
                                    key={item.type}
                                    onClick={() => {
                                        setModalType(item.type as any);
                                        setFormData({});
                                        setIsModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[var(--terracotta)] transition-colors"
                                >
                                    <span>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-[var(--terracotta)] focus:ring-4 focus:ring-[var(--terracotta)]/5 w-full md:w-64 transition-all shadow-sm"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                {[
                    { id: 'all', label: 'All Resources', icon: '💎' },
                    { id: 'manufacturer', label: 'Manufacturers', icon: '🏭' },
                    { id: 'vendor', label: 'Vendors', icon: '🤝' },
                    { id: 'labour', label: 'Labour Force', icon: '👷' },
                    { id: 'site', label: 'Ongoing Sites', icon: '🏗️' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border
                            ${activeTab === tab.id
                                ? 'bg-[var(--ink)] text-white border-[var(--ink)] shadow-lg shadow-black/10 scale-105'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}
                        `}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                        <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                            {tab.id === 'all' ? entities.length : entities.filter(e => e._type === tab.id).length}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((entity, index) => (
                            <motion.div
                                key={entity._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.02 }}
                                className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between min-h-[220px]"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform ${getTypeColor(entity._type)}`}>
                                            {getTypeIcon(entity._type)}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDelete(entity._id)}
                                                className="p-2 bg-red-50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getTypeColor(entity._type)}`}>
                                                {entity._type}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-[var(--ink)] mb-1 group-hover:text-[var(--terracotta)] transition-colors line-clamp-1">{entity.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1.5 opacity-80">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                        {entity.location || (entity as any).companyName || 'Resource Asset'}
                                    </p>
                                </div>

                                {entity._type === 'manufacturer' && entity.products && entity.products.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Manufacturer Product Catalog</p>
                                        <div className="bg-indigo-50/30 rounded-2xl border border-indigo-100/50 overflow-hidden">
                                            {entity.products.map((item, i) => (
                                                <div key={i} className={`flex justify-between items-center p-3 ${i !== entity.products!.length - 1 ? 'border-b border-indigo-100/30' : ''}`}>
                                                    <span className="text-[11px] font-bold text-gray-700 truncate max-w-[140px]">
                                                        {item.product?.title || item.manualProductName || 'Unknown Product'}
                                                    </span>
                                                    <span className="text-[11px] font-black text-indigo-600">Rate: ₹{item.purchaseCost?.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {entity._type === 'labour' && (
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div className="bg-orange-50/50 p-2 rounded-xl">
                                            <p className="text-[8px] font-bold text-orange-400 uppercase tracking-widest">Experience</p>
                                            <p className="text-sm font-bold text-orange-700">{entity.experience || 0} Years</p>
                                        </div>
                                        <div className="bg-emerald-50/50 p-2 rounded-xl">
                                            <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Project Cost</p>
                                            <p className="text-sm font-bold text-emerald-700">₹{entity.projectCost?.toLocaleString() || '-'}</p>
                                        </div>
                                    </div>
                                )}

                                {entity._type === 'site' && (
                                    <div className="mt-4 space-y-3">
                                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Client</p>
                                                <p className="text-sm font-bold text-blue-900 leading-tight">{(entity as any).client}</p>
                                                {(entity as any).clientJob && <p className="text-[10px] text-blue-600 font-medium opacity-80">{(entity as any).clientJob}</p>}
                                            </div>
                                            <div className="bg-white p-2 rounded-full shadow-sm text-lg">👤</div>
                                        </div>

                                        {(entity as any).startDate && (entity as any).expectedCompletion && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                    <span>Progression</span>
                                                    <span>
                                                        {(() => {
                                                            const start = new Date(entity.startDate!).getTime();
                                                            const end = new Date(entity.expectedCompletion!).getTime();
                                                            const now = new Date().getTime();
                                                            const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
                                                            return entity.status === 'completed' ? '100%' : `${Math.round(progress)}%`;
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${entity.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        style={{ width: entity.status === 'completed' ? '100%' : `${Math.min(100, Math.max(0, ((new Date().getTime() - new Date(entity.startDate!).getTime()) / (new Date(entity.expectedCompletion!).getTime() - new Date(entity.startDate!).getTime())) * 100))}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[9px] font-medium text-gray-500 font-mono">
                                                    <span>{new Date(entity.startDate!).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                    <span className="text-right">{new Date(entity.expectedCompletion!).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1">
                                            {/* Dynamic small tags based on type */}
                                            {entity._type === 'manufacturer' && entity.products && entity.products.length > 0 && (
                                                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                    {entity.products.length} SKUs
                                                </span>
                                            )}
                                            {entity._type === 'labour' && <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">{entity.trade}</span>}
                                            {entity._type === 'vendor' && <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">{entity.category?.replace('_', ' ')}</span>}
                                            {entity._type === 'site' && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${entity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {entity.status === 'completed'
                                                        ? (entity.feedback
                                                            ? `⭐ ${((entity.feedback.workmanshipRating + entity.feedback.materialRating + entity.feedback.serviceRating) / 3).toFixed(1)}/5`
                                                            : 'Waiting for Feedback')
                                                        : (entity as any).client
                                                    }
                                                </span>
                                            )}
                                        </div>
                                        {entity.documents && entity.documents.length > 0 && (
                                            <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                {entity.documents.length}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {entity._type === 'site' && (
                                            <div
                                                onClick={() => {
                                                    if (entity.status !== 'completed') {
                                                        setSelectedSiteId(entity._id);
                                                        setSelectedSiteEmail(entity.clientEmail || '');
                                                        setCompletionModalOpen(true);
                                                    }
                                                }}
                                                className={`
                                                    relative w-12 h-7 rounded-full transition-colors cursor-pointer flex items-center px-1
                                                    ${entity.status === 'completed' ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'}
                                                `}
                                                title={entity.status === 'completed' ? 'Project Completed' : 'Mark as Completed'}
                                            >
                                                <div
                                                    className={`
                                                        w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
                                                        ${entity.status === 'completed' ? 'translate-x-5' : 'translate-x-0'}
                                                    `}
                                                />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => {
                                                setModalType(entity._type);
                                                setFormData(entity);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 bg-gray-50 hover:bg-[var(--terracotta)] hover:text-white rounded-xl transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                            <div className="text-5xl mb-4 text-gray-200">🔍</div>
                            <h3 className="text-xl font-serif text-gray-400">No matching operations found</h3>
                            <p className="text-sm text-gray-300">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="relative w-full max-w-lg h-full bg-white shadow-2xl p-10 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)]">Management Suite</span>
                                    <h2 className="text-3xl font-serif text-[var(--ink)]">{formData._id ? `Edit ${modalType}` : `New ${modalType}`}</h2>
                                </div>
                                <button onClick={() => { setIsModalOpen(false); setFormData({}); }} className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Display Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter name..."
                                            value={formData.name || ''}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                        />
                                    </div>

                                    {modalType === 'manufacturer' && (
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Product Catalog & Purchase Rates (₹)</label>
                                            <div className="space-y-2">
                                                {formData.products?.map((item: any, i: number) => (
                                                    <div key={i} className="flex flex-col gap-2 bg-gray-50 p-3 rounded-xl">
                                                        <div className="flex gap-2 items-center">
                                                            <select
                                                                value={item.product?._id || (item.manualProductName ? 'manual' : '')}
                                                                onChange={e => {
                                                                    const newProducts = [...formData.products];
                                                                    const val = e.target.value;
                                                                    if (val === 'manual') {
                                                                        newProducts[i] = { ...item, product: undefined, manualProductName: item.manualProductName || '' };
                                                                    } else {
                                                                        const selected = globalProducts.find(p => p._id === val);
                                                                        newProducts[i] = { ...item, product: { _id: val, title: selected?.title || '' }, manualProductName: undefined };
                                                                    }
                                                                    setFormData({ ...formData, products: newProducts });
                                                                }}
                                                                className="flex-1 bg-white border-none rounded-lg p-2 text-xs outline-none"
                                                            >
                                                                <option value="">Select Product</option>
                                                                {globalProducts.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                                                                <option value="manual">Enter Manually...</option>
                                                            </select>
                                                            <input
                                                                type="number"
                                                                placeholder="Rate (₹)"
                                                                value={item.purchaseCost || ''}
                                                                onChange={e => {
                                                                    const newProducts = [...formData.products];
                                                                    newProducts[i] = { ...item, purchaseCost: parseFloat(e.target.value) };
                                                                    setFormData({ ...formData, products: newProducts });
                                                                }}
                                                                className="w-24 bg-white border-none rounded-lg p-2 text-xs outline-none font-bold text-indigo-600"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newProducts = formData.products.filter((_: any, idx: number) => idx !== i);
                                                                    setFormData({ ...formData, products: newProducts });
                                                                }}
                                                                className="p-2 text-red-500 hover:text-red-700"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                        {(item.manualProductName !== undefined || !item.product?._id) && (item.product?._id === undefined && item.manualProductName !== undefined) && (
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Product Name Manually"
                                                                value={item.manualProductName || ''}
                                                                onChange={e => {
                                                                    const newProducts = [...formData.products];
                                                                    newProducts[i] = { ...item, manualProductName: e.target.value };
                                                                    setFormData({ ...formData, products: newProducts });
                                                                }}
                                                                className="w-full bg-white border-none rounded-lg p-2 text-[10px] outline-none font-bold"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, products: [...(formData.products || []), { product: null, purchaseCost: 0 }] })}
                                                    className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                                                >
                                                    + Add Product to Portfolio
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {modalType === 'vendor' && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Company Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Lulu Tiles..."
                                                    value={formData.companyName || ''}
                                                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Category</label>
                                                <select
                                                    value={formData.category || ''}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none appearance-none"
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="raw_material">Raw Material</option>
                                                    <option value="equipment">Equipment</option>
                                                    <option value="logistics">Logistics</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {modalType === 'labour' && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Trade/Specialization</label>
                                                <input
                                                    type="text"
                                                    placeholder="Mason, Tiler, etc."
                                                    value={formData.trade || ''}
                                                    onChange={e => setFormData({ ...formData, trade: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Exp. (Years)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="5"
                                                        value={formData.experience || ''}
                                                        onChange={e => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Job Cost (₹)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="25000"
                                                        value={formData.projectCost || ''}
                                                        onChange={e => setFormData({ ...formData, projectCost: parseInt(e.target.value) })}
                                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Upload Documents / Work</label>
                                                <div className="relative group/upload">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={async (e) => {
                                                            const files = e.target.files;
                                                            if (!files) return;
                                                            setUploadingFiles(true);
                                                            try {
                                                                const uploadedAssets = [];
                                                                for (let i = 0; i < files.length; i++) {
                                                                    const asset = await client.assets.upload('image', files[i]);
                                                                    uploadedAssets.push({
                                                                        _key: Math.random().toString(36).substr(2, 9),
                                                                        _type: 'image',
                                                                        asset: { _type: 'reference', _ref: asset._id }
                                                                    });
                                                                }
                                                                setFormData({ ...formData, documents: uploadedAssets });
                                                            } catch (err) {
                                                                console.error('Upload failed:', err);
                                                            } finally {
                                                                setUploadingFiles(false);
                                                            }
                                                        }}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className={`border-2 border-dashed rounded-2xl p-4 text-center ${uploadingFiles ? 'bg-orange-50 animate-pulse' : 'bg-gray-50'}`}>
                                                        <span className="text-xs text-gray-500">{uploadingFiles ? 'Uploading...' : formData.documents?.length ? `${formData.documents.length} files attached` : 'Click to upload ID/Past work'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {modalType === 'site' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Client Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Name..."
                                                        value={formData.client || ''}
                                                        onChange={e => setFormData({ ...formData, client: e.target.value })}
                                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Client Profession</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Architect, Owner, etc."
                                                        value={formData.clientJob || ''}
                                                        onChange={e => setFormData({ ...formData, clientJob: e.target.value })}
                                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Client Email</label>
                                                    <input
                                                        type="email"
                                                        placeholder="email@example.com"
                                                        value={formData.clientEmail || ''}
                                                        onChange={e => setFormData({ ...formData, clientEmail: e.target.value })}
                                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Client Contact</label>
                                                    <input
                                                        type="text"
                                                        placeholder="+91..."
                                                        value={formData.clientPhone || ''}
                                                        onChange={e => setFormData({ ...formData, clientPhone: e.target.value })}
                                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Start Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.startDate || ''}
                                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none font-mono text-gray-600"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Expected Completion</label>
                                                    <input
                                                        type="date"
                                                        value={formData.expectedCompletion || ''}
                                                        onChange={e => setFormData({ ...formData, expectedCompletion: e.target.value })}
                                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none font-mono text-gray-600"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Site Engineer/Contractor Contact</label>
                                                <input
                                                    type="text"
                                                    placeholder="Supervisor Number..."
                                                    value={formData.contactTechnical || ''}
                                                    onChange={e => setFormData({ ...formData, contactTechnical: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Client Profile / Notes</label>
                                                <textarea
                                                    placeholder="Detailed client profile or project background..."
                                                    value={formData.clientProfile || ''}
                                                    onChange={e => setFormData({ ...formData, clientProfile: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none min-h-[100px] resize-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Location / Address</label>
                                        <input
                                            type="text"
                                            placeholder="City, State..."
                                            value={formData.location || ''}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                        />
                                    </div>

                                    {formData.feedback && (
                                        <div className="bg-orange-50 p-6 rounded-3xl space-y-4 border border-orange-100">
                                            <h3 className="font-serif text-lg text-orange-900 border-b border-orange-200 pb-2 mb-2">Client Feedback Data</h3>

                                            <div className="grid grid-cols-3 gap-2">
                                                {Object.entries({
                                                    'Work': formData.feedback.workmanshipRating,
                                                    'Material': formData.feedback.materialRating,
                                                    'Service': formData.feedback.serviceRating
                                                }).map(([key, val]) => (
                                                    <div key={key} className="text-center bg-white/50 p-2 rounded-xl">
                                                        <div className="text-[10px] uppercase font-bold text-orange-400">{key}</div>
                                                        <div className="text-xl font-bold text-orange-700">{val}/5</div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-orange-400 uppercase ml-2 tracking-widest">Client Comment</label>
                                                <div className="bg-white/60 p-4 rounded-xl text-sm text-orange-900 italic">
                                                    "{formData.feedback.comments || 'No written comments.'}"
                                                </div>
                                            </div>

                                            {formData.feedback.siteImages && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-white/50 p-3 rounded-xl">
                                                    <span className="text-lg">📸</span>
                                                    {formData.feedback.siteImages.length} Site Photos Uploaded by Client
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Phone / Contact</label>
                                        <input
                                            type="text"
                                            placeholder="+91..."
                                            value={formData.phone || ''}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[var(--ink)] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-[var(--terracotta)] shadow-[var(--terracotta)]/20 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Syncing with Hub...' : (formData._id ? 'Update Resource' : 'Create Resource')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Completion Date Modal */}
            <AnimatePresence>
                {completionModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCompletionModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                    🎉
                                </div>
                                <h3 className="text-2xl font-serif text-[var(--ink)]">Project Complete?</h3>
                                <p className="text-sm text-gray-500 mt-2">Specify the official completion date for records.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Completion Date</label>
                                    <input
                                        type="date"
                                        value={completionDate}
                                        onChange={(e) => setCompletionDate(e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-center font-bold text-gray-700 outline-none focus:ring-2 focus:ring-green-500/20"
                                    />
                                </div>

                                <button
                                    onClick={async () => {
                                        if (!selectedSiteId) return;
                                        try {
                                            const res = await fetch('/api/operations/complete-site', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    siteId: selectedSiteId,
                                                    clientEmail: selectedSiteEmail,
                                                    completionDate: completionDate
                                                })
                                            });
                                            const data = await res.json();

                                            if (data.success) {
                                                setCompletionModalOpen(false);
                                                if (data.emailSent) {
                                                    alert('Site marked complete. Feedback request email sent to client.');
                                                } else {
                                                    alert(`Site marked complete, BUT email failed to send: ${data.emailError || 'Unknown error'}. Check console/logs.`);
                                                }
                                                fetchAll();
                                            } else {
                                                alert(`Error: ${data.error || 'Failed to complete site'}`);
                                            }
                                        } catch (e) {
                                            console.error(e);
                                            alert('Network error');
                                        }
                                    }}
                                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20"
                                >
                                    Confirm & Send
                                </button>
                                <button
                                    onClick={() => setCompletionModalOpen(false)}
                                    className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 p-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
