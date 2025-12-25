'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion } from 'framer-motion';
import PremiumImage from '@/components/PremiumImage';
import { urlForImage } from '@/sanity/lib/image';

interface Feedback {
    _id: string;
    site: {
        _id: string;
        name: string;
        client: string;
        location: string;
    };
    workmanshipRating: number;
    materialRating: number;
    serviceRating: number;
    comments: string;
    siteImages: any[];
    _createdAt: string;
}

export default function FeedbackAnalytics() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        try {
            const query = `*[_type == "feedback"] | order(_createdAt desc) {
                _id,
                workmanshipRating,
                materialRating,
                serviceRating,
                comments,
                siteImages,
                _createdAt,
                site->{
                    _id,
                    name,
                    client,
                    location
                }
            }`;
            const data = await client.fetch(query);
            setFeedbacks(data);
        } catch (error) {
            console.error('Failed to fetch feedback', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Helper to calculate averages
    const calculateAverage = (key: 'workmanshipRating' | 'materialRating' | 'serviceRating') => {
        if (feedbacks.length === 0) return 0;
        const sum = feedbacks.reduce((acc, curr) => acc + (curr[key] || 0), 0);
        return (sum / feedbacks.length).toFixed(1);
    };

    const overallRating = feedbacks.length > 0
        ? (feedbacks.reduce((acc, curr) => acc + curr.workmanshipRating + curr.materialRating + curr.serviceRating, 0) / (feedbacks.length * 3)).toFixed(1)
        : '0.0';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--terracotta)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-[var(--ink)]">Customer Voice</h1>
                    <p className="text-gray-500 mt-2">Feedback & Sentiment Analysis</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Overall Success Score</span>
                    <span className="text-2xl font-bold text-[var(--terracotta)]">⭐ {overallRating}/5</span>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Workmanship', value: calculateAverage('workmanshipRating'), icon: '🔨', color: 'bg-blue-50 text-blue-700' },
                    { label: 'Material Quality', value: calculateAverage('materialRating'), icon: '🧱', color: 'bg-orange-50 text-orange-700' },
                    { label: 'Service Experience', value: calculateAverage('serviceRating'), icon: '🤝', color: 'bg-emerald-50 text-emerald-700' },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="text-3xl font-bold text-[var(--ink)]">{stat.value}</span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</h3>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${stat.color.split(' ')[0].replace('50', '500')}`}
                                style={{ width: `${(parseFloat(stat.value as string) / 5) * 100}%` }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Reviews Feed */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-[var(--ink)] mb-6 font-serif">Recent Feedback</h2>
                <div className="space-y-6">
                    {feedbacks.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 italic">No feedback received yet.</div>
                    ) : (
                        feedbacks.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-[var(--ink)] text-lg">{item.site?.client || 'Anonymous Client'}</h3>
                                        <p className="text-sm text-gray-500">{item.site?.name} • {item.site?.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-mono text-gray-400 mb-1">
                                            {new Date(item._createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="flex gap-1 text-[var(--terracotta)] text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < Math.round((item.workmanshipRating + item.materialRating + item.serviceRating) / 3) ? 'opacity-100' : 'opacity-20'}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {item.comments && (
                                    <p className="text-gray-600 italic mb-4">"{item.comments}"</p>
                                )}

                                {/* Ratings Breakdown */}
                                <div className="flex gap-4 text-xs font-mono text-gray-400 mb-4">
                                    <span className="bg-white px-2 py-1 rounded border">🔨 Work: {item.workmanshipRating}/5</span>
                                    <span className="bg-white px-2 py-1 rounded border">🧱 Mat: {item.materialRating}/5</span>
                                    <span className="bg-white px-2 py-1 rounded border">🤝 Svc: {item.serviceRating}/5</span>
                                </div>

                                {item.siteImages && item.siteImages.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                        {item.siteImages.map((img: any, i: number) => (
                                            <div key={i} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-gray-200 group-hover:scale-105 transition-transform">
                                                <PremiumImage
                                                    src={urlForImage(img).url()}
                                                    alt={`Feedback photo ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
