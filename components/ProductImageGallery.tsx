'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PremiumImage from './PremiumImage';
import { motion, AnimatePresence } from 'framer-motion';

interface Variant {
    name: string;
    imageUrl: string;
    gallery?: string[];
}

interface Collection {
    name: string;
    variants: {
        name: string;
        imageUrl: string;
        gallery?: string[];
    }[];
}

interface ProductImageGalleryProps {
    images: string[];
    variants?: Variant[];
    collections?: Collection[];
    title: string;
    initialVariantName?: string;
    onCollectionChange?: (collectionName: string) => void;
}

export default function ProductImageGallery({ images = [], variants = [], collections, title, initialVariantName, onCollectionChange }: ProductImageGalleryProps) {
    // State to hold the currently displayed set of images (Main product images OR Variant specific images)
    const [currentImages, setCurrentImages] = useState<string[]>(images);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [activeCollection, setActiveCollection] = useState<string>(collections?.[0]?.name || '');
    const [direction, setDirection] = useState(0);

    // Helper to get images for a variant
    const getVariantImages = (variant: { imageUrl: string; gallery?: string[] }) => {
        const imgs = [variant.imageUrl];
        if (variant.gallery && variant.gallery.length > 0) {
            imgs.push(...variant.gallery);
        }
        return imgs;
    };

    // Set initial image and active collection based on props or initialVariantName
    useEffect(() => {
        let found = false;

        // 1. Try to find in Collections first
        if (initialVariantName && collections) {
            for (const collection of collections) {
                const variant = collection.variants.find(v => v.name === initialVariantName);
                if (variant && variant.imageUrl) {
                    const variantImages = getVariantImages(variant);
                    setCurrentImages(variantImages);
                    setSelectedImage(variantImages[0]);
                    setActiveCollection(collection.name);
                    if (onCollectionChange) onCollectionChange(collection.name);
                    found = true;
                    break;
                }
            }
        }

        // 2. Try to find in standard Variants if not found yet
        if (!found && initialVariantName && variants) {
            const variant = variants.find(v => v.name === initialVariantName);
            if (variant && variant.imageUrl) {
                const variantImages = getVariantImages(variant);
                setCurrentImages(variantImages);
                setSelectedImage(variantImages[0]);
                found = true;
            }
        }

        // 3. Fallback to default logic if no initial variant found
        if (!found) {
            if (images && images.length > 0) {
                setCurrentImages(images);
                setSelectedImage(images[0]);
            }
            if (collections && collections.length > 0) {
                setActiveCollection(collections[0].name);
                if (onCollectionChange) onCollectionChange(collections[0].name);
            }
        }
    }, [images, collections, variants, initialVariantName]);

    // Update selected image when switching collections manually
    const handleCollectionChange = (collectionName: string) => {
        setActiveCollection(collectionName);
        if (onCollectionChange) onCollectionChange(collectionName);

        // Optional: Reset to main images or first variant of collection?
        // For now, let's keep current images unless user clicks a variant.
        // Or, if we want to be smart, we could show the first variant of the new collection.
        if (collections) {
            const collection = collections.find(c => c.name === collectionName);
            if (collection && collection.variants.length > 0 && collection.variants[0].imageUrl) {
                const variant = collection.variants[0];
                const variantImages = getVariantImages(variant);
                setCurrentImages(variantImages);
                setDirection(1);
                setSelectedImage(variantImages[0]);
            }
        }
    };

    const handleVariantClick = (variant: { imageUrl: string; gallery?: string[] }) => {
        if (!variant.imageUrl) return;
        const variantImages = getVariantImages(variant);
        setCurrentImages(variantImages);
        setDirection(1);
        setSelectedImage(variantImages[0]);
    };

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const currentIndex = currentImages.indexOf(selectedImage);
        let nextIndex = 0;

        if (currentIndex !== -1) {
            nextIndex = (currentIndex + 1) % currentImages.length;
        }

        setDirection(1);
        setSelectedImage(currentImages[nextIndex]);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const currentIndex = currentImages.indexOf(selectedImage);
        let prevIndex = currentImages.length - 1;

        if (currentIndex !== -1) {
            prevIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        }

        setDirection(-1);
        setSelectedImage(currentImages[prevIndex]);
    };

    // Determine which variants to show
    const displayVariants = collections && collections.length > 0
        ? collections.find(c => c.name === activeCollection)?.variants || []
        : variants;

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div>
            {/* MAIN HERO IMAGE SLIDER */}
            <div className="w-full h-64 md:h-96 bg-[#e7dbd1] rounded-xl overflow-hidden relative shadow-xl ring-1 ring-black/5 group">
                <AnimatePresence initial={false} custom={direction}>
                    {selectedImage ? (
                        <motion.div
                            key={selectedImage}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <PremiumImage
                                src={selectedImage}
                                alt={title}
                                fill
                                className="object-cover"
                                containerClassName="w-full h-full"
                                sizes="(max-width: 768px) 100vw, 66vw"
                                priority
                            />
                        </motion.div>
                    ) : (
                        <div className="w-full h-full bg-[#e7dbd1] flex items-center justify-center text-[#a89f99]">
                            No Image Available
                        </div>
                    )}
                </AnimatePresence>

                {/* Navigation Arrows */}
                {currentImages.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-[#2A1E16] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-lg z-10"
                            aria-label="Previous Image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-[#2A1E16] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-lg z-10"
                            aria-label="Next Image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </>
                )}
            </div>

            {/* THUMBNAILS ROW */}
            {currentImages.length > 1 && (
                <div className="flex gap-2 mt-2 md:mt-3 overflow-x-auto pb-1 scrollbar-hide">
                    {currentImages.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setDirection(i > currentImages.indexOf(selectedImage) ? 1 : -1);
                                setSelectedImage(img);
                            }}
                            className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all relative ${selectedImage === img ? 'border-[var(--terracotta)] opacity-100 ring-1 ring-[var(--terracotta)]' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <PremiumImage src={img} alt={`View ${i + 1}`} fill className="object-cover" containerClassName="w-full h-full" sizes="64px" />
                        </div>
                    ))}
                </div>
            )}

            {/* COLLECTIONS TABS */}
            {collections && collections.length > 0 && (
                <div className="mt-4 md:mt-8 md:border-b md:border-[var(--line)]">
                    <div className="flex gap-2 md:gap-6 overflow-x-auto pb-4 scrollbar-hide px-4 -mx-4 md:px-0 md:mx-0">
                        {collections.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => handleCollectionChange(c.name)}
                                className={`
                                    text-xs md:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0
                                    px-4 py-2 rounded-full md:px-0 md:py-0 md:rounded-none md:pb-2 md:border-b-2 md:border-t-0 md:border-x-0
                                    ${activeCollection === c.name
                                        ? 'bg-[var(--terracotta)] text-white shadow-md border border-[var(--terracotta)] md:bg-transparent md:text-[var(--terracotta)] md:shadow-none'
                                        : 'bg-white text-[#5d554f] border border-[#e5e7eb] shadow-sm md:bg-transparent md:border-transparent md:shadow-none md:hover:text-[var(--ink)]'
                                    }
                                `}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* VARIANTS GRID */}
            {displayVariants && displayVariants.length > 0 && (
                <div className={`pt-4 md:pt-6 ${collections ? '' : 'mt-8 border-t border-[var(--line)]'}`}>
                    {!collections && <h3 className="font-bold text-lg mb-4">Available Colors & Textures</h3>}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {displayVariants.map((variant, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleVariantClick(variant)}
                                className="group cursor-pointer"
                            >
                                <div className={`aspect-square rounded-lg overflow-hidden bg-[#e7dbd1] border-2 transition-all relative shadow-sm ${selectedImage === variant.imageUrl ? 'border-[var(--terracotta)]' : 'border-transparent group-hover:border-[var(--terracotta)]'
                                    }`}>
                                    {variant.imageUrl ? (
                                        <PremiumImage
                                            src={variant.imageUrl}
                                            alt={variant.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            containerClassName="w-full h-full"
                                            sizes="(max-width: 768px) 33vw, 20vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#d2a58f] flex items-center justify-center text-[10px] text-white p-1 text-center">
                                            {variant.name}
                                        </div>
                                    )}
                                </div>
                                <p className={`mt-2 text-xs font-medium text-center transition-colors ${selectedImage === variant.imageUrl ? 'text-[var(--terracotta)]' : 'text-[#5d554f] group-hover:text-[var(--terracotta)]'
                                    }`}>
                                    {variant.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
