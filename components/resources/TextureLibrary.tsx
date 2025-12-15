import Image from 'next/image';

interface Texture {
    _id: string;
    title: string;
    previewUrl: string;
    downloadUrl: string;
}

export default function TextureLibrary({ textures = [] }: { textures: Texture[] }) {

    // Fallback data: Using high-fidelity architectural close-ups instead of generic patterns
    const displayItems = textures.length > 0 ? textures : [
        { _id: '1', title: 'Antiqued Red Handform', previewUrl: 'https://images.unsplash.com/photo-1628198640822-7776b059f333?q=80&w=2400&auto=format&fit=crop', downloadUrl: 'https://images.unsplash.com/photo-1628198640822-7776b059f333?q=80&w=2400&auto=format&fit=crop' },
        { _id: '2', title: 'Carbon Linear Cladding', previewUrl: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=2400&auto=format&fit=crop', downloadUrl: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=2400&auto=format&fit=crop' },
        { _id: '3', title: 'Raw Earth Terracotta', previewUrl: 'https://images.unsplash.com/photo-1598336306354-159954752ac5?q=80&w=2400&auto=format&fit=crop', downloadUrl: 'https://images.unsplash.com/photo-1598336306354-159954752ac5?q=80&w=2400&auto=format&fit=crop' },
        { _id: '4', title: 'Limewashed Brick', previewUrl: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2400&auto=format&fit=crop', downloadUrl: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2400&auto=format&fit=crop' },
    ];

    return (
        <div className="py-12 border-t border-white/5">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-[var(--terracotta)] font-mono text-xs tracking-widest uppercase mb-4 block">
                        Resource Archive
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                        Material <span className="italic text-neutral-500">Systems</span>
                    </h2>
                </div>
                <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
                    High-fidelity PBR scan data for architectural visualization.
                    Calibrated for standard render engines including V-Ray, Corona, and Cycles.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {displayItems.map((tex, i) => (
                    <div key={tex._id} className="group flex flex-col gap-5 cursor-pointer">

                        {/* Image Container - Clean, No Overlay */}
                        <div className="relative aspect-[4/5] w-full bg-[#111] overflow-hidden border border-white/10 transition-colors duration-500 group-hover:border-white/30">
                            <Image
                                src={tex.previewUrl}
                                alt={tex.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 25vw"
                                className="object-cover opacity-90 grayscale-[20%] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                loading="lazy"
                            />

                            {/* Technical Badge - Corner */}
                            <div className="absolute top-0 right-0 p-3 opacity-100">
                                <span className="bg-black/80 backdrop-blur-sm text-white text-[9px] font-mono uppercase tracking-widest px-2 py-1 border border-white/10">
                                    4K Scan
                                </span>
                            </div>
                        </div>

                        {/* Metadata Below Image */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-start border-b border-white/10 pb-3 group-hover:border-white/30 transition-colors">
                                <h3 className="text-lg font-serif text-white leading-none group-hover:text-[var(--terracotta)] transition-colors">
                                    {tex.title}
                                </h3>
                                <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mt-1">
                                    TEX-{String(i + 1).padStart(2, '0')}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-neutral-500 font-medium">
                                    High-Res JPG
                                </span>
                                <a
                                    href={tex.downloadUrl || tex.previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 group/btn"
                                >
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white group-hover/btn:text-[var(--terracotta)] transition-colors">
                                        Download
                                    </span>
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="transform group-hover/btn:translate-y-1 transition-transform text-neutral-400 group-hover/btn:text-[var(--terracotta)]"
                                    >
                                        <path d="M12 5v14M5 12l7 7 7-7" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
