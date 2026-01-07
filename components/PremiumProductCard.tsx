'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';
import { useState } from 'react';

interface PremiumProductCardProps {
    product: Product;
    variant: any;
    index: number;
}

export default function PremiumProductCard({ product, variant, index }: PremiumProductCardProps) {
    const { addToBox, box, isInBox, setBoxOpen } = useSampleBox();
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Utility to clean strings for slugs
    const toSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

    const handleAddSample = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const uniqueId = `${product.slug}-${toSlug(variant.name)}`;

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
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#241e1a] mb-5 border border-white/5 group-hover:border-[var(--terracotta)]/30 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_60px_rgba(180,90,60,0.15)]">
                    {variant.imageUrl ? (
                        <Image
                            src={variant.imageUrl}
                            alt={`${product.title} ${variant.name}`}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/10 text-[10px] tracking-[0.2em] font-mono uppercase">
                            Visual Pending
                        </div>
                    )}

                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

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
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                            <ArrowUpRight className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-500" />
                        </div>
                    </div>
                </div>

                {/* Info Text */}
                <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
                    <h4 className="text-base font-serif text-[#EBE5E0] mb-1 group-hover:text-white transition-colors">{variant.name}</h4>
                    <p className="text-[10px] text-[var(--terracotta)] font-bold uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100">
                        {product.title}
                    </p>
                </div>
            </Link>

            {/* Action Palette (Floating over the card) */}
            <div className="absolute bottom-20 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-30">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleAddSample}
                        className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-[var(--terracotta)] hover:border-[var(--terracotta)] transition-all active:scale-95 group/btn shadow-xl"
                        title="Add to Sample Tray"
                    >
                        <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                    </button>
                    <button
                        onClick={handleWhatsAppShare}
                        className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all active:scale-95 shadow-xl"
                        title="Share on WhatsApp"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
