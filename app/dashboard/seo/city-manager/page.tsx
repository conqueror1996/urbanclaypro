
'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';

export default function CityManagerPage() {
    const [cities, setCities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all city pages from Sanity (sorted by name)
        client.fetch(`*[_type == "cityPage"] | order(name asc)`).then(data => {
            setCities(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-8">Loading Local SEO Data...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-[#1a1512]">Local SEO Manager</h2>
                    <p className="text-gray-500 mt-1">Optimize landing pages for Mumbai, Delhi, and other key markets.</p>
                </div>
                <Link
                    href="/studio/structure/cityPage"
                    target="_blank"
                    className="bg-black text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-gray-800 transition-colors"
                >
                    Edit in Studio
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city) => (
                    <div key={city._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold font-serif">{city.name}</h3>
                                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">{city.region} Region</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${city.metaDescription ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'}`}>
                                {city.metaDescription ? 'Optimized' : 'Missing Meta'}
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="text-sm">
                                <span className="text-gray-400 text-xs uppercase font-bold block mb-1">Target Keywords</span>
                                <div className="flex flex-wrap gap-2">
                                    {city.areasServed?.slice(0, 3).map((area: string) => (
                                        <span key={area} className="bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">{area}</span>
                                    ))}
                                    {city.areasServed?.length > 3 && <span className="text-xs text-gray-400">+{city.areasServed.length - 3} more</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                            <a href={`/${city.slug.current}`} target="_blank" className="text-gray-400 hover:text-black text-sm font-medium">View Live →</a>
                            <Link href={`/studio/structure/cityPage;${city._id}`} target="_blank" className="text-[var(--terracotta)] font-bold text-sm hover:underline">Edit Content</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
