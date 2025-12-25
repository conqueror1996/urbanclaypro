'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion } from 'framer-motion';

interface Manufacturer {
    _id: string;
    name: string;
    location?: string;
    capacity?: string;
    phone?: string;
    rating?: number;
}

export default function ManufacturersDashboard() {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchManufacturers = async () => {
        try {
            const query = `*[_type == "manufacturer"] | order(name asc)`;
            const data = await client.fetch(query);
            setManufacturers(data);
        } catch (error) {
            console.error('Error fetching manufacturers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManufacturers();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-[var(--ink)]">Manufacturers</h1>
                <p className="text-gray-500 mt-1">Manage production partners and factories.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--terracotta)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {manufacturers.map((m) => (
                        <div key={m._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                                    🏭
                                </div>
                                <div className="flex items-center gap-1 text-orange-400">
                                    {Array.from({ length: m.rating || 0 }).map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--ink)] mb-1">{m.name}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">{m.location || 'Location Not Set'}</p>

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Monthly Capacity:</span>
                                    <span className="font-medium text-[var(--ink)]">{m.capacity || '--'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Contact:</span>
                                    <span className="font-medium text-[var(--ink)]">{m.phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {manufacturers.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-500">
                            No manufacturers found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
