'use client';

import React from 'react';

interface Texture {
    _id: string;
    title: string;
    previewUrl: string;
    downloadUrl: string;
}

export default function TextureLibrary({ textures = [] }: { textures: any[] }) {

    // Fallback data: Using high-fidelity architectural close-ups instead of generic patterns
    const displayItems = textures.length > 0 ? textures : [
        { _id: '1', title: 'Antiqued Red Handform', previewUrl: 'https://images.unsplash.com/photo-1628198640822-7776b059f333?q=80&w=800&auto=format&fit=crop', downloadUrl: '#' },
        { _id: '2', title: 'Carbon Linear Cladding', previewUrl: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=800&auto=format&fit=crop', downloadUrl: '#' },
        { _id: '3', title: 'Raw Earth Terracotta', previewUrl: 'https://images.unsplash.com/photo-1598336306354-159954752ac5?q=80&w=800&auto=format&fit=crop', downloadUrl: '#' },
        { _id: '4', title: 'Limewashed Brick', previewUrl: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=800&auto=format&fit=crop', downloadUrl: '#' },
    ];

    return (
        <div className="py-12">
            <div className="mb-12">
                <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-3 block">Digital Library</span>
                <h2 className="text-3xl md:text-4xl font-serif text-white">Seamless Textures (4K)</h2>
                <p className="text-white/60 mt-4 max-w-2xl">
                    High-fidelity PBR scan data for architectural visualization. Includes Albedo, Normal, Roughness, and Displacement maps.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {displayItems.map((tex) => (
                    <div key={tex._id} className="group relative aspect-square bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden cursor-pointer">

                        {/* Texture Image */}
                        <img
                            src={tex.previewUrl}
                            alt={tex.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                            <h3 className="text-white font-serif text-lg mb-4">{tex.title}</h3>
                            <button className="bg-[var(--terracotta)] text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#a85638] transition-colors">
                                Download ZIP
                            </button>
                            <span className="text-white/40 text-[9px] font-mono mt-4 uppercase">4K / PBR / 85MB</span>
                        </div>

                        {/* Corner Badge */}
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono text-white/70 uppercase">
                            Seamless
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
