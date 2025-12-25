'use client';

import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { motion } from 'framer-motion';

export default function FeedbackPage({ params }: { params: { siteId: string } }) {
    const [siteData, setSiteData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        workmanship: 0,
        material: 0,
        service: 0,
        comments: '',
        images: [] as any[]
    });

    useEffect(() => {
        const fetchSite = async () => {
            const query = `*[_type == "site" && _id == "${params.siteId}"][0]{ name, client, location }`;
            const data = await client.fetch(query);
            setSiteData(data);
            setLoading(false);
        };
        fetchSite();
    }, [params.siteId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setUploading(true);
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
            setForm({ ...form, images: [...form.images, ...uploadedAssets] });
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/feedback/submit', {
                method: 'POST',
                body: JSON.stringify({
                    siteId: params.siteId,
                    ...form
                })
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Feedback submission failed', error);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50">Loading project details...</div>;

    if (submitted) return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--ink)] text-white p-6">
            <div className="text-center space-y-4">
                <div className="text-6xl mb-6">✅</div>
                <h1 className="text-4xl font-serif">Thank You!</h1>
                <p className="opacity-80 max-w-md mx-auto">Your feedback helps Urban Clay verify quality standards for future projects. We appreciate your time.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-0">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                    <img src="/logo-black.svg" className="h-10 mx-auto mb-6 opacity-80" alt="Urban Clay" />
                    <h1 className="text-3xl font-serif text-[var(--ink)]">Project Completion Feedback</h1>
                    <p className="text-gray-500 mt-2">Inviting feedback for <strong>{siteData?.name}</strong></p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 space-y-8"
                    onSubmit={handleSubmit}
                >
                    {['Workmanship', 'Material Quality', 'Service & Communication'].map((category, idx) => {
                        const key = category === 'Workmanship' ? 'workmanship' : category === 'Material Quality' ? 'material' : 'service';
                        return (
                            <div key={idx} className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-widest text-gray-500">{category}</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setForm({ ...form, [key]: star })}
                                            className={`text-3xl transition-transform hover:scale-110 ${(form as any)[key] >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-widest text-gray-500">Upload Site Photos</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="text-4xl mb-2 opacity-30">📸</div>
                            <p className="text-sm font-bold text-gray-600">
                                {uploading ? 'Uploading...' : form.images.length > 0 ? `${form.images.length} photos added` : 'Tap to upload finished site photos'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-widest text-gray-500">Additional Comments</label>
                        <textarea
                            value={form.comments}
                            onChange={e => setForm({ ...form, comments: e.target.value })}
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-[var(--terracotta)]/20 outline-none"
                            placeholder="Describe your experience..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || form.workmanship === 0}
                        className="w-full bg-[var(--terracotta)] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#a85638] transition-all disabled:opacity-50"
                    >
                        Submit Feedback
                    </button>
                </motion.form>
            </div>
        </div>
    );
}
