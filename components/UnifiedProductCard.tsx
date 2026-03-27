'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';
import { useState } from 'react';

interface UnifiedProductCardProps {
    product: Product;
    variant: any;
    index: number;
}

export default function UnifiedProductCard({ product, variant, index }: UnifiedProductCardProps) {
    const { addToBox, box, isInBox, setBoxOpen } = useSampleBox();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const isSampleDisabled = product.category?.slug === 'facades' || product.tag === 'Terracotta Panels';

    // Utility to clean strings for slugs
    const toSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

    const handleAddSample = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const uniqueId = `${product.slug}-${variant.name}`;

        if (isInBox(uniqueId)) {
            setBoxOpen(true);
            return;
        }

        if (box.length >= 5) {
            setBoxOpen(true);
            return;
        }

        addToBox({
            id: uniqueId,
            name: `${product.title} - ${variant.name}`,
            color: '#b45a3c',
            texture: variant.imageUrl ? `url('${variant.imageUrl}')` : '#b45a3c'
        });

        // Open the modal immediately for visual feedback
        setBoxOpen(true);
    };

    const handleWhatsAppShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const url = `https://claytile.in/products/${product.category?.slug || 'collection'}/${product.slug}${variant.name !== 'Standard' ? `?variant=${encodeURIComponent(variant.name)}` : ''}`;
        const text = `Check out the *${variant.name} ${product.title}* from *UrbanClay India*.\n\nPremium terracotta architectural material.\n\nView Details: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const variantLink = `/products/${product.category?.slug || 'collection'}/${product.slug}${variant.name !== 'Standard' ? `?variant=${encodeURIComponent(variant.name)}` : ''}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
        >
            <Link
                href={variantLink}
                className="block relative overflow-hidden"
            >
                {/* Visual Card Container */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-transparent mb-4 transition-all duration-700">
                    {variant.imageUrl ? (
                        <Image
                            src={variant.imageUrl}
                            alt={`${product.title} ${variant.name} Flexible Brick Tile & Exposed Terracotta Panel - UrbanClay India`}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--foreground)]/10 text-[10px] tracking-[0.2em] font-mono uppercase">
                            Visual Pending
                        </div>
                    )}

                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />

                    {/* Variant Badge */}
                    {variant.badge && (
                        <div className="absolute top-4 left-4 z-20">
                            <span className="px-3 py-1 bg-[var(--terracotta)] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                                {variant.badge}
                            </span>
                        </div>
                    )}

                    {/* Indicator Icon */}
                    <div className="absolute top-4 right-4 z-20">
                        <div className="w-8 h-8 rounded-full bg-[var(--background)]/40 backdrop-blur-xl border border-[var(--line)] flex items-center justify-center">
                            <ArrowUpRight className="w-4 h-4 text-[var(--foreground)] group-hover:rotate-45 transition-transform duration-500" />
                        </div>
                    </div>

                    {/* Action Palette */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
                        {!isSampleDisabled && (
                            <button
                                onClick={handleAddSample}
                                className="w-8 h-8 rounded-lg bg-white/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--terracotta)] hover:border-[var(--terracotta)] hover:text-white transition-all active:scale-90 group/btn shadow-lg pointer-events-auto"
                                title="Add to Sample Tray"
                            >
                                <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                            </button>
                        )}
                        <button
                            onClick={handleWhatsAppShare}
                            className="w-8 h-8 rounded-lg bg-white/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[var(--foreground)] hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all active:scale-90 shadow-lg ml-auto pointer-events-auto"
                            title="Share on WhatsApp"
                        >
                            <MessageCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Info Text */}
                <div className="relative z-10 px-1 transition-transform duration-500 group-hover:-translate-y-1">
                    <h4 className="text-sm md:text-base font-serif text-[var(--foreground)] mb-1 group-hover:text-[var(--terracotta)] transition-colors">{variant.name}</h4>
                    <p className="text-[9px] text-[var(--foreground)]/70 font-bold uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 truncate">
                        {product.title}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
