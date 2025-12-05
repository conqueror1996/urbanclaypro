'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import SampleModal from './SampleModal';
import { Product } from '@/lib/products';
import PhotoVisualizer from './PhotoVisualizer';

// We can keep RoomScene for a "3D Studio" mode if desired
// RoomScene import removed

interface VisualizerToolProps {
    products: Product[];
}

// Scene templates for different material categories
const CATEGORY_SCENES: Record<string, Array<{ id: string; name: string; image: string }>> = {
    'Brick Tiles': [
        { id: 'bungalow', name: 'Bungalow Exterior', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=300&q=80' },
        { id: 'facade', name: 'Exterior Facade', image: 'https://images.unsplash.com/photo-1600596542815-6ad4c7225592?auto=format&fit=crop&w=300&q=80' },
        { id: 'living', name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80' },
        { id: 'bedroom', name: 'Modern Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-40891a909d99?auto=format&fit=crop&w=300&q=80' },
        { id: 'garden', name: 'Garden Wall', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80' },
        { id: 'cafe', name: 'Commercial Cafe', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80' },
    ],
    'Linear Brick Tile': [
        { id: 'bungalow', name: 'Bungalow Exterior', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=300&q=80' },
        { id: 'facade', name: 'Exterior Facade', image: 'https://images.unsplash.com/photo-1600596542815-6ad4c7225592?auto=format&fit=crop&w=300&q=80' },
        { id: 'living', name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80' },
        { id: 'bedroom', name: 'Modern Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-40891a909d99?auto=format&fit=crop&w=300&q=80' },
        { id: 'garden', name: 'Garden Wall', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80' },
        { id: 'cafe', name: 'Commercial Cafe', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80' },
    ],
    'Smooth Brick Tile': [
        { id: 'bungalow', name: 'Bungalow Exterior', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=300&q=80' },
        { id: 'facade', name: 'Exterior Facade', image: 'https://images.unsplash.com/photo-1600596542815-6ad4c7225592?auto=format&fit=crop&w=300&q=80' },
        { id: 'living', name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80' },
        { id: 'bedroom', name: 'Modern Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-40891a909d99?auto=format&fit=crop&w=300&q=80' },
        { id: 'garden', name: 'Garden Wall', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80' },
        { id: 'cafe', name: 'Commercial Cafe', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80' },
    ],
    'Rustic Brick Tile': [
        { id: 'bungalow', name: 'Bungalow Exterior', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=300&q=80' },
        { id: 'facade', name: 'Exterior Facade', image: 'https://images.unsplash.com/photo-1600596542815-6ad4c7225592?auto=format&fit=crop&w=300&q=80' },
        { id: 'living', name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80' },
        { id: 'bedroom', name: 'Modern Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-40891a909d99?auto=format&fit=crop&w=300&q=80' },
        { id: 'garden', name: 'Garden Wall', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80' },
        { id: 'cafe', name: 'Commercial Cafe', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80' },
    ],
    'Exposed Brick': [
        { id: 'bungalow', name: 'Bungalow Exterior', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=300&q=80' },
        { id: 'facade', name: 'Exterior Facade', image: 'https://images.unsplash.com/photo-1600596542815-6ad4c7225592?auto=format&fit=crop&w=300&q=80' },
        { id: 'living', name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80' },
        { id: 'bedroom', name: 'Modern Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-40891a909d99?auto=format&fit=crop&w=300&q=80' },
        { id: 'garden', name: 'Garden Wall', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80' },
        { id: 'cafe', name: 'Commercial Cafe', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80' },
    ],
    // Fallback for any other category
    'default': [
        { id: 'facade', name: 'Exterior Facade', image: 'https://images.unsplash.com/photo-1600596542815-6ad4c7225592?auto=format&fit=crop&w=300&q=80' },
        { id: 'living', name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80' },
    ]
};

const MORTARS = [
    { id: '#2A1E16', name: 'Dark Charcoal' },
    { id: '#888888', name: 'Standard Grey' },
    { id: '#e5e5e5', name: 'Classic White' },
    { id: '#d7ccc8', name: 'Sandstone' },
];

const PATTERNS = [
    { id: 'stretcher', name: 'Stretcher Bond' },
    { id: 'stack', name: 'Stack Bond' },
    { id: 'flemish', name: 'Flemish Bond' },
    { id: 'herringbone', name: 'Herringbone (90°)' },
];

export default function VisualizerTool({ products }: VisualizerToolProps) {
    console.log('VisualizerTool received products:', products?.length, products);
    const materials = useMemo(() => {
        const allMaterials: Array<{ id: string; name: string; category: string; texture: string; dimensions?: { w: number, h: number } }> = [];

        // Helper to parse size string
        const parseSize = (sizeStr?: string) => {
            if (!sizeStr) return undefined;
            // Try mm first: "300mm x 50mm x 20mm"
            const mmMatch = sizeStr.match(/(\d+)\s*mm\s*x\s*(\d+)\s*mm/i);
            if (mmMatch) {
                return { w: parseInt(mmMatch[1]), h: parseInt(mmMatch[2]) };
            }
            // Try inches: "9\" x 4\""
            const inchMatch = sizeStr.match(/(\d+(?:\.\d+)?)"\s*x\s*(\d+(?:\.\d+)?)"/);
            if (inchMatch) {
                // Convert to approx mm for relative scale (1 inch = 25.4mm)
                return { w: parseFloat(inchMatch[1]) * 25.4, h: parseFloat(inchMatch[2]) * 25.4 };
            }
            return undefined;
        };

        products.forEach(p => {
            // Helper to determine category
            const getCategory = (text: string, tag?: string) => {
                // Priority 1: Use Sanity Tag if available and relevant
                if (tag) {
                    if (tag.includes('Linear') || tag.includes('Long')) return 'Linear Brick Tile';
                    if (tag.includes('Exposed')) return 'Exposed Brick';
                    if (tag.includes('Glazed')) return 'Glazed Brick';
                    if (tag.includes('Floor')) return 'Pavers';
                }

                // Priority 2: Parse text (Title/Variant Name)
                const t = text.toLowerCase();
                if (t.includes('linear') || t.includes('long')) return 'Linear Brick Tile';
                if (t.includes('wirecut') || t.includes('smooth') || t.includes('machine')) return 'Smooth Brick Tile';
                if (t.includes('rustic') || t.includes('antique') || t.includes('handmade')) return 'Rustic Brick Tile';
                if (t.includes('exposed')) return 'Exposed Brick';
                if (t.includes('glazed')) return 'Glazed Brick';

                return null;
            };

            // Default category from parent
            let parentCategory = getCategory(p.title, p.tag) || 'Brick Tiles';

            // Filter: Allow Bricks, Tiles, Cladding, and Pavers
            const titleLower = p.title.toLowerCase();
            const tagLower = p.tag?.toLowerCase() || '';
            const isRelevant =
                titleLower.includes('brick') ||
                titleLower.includes('tile') ||
                titleLower.includes('cladding') ||
                titleLower.includes('paver') ||
                tagLower.includes('brick') ||
                tagLower.includes('tile');

            // Exclude incompatible types for now (Jaali/Roof need different visualizer logic)
            const isJaali = titleLower.includes('jaali') || tagLower.includes('jaali');
            const isRoof = titleLower.includes('roof') || tagLower.includes('roof');

            if (!isRelevant || isJaali || isRoof) {
                return;
            }
            const dims = parseSize(p.specs?.size);

            // 1. Add Variants
            if (p.variants && p.variants.length > 0) {
                p.variants.forEach(v => {
                    if (v.imageUrl) {
                        // Try to get specific category from variant name, else use parent
                        const specificCategory = getCategory(v.name) || parentCategory;

                        allMaterials.push({
                            id: `${p.slug}-${v.name.toLowerCase().replace(/\s+/g, '-')}`,
                            name: `${p.title} - ${v.name}`,
                            category: specificCategory,
                            texture: v.imageUrl,
                            dimensions: dims
                        });
                    }
                });
            }

            // 2. Add Collections
            if (p.collections && p.collections.length > 0) {
                p.collections.forEach(c => {
                    // Try to get collection specific size
                    const colDims = parseSize(c.specs?.size) || dims;
                    const collectionCategory = getCategory(c.name);

                    if (c.variants) {
                        c.variants.forEach(v => {
                            if (v.imageUrl) {
                                // Priority: Variant Name -> Collection Name -> Parent Category
                                const specificCategory = getCategory(v.name) || collectionCategory || parentCategory;

                                allMaterials.push({
                                    id: `${p.slug}-${c.name}-${v.name}`.toLowerCase().replace(/\s+/g, '-'),
                                    name: `${v.name} (${c.name})`,
                                    category: specificCategory,
                                    texture: v.imageUrl,
                                    dimensions: colDims
                                });
                            }
                        });
                    }
                });
            }

            // 3. Fallback
            if (allMaterials.length === 0 || (p.imageUrl && !p.variants?.length && !p.collections?.length)) {
                allMaterials.push({
                    id: p.slug,
                    name: p.title,
                    category: parentCategory,
                    texture: p.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop',
                    dimensions: dims
                });
            }
        });

        // Remove duplicates
        const uniqueMaterials = [];
        const seenTextures = new Set();
        for (const m of allMaterials) {
            if (!seenTextures.has(m.texture)) {
                seenTextures.add(m.texture);
                uniqueMaterials.push(m);
            }
        }

        return uniqueMaterials;
    }, [products]);

    const [activeMaterial, setActiveMaterial] = useState(materials[0]);

    // Helper: Get best scene for a material category
    const getScenesForCategory = useCallback((category: string) => {
        // Normalize category matching
        const cat = category.toLowerCase();

        if (cat.includes('roof')) return CATEGORY_SCENES['Roof Tiles'];
        if (cat.includes('jaali') || cat.includes('jali')) return CATEGORY_SCENES['Jaalis'];
        if (cat.includes('facade') || cat.includes('cladding')) return CATEGORY_SCENES['Facade Systems'];
        if (cat.includes('brick') || cat.includes('tile')) return CATEGORY_SCENES['Brick Tiles'];
        if (cat.includes('paver') || cat.includes('floor')) return CATEGORY_SCENES['Pavers'];

        return CATEGORY_SCENES['default'];
    }, []);

    const availableScenes = getScenesForCategory(activeMaterial.category);
    const [activeScene, setActiveScene] = useState(availableScenes[0]);

    // Update scene when material category changes
    useEffect(() => {
        const newScenes = getScenesForCategory(activeMaterial.category);
        // If current scene is not in the new list, switch to the first one
        if (!newScenes.find(s => s.id === activeScene.id)) {
            setActiveScene(newScenes[0]);
        }
    }, [activeMaterial.category, getScenesForCategory, activeScene.id]);

    const [activeMortar, setActiveMortar] = useState(MORTARS[1]);
    const [activePattern, setActivePattern] = useState(PATTERNS[0]);
    const [activeTab, setActiveTab] = useState<'material' | 'grout' | 'bond' | 'tools'>('material');
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const [scale, setScale] = useState(0.25);
    const [rotation, setRotation] = useState(0);
    const [tolerance, setTolerance] = useState(45);
    const [brushMode, setBrushMode] = useState<'add' | 'subtract' | 'replace'>('add');
    const [generatedTexture, setGeneratedTexture] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isUIHidden, setIsUIHidden] = useState(false);
    const [isPanelMinimized, setIsPanelMinimized] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
    const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [isMobile, setIsMobile] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const visualizerRef = React.useRef<any>(null);
    const textureCache = React.useRef<Map<string, string>>(new Map());

    const [isLinearMode, setIsLinearMode] = useState(false);
    const [showMobileHint, setShowMobileHint] = useState(true);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ... (existing code)

    {/* Mobile Hint Toast */ }
    <AnimatePresence>
        {!isUIHidden && showMobileHint && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-auto md:hidden"
            >
                <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                    <span className="text-[10px] font-medium text-white/90 whitespace-nowrap">Tap surface to apply</span>
                    <button
                        onClick={() => setShowMobileHint(false)}
                        className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>

    // Prevent body scroll when visualizer is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // --- AUTO-SAVE / RESTORE STATE ---
    useEffect(() => {
        // Load from localStorage on mount
        const savedState = localStorage.getItem('urbanclay_visualizer_state');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.materialId) {
                    const mat = materials.find(m => m.id === parsed.materialId);
                    if (mat) setActiveMaterial(mat);
                }
                if (parsed.patternId) {
                    const pat = PATTERNS.find(p => p.id === parsed.patternId);
                    if (pat) setActivePattern(pat);
                }
                if (parsed.mortarId) {
                    const mor = MORTARS.find(m => m.id === parsed.mortarId);
                    if (mor) setActiveMortar(mor);
                }
                if (parsed.sceneId) {
                    const scn = availableScenes.find(s => s.id === parsed.sceneId);
                    if (scn) setActiveScene(scn);
                }
            } catch (e) {
                console.error("Failed to restore state", e);
            }
        }
    }, [materials]); // Run once when materials are ready

    // Save to localStorage on change
    useEffect(() => {
        const state = {
            materialId: activeMaterial.id,
            patternId: activePattern.id,
            mortarId: activeMortar.id,
            sceneId: activeScene.id
        };
        localStorage.setItem('urbanclay_visualizer_state', JSON.stringify(state));
    }, [activeMaterial, activePattern, activeMortar, activeScene]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                visualizerRef.current?.undo();
            }
            // Ctrl/Cmd + Shift + Z for redo (if implemented)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
                e.preventDefault();
                // visualizerRef.current?.redo();
            }
            // R for reset
            if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
                visualizerRef.current?.reset();
            }
            // H to toggle UI
            if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
                setIsUIHidden(prev => !prev);
            }
            // ? to show shortcuts
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                setShowKeyboardShortcuts(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Preload material images (only once per material)
    useEffect(() => {
        const preloadedIds = new Set<string>();

        materials.forEach(material => {
            // Skip if already preloaded
            if (preloadedIds.has(material.id)) return;

            const img = new Image();
            preloadedIds.add(material.id);

            setLoadingImages(prev => {
                const newSet = new Set(prev);
                newSet.add(material.id);
                return newSet;
            });

            img.onload = () => {
                setLoadedImages(prev => {
                    const newSet = new Set(prev);
                    newSet.add(material.id);
                    return newSet;
                });
                setLoadingImages(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(material.id);
                    return newSet;
                });
            };

            img.onerror = () => {
                setLoadingImages(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(material.id);
                    return newSet;
                });
            };

            img.src = material.texture;
        });
    }, []); // Empty dependency array - only run once on mount

    // Dynamic Texture Generator with caching
    useEffect(() => {
        const cacheKey = `${activeMaterial.id}-${activePattern.id}-${activeMortar.id}-${isLinearMode}`;

        if (textureCache.current.has(cacheKey)) {
            setGeneratedTexture(textureCache.current.get(cacheKey)!);
            return;
        }

        const generate = async () => {
            setIsGenerating(true);
            try {
                // Determine dimensions: Override if linear mode is on, otherwise use product specs or default
                let dimensions = activeMaterial.dimensions;
                if (isLinearMode) {
                    dimensions = { w: 300, h: 50 }; // Force linear size
                }

                const url = await generateSeamlessTexture(
                    activeMaterial.texture,
                    activePattern.id,
                    activeMortar.id,
                    dimensions
                );
                textureCache.current.set(cacheKey, url);
                setGeneratedTexture(url);
            } catch (e) {
                console.error("Texture generation failed", e);
                setGeneratedTexture(activeMaterial.texture);
            } finally {
                setIsGenerating(false);
            }
        };

        const timer = setTimeout(generate, 100);
        return () => clearTimeout(timer);
    }, [activeMaterial, activePattern, activeMortar, isLinearMode]);

    // Memoized grouped materials
    const groupedMaterials = useMemo(() => {
        return materials.reduce((acc, m) => {
            const cat = m.category || 'Uncategorized';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(m);
            return acc;
        }, {} as Record<string, typeof materials>);
    }, [materials]);

    // Helper: Generate Seamless Pattern Texture
    const generateSeamlessTexture = async (
        imageUrl: string,
        pattern: string,
        mortarColor: string,
        dimensions?: { w: number, h: number }
    ): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject("No context");

                // Configuration
                let brickW = dimensions?.w || 300;
                let brickH = dimensions?.h || 100;
                const joint = 15;

                // Scale down if too large
                const MAX_DIM = 400;
                if (brickW > MAX_DIM || brickH > MAX_DIM) {
                    const ratio = Math.min(MAX_DIM / brickW, MAX_DIM / brickH);
                    brickW *= ratio;
                    brickH *= ratio;
                }

                // Calculate Base Tile Unit
                let unitW, unitH;

                if (pattern === 'stack') {
                    unitW = brickW + joint;
                    unitH = brickH + joint;
                } else if (pattern === 'flemish') {
                    unitW = (brickW + joint) + (140 + joint);
                    unitH = (brickH + joint) * 2;
                } else {
                    // Stretcher (Default)
                    unitW = (brickW + joint);
                    unitH = (brickH + joint) * 2;
                }

                // Generate a larger patch (4x4 units)
                const repeatX = 4;
                const repeatY = 4;
                canvas.width = unitW * repeatX;
                canvas.height = unitH * repeatY;

                // 1. Fill background with mortar color
                ctx.fillStyle = mortarColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 2. Add "Sand" Texture to Grout
                const groutNoiseCanvas = document.createElement('canvas');
                groutNoiseCanvas.width = 100;
                groutNoiseCanvas.height = 100;
                const gCtx = groutNoiseCanvas.getContext('2d');
                if (gCtx) {
                    gCtx.fillStyle = mortarColor;
                    gCtx.fillRect(0, 0, 100, 100);
                    const iData = gCtx.createImageData(100, 100);
                    const buffer = new Uint32Array(iData.data.buffer);
                    for (let i = 0; i < buffer.length; i++) {
                        if (Math.random() < 0.2) buffer[i] = 0x10000000;
                        else if (Math.random() > 0.9) buffer[i] = 0x10ffffff;
                    }
                    gCtx.putImageData(iData, 0, 0);
                    const groutPattern = ctx.createPattern(groutNoiseCanvas, 'repeat');
                    if (groutPattern) {
                        ctx.fillStyle = groutPattern;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                }

                // 3. Analyze Source Image for Valid Spots (Avoid Grout)
                const analysisCanvas = document.createElement('canvas');
                analysisCanvas.width = img.width;
                analysisCanvas.height = img.height;
                const aCtx = analysisCanvas.getContext('2d');
                let pixelData: Uint8ClampedArray | null = null;
                let avgBrightness = 128;

                if (aCtx) {
                    aCtx.drawImage(img, 0, 0);
                    pixelData = aCtx.getImageData(0, 0, img.width, img.height).data;

                    // Calculate average brightness to set adaptive threshold
                    let totalBri = 0;
                    const step = 10; // Sample every 10th pixel for speed
                    let count = 0;
                    for (let i = 0; i < pixelData.length; i += 4 * step) {
                        totalBri += (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;
                        count++;
                    }
                    avgBrightness = totalBri / count;
                }

                // Adaptive Threshold: Grout is usually significantly darker than the average brick surface
                // We set the threshold to be lower than the average.
                // If the image is very dark, we use a very low threshold.
                const groutThreshold = Math.max(20, avgBrightness * 0.6);

                const validSpots: { x: number, y: number }[] = [];
                const MAX_SPOTS = 50;
                const sourceAspect = img.width / img.height;
                const targetAspect = brickW / brickH;

                // Reduced sample size to fit easier inside a brick face
                let sampleW = img.width * 0.1;
                let sampleH = sampleW / targetAspect;

                if (sampleH > img.height * 0.4) {
                    sampleH = img.height * 0.4;
                    sampleW = sampleH * targetAspect;
                }

                const maxX = img.width - sampleW;
                const maxY = img.height - sampleH;

                if (pixelData) {
                    let attempts = 0;
                    // Try more attempts since we are stricter
                    while (validSpots.length < MAX_SPOTS && attempts < 3000) {
                        attempts++;
                        const sx = Math.random() * maxX;
                        const sy = Math.random() * maxY;
                        let hasDarkPixel = false;

                        // Perimeter Scan: Check points along the edges of the sample rect
                        // This ensures we don't cross a grout line
                        const steps = 8; // Check 8 points along each edge

                        for (let i = 0; i <= steps; i++) {
                            const t = i / steps;

                            // Top & Bottom edges
                            const x = Math.floor(sx + t * sampleW);
                            const yTop = Math.floor(sy);
                            const yBot = Math.floor(sy + sampleH);

                            // Left & Right edges
                            const y = Math.floor(sy + t * sampleH);
                            const xLeft = Math.floor(sx);
                            const xRight = Math.floor(sx + sampleW);

                            const pointsToCheck = [
                                { x: x, y: yTop },
                                { x: x, y: yBot },
                                { x: xLeft, y: y },
                                { x: xRight, y: y }
                            ];

                            for (const p of pointsToCheck) {
                                if (p.x >= img.width || p.y >= img.height) continue;
                                const idx = (p.y * img.width + p.x) * 4;
                                const b = (pixelData[idx] + pixelData[idx + 1] + pixelData[idx + 2]) / 3;

                                if (b < groutThreshold) {
                                    hasDarkPixel = true;
                                    break;
                                }
                            }
                            if (hasDarkPixel) break;
                        }

                        if (!hasDarkPixel) validSpots.push({ x: sx, y: sy });
                    }
                }

                // Fallback: If strict scanning failed to find enough spots,
                // relax the threshold and try again for a few spots
                if (validSpots.length < 5 && pixelData) {
                    const relaxedThreshold = groutThreshold * 0.6;
                    let attempts = 0;
                    while (validSpots.length < 10 && attempts < 1000) {
                        attempts++;
                        const sx = Math.random() * maxX;
                        const sy = Math.random() * maxY;
                        const cx = Math.floor(sx + sampleW / 2);
                        const cy = Math.floor(sy + sampleH / 2);
                        const idx = (cy * img.width + cx) * 4;
                        const b = (pixelData[idx] + pixelData[idx + 1] + pixelData[idx + 2]) / 3;
                        if (b > relaxedThreshold) {
                            validSpots.push({ x: sx, y: sy });
                        }
                    }
                }

                // Ultimate Fallback
                if (validSpots.length === 0) {
                    validSpots.push({ x: maxX / 2, y: maxY / 2 });
                }

                // 4. Procedural Textures (Speckle/Grain)
                const speckleCanvas = document.createElement('canvas');
                speckleCanvas.width = 200;
                speckleCanvas.height = 200;
                const sCtx = speckleCanvas.getContext('2d');
                if (sCtx) {
                    for (let i = 0; i < 400; i++) {
                        sCtx.fillStyle = `rgba(20, 10, 5, ${Math.random() * 0.5 + 0.2})`;
                        const s = Math.random() * 2 + 0.5;
                        sCtx.fillRect(Math.random() * 200, Math.random() * 200, s, s);
                    }
                }
                const specklePattern = ctx.createPattern(speckleCanvas, 'repeat');

                // 5. Draw Brick Helper
                const drawBrick = (x: number, y: number, w: number, h: number) => {
                    const isVertical = h > w;
                    const brickL = isVertical ? h : w;
                    const brickS = isVertical ? w : h;

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(x, y, w, h);
                    ctx.clip();

                    const spot = validSpots[Math.floor(Math.random() * validSpots.length)];

                    ctx.translate(x + w / 2, y + h / 2);
                    if (isVertical) ctx.rotate(-Math.PI / 2);

                    const dw = brickL;
                    const dh = brickS;

                    // Draw Texture
                    const flipH = Math.random() > 0.5;
                    const flipV = Math.random() > 0.5;
                    ctx.save();
                    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
                    ctx.drawImage(img, spot.x, spot.y, sampleW, sampleH, -dw / 2, -dh / 2, dw, dh);
                    ctx.restore();

                    // Color Variation
                    const tint = Math.random();
                    if (tint > 0.7) {
                        ctx.fillStyle = 'rgba(0,0,0,0.1)';
                        ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
                    } else if (tint < 0.3) {
                        ctx.fillStyle = 'rgba(255,255,255,0.05)';
                        ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
                    }

                    // Overlays
                    if (specklePattern) {
                        ctx.fillStyle = specklePattern;
                        ctx.globalAlpha = 0.3;
                        ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
                        ctx.globalAlpha = 1.0;
                    }

                    // 3D Bevel Effects
                    // Top/Left Highlight
                    const bevel = Math.max(2, dw * 0.015);
                    const gradLight = ctx.createLinearGradient(-dw / 2, -dh / 2, -dw / 2 + bevel, -dh / 2 + bevel);
                    gradLight.addColorStop(0, 'rgba(255,255,255,0.6)');
                    gradLight.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = gradLight;
                    ctx.fillRect(-dw / 2, -dh / 2, dw, bevel);
                    ctx.fillRect(-dw / 2, -dh / 2, bevel, dh);

                    // Bottom/Right Shadow
                    const gradDark = ctx.createLinearGradient(dw / 2 - bevel, dh / 2 - bevel, dw / 2, dh / 2);
                    gradDark.addColorStop(0, 'rgba(0,0,0,0)');
                    gradDark.addColorStop(1, 'rgba(0,0,0,0.4)'); // Softer shadow (was 0.5)
                    ctx.fillStyle = gradDark;
                    ctx.fillRect(-dw / 2, dh / 2 - bevel, dw, bevel);
                    ctx.fillRect(dw / 2 - bevel, -dh / 2, bevel, dh);

                    // Vignette
                    const rad = Math.min(dw, dh) / 2;
                    const gradVig = ctx.createRadialGradient(0, 0, rad * 0.5, 0, 0, rad * 1.5);
                    gradVig.addColorStop(0, 'rgba(0,0,0,0)');
                    gradVig.addColorStop(1, 'rgba(0,0,0,0.15)');
                    ctx.fillStyle = gradVig;
                    ctx.fillRect(-dw / 2, -dh / 2, dw, dh);

                    ctx.restore();
                };

                // 6. Draw Pattern
                if (pattern === 'herringbone') {
                    // Herringbone Loop
                    const L = brickW;
                    const S = brickH;
                    const P = L + S + 2 * joint;
                    const Q = S + joint;
                    const count = Math.ceil((canvas.width + canvas.height) / S) + 2;

                    for (let col = -count; col < count; col++) {
                        for (let row = -count; row < count; row++) {
                            const x = col * P + row * Q;
                            const y = row * -Q;
                            drawBrick(x, y, S, L);
                            drawBrick(x + Q, y + L - S, L, S);
                        }
                    }
                } else {
                    // Grid Loops
                    for (let ry = 0; ry < repeatY; ry++) {
                        for (let rx = 0; rx < repeatX; rx++) {
                            const offsetX = rx * unitW;
                            const offsetY = ry * unitH;

                            if (pattern === 'stack') {
                                drawBrick(offsetX, offsetY, brickW, brickH);
                            } else if (pattern === 'flemish') {
                                drawBrick(offsetX, offsetY, brickW, brickH);
                                drawBrick(offsetX + brickW + joint, offsetY, 140, brickH);
                                drawBrick(offsetX, offsetY + brickH + joint, 140, brickH);
                                drawBrick(offsetX + 140 + joint, offsetY + brickH + joint, brickW, brickH);
                            } else {
                                // Stretcher
                                drawBrick(offsetX, offsetY, brickW, brickH);
                                drawBrick(offsetX - unitW / 2, offsetY + brickH + joint, brickW, brickH);
                                drawBrick(offsetX + unitW / 2, offsetY + brickH + joint, brickW, brickH);
                                drawBrick(offsetX + unitW * 1.5, offsetY + brickH + joint, brickW, brickH);
                            }
                        }
                    }
                }

                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            img.onerror = reject;
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setUploadedImage(result);
                setActiveScene({ id: 'custom', name: 'My Room', image: result }); // Switch to custom scene
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-[#1a1a18] overflow-hidden select-none font-sans text-white selection:bg-[var(--terracotta)] selection:text-white">

            {/* Max-width container for consistency with site */}
            <div className="relative w-full max-w-[1920px] mx-auto h-full">

                {/* 1. IMMERSIVE CANVAS LAYER */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div
                        className="w-full h-full transition-transform duration-300 ease-out origin-center"
                        style={{ transform: `scale(${zoomLevel})` }}
                    >
                        <PhotoVisualizer
                            ref={visualizerRef}
                            materialUrl={generatedTexture || activeMaterial.texture}
                            sceneId={activeScene.id}
                            scale={scale}
                            rotation={rotation}
                            tolerance={tolerance}
                            brushMode={brushMode}
                            customBaseImage={uploadedImage}
                        />
                    </div>
                    {/* Subtle Vignette - Keep outside zoom so it stays fixed */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(28,28,28,0.3)_100%)]" />
                </div>

                {/* 2. UI OVERLAY LAYER */}
                <div className={`absolute inset-0 z-10 pointer-events-none flex flex-col transition-opacity duration-500 ${isUIHidden ? 'opacity-0' : 'opacity-100'}`}>

                    {/* Compact Top Bar */}
                    <div className="flex justify-between items-center gap-2 pointer-events-auto px-3 py-2 lg:px-6 lg:py-3 bg-gradient-to-b from-[#1C1C1C]/95 to-transparent backdrop-blur-sm">

                        {/* Brand Mark - Compact */}
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[var(--terracotta)]" />
                            <h2 className="text-sm lg:text-lg font-serif tracking-tight text-white">UrbanClay <span className="text-[var(--terracotta)] italic font-light hidden sm:inline">Atelier</span></h2>
                        </div>

                        {/* Scene Selector Pills - Compact */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[60vw] scrollbar-hide">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-shrink-0 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-[9px] lg:text-[10px] font-bold uppercase tracking-wider transition-all bg-[var(--terracotta)] text-white hover:bg-[#a85638] shadow-md flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <span className="hidden sm:inline">Upload</span>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

                            {availableScenes.map((scene) => (
                                <button
                                    key={scene.id}
                                    onClick={() => { setActiveScene(scene); setUploadedImage(null); }}
                                    className={`flex-shrink-0 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-[9px] lg:text-[10px] font-medium transition-all whitespace-nowrap ${activeScene.id === scene.id ? 'bg-[var(--terracotta)]/20 text-[var(--terracotta)] border border-[var(--terracotta)]/30' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                >
                                    {scene.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading Indicator */}
                    <AnimatePresence>
                        {isGenerating && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="absolute top-20 right-6 pointer-events-none bg-[#20201E]/90 backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl z-50"
                            >
                                <div className="w-3 h-3 border-2 border-[var(--terracotta)] border-t-transparent rounded-full animate-spin" />
                                <span className="font-medium text-[10px]">Rendering...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom Container: Material Library + Summary Panel */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-end gap-4 lg:gap-6 px-0 lg:px-6 pb-0 lg:pb-6 pointer-events-none">

                        {/* Material Library Panel - Compact */}
                        <div className={`flex-1 max-w-3xl bg-[#20201E]/95 backdrop-blur-xl rounded-t-2xl lg:rounded-3xl shadow-2xl border-t lg:border border-white/10 overflow-hidden flex flex-col pointer-events-auto transition-all duration-500 ease-out transform translate-y-0 opacity-100 ${isPanelMinimized ? 'h-auto' : 'h-[40vh] lg:h-[40vh]'}`}>

                            {/* Tabs Header & Controls */}
                            <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm pr-2 lg:pr-3 pl-2 lg:pl-3">
                                <div className="flex flex-1 gap-1 py-2">
                                    {['material', 'grout', 'bond', 'tools'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => { setActiveTab(tab as any); setIsPanelMinimized(false); }}
                                            className={`flex-1 py-2.5 lg:py-3 rounded-lg text-[9px] lg:text-[10px] uppercase tracking-wider font-bold transition-all ${activeTab === tab && !isPanelMinimized ? 'text-black bg-white shadow-md' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Minimize Button */}
                                <button
                                    onClick={() => setIsPanelMinimized(!isPanelMinimized)}
                                    className="p-2 text-white/40 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
                                >
                                    <svg className={`w-4 h-4 transition-transform duration-500 ${isPanelMinimized ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div
                                className={`flex-1 overflow-y-auto overscroll-contain custom-scrollbar-dark scroll-smooth p-3 lg:p-5 space-y-4 lg:space-y-5 transition-all duration-500 ${isPanelMinimized ? 'hidden' : 'block'}`}
                                onWheel={(e) => {
                                    const element = e.currentTarget;
                                    const isAtTop = element.scrollTop === 0;
                                    const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;

                                    // Always prevent scroll bubbling
                                    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                                        e.preventDefault();
                                    }
                                    e.stopPropagation();
                                }}
                                onTouchMove={(e) => {
                                    // Prevent touch scroll from bubbling
                                    e.stopPropagation();
                                }}
                            >

                                {/* MATERIAL TAB */}
                                {activeTab === 'material' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                                        <div className="flex justify-between items-end border-b border-white/10 pb-2.5">
                                            <div>
                                                <h3 className="text-base lg:text-xl font-serif text-white mb-0.5">Material Library</h3>
                                                <p className="text-[9px] lg:text-[10px] text-white/40 font-medium tracking-wide">Select a texture</p>
                                            </div>
                                            <span className="text-xs font-mono text-[var(--terracotta)] bg-[var(--terracotta)]/10 px-3 py-1 rounded-full">{materials.length} ITEMS</span>
                                        </div>

                                        {/* Grouped Categories */}
                                        {Object.entries(groupedMaterials).map(([category, items]) => (
                                            <div key={category} className="space-y-4 mb-8 border-b border-white/5 pb-6 last:border-0 last:mb-0 last:pb-0">
                                                <div className="flex items-center gap-2.5">
                                                    <h4 className="text-[9px] lg:text-[10px] font-bold text-white/50 uppercase tracking-[0.12em]">{category}</h4>
                                                    <div className="h-px flex-1 bg-white/10" />
                                                </div>
                                                <div className="flex gap-2.5 overflow-x-auto pb-2.5 -mx-3 lg:-mx-5 px-3 lg:px-5 snap-x snap-mandatory no-scrollbar touch-pan-x">
                                                    {items.map((m) => {
                                                        const isLoading = loadingImages.has(m.id);
                                                        const isLoaded = loadedImages.has(m.id);

                                                        return (
                                                            <button
                                                                key={m.id}
                                                                onClick={() => {
                                                                    setActiveMaterial(m);
                                                                    // Scene will auto-switch via useEffect
                                                                }}
                                                                className={`relative group flex-shrink-0 w-16 h-16 lg:w-24 lg:h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${activeMaterial.id === m.id ? 'ring-2 ring-[var(--terracotta)] scale-105 shadow-lg z-10' : 'hover:scale-105 hover:shadow-md opacity-70 hover:opacity-100'}`}
                                                            >
                                                                {/* Skeleton Loader */}
                                                                {isLoading && (
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-shimmer" />
                                                                )}

                                                                {/* Image */}
                                                                <NextImage
                                                                    src={m.texture}
                                                                    alt={m.name}
                                                                    fill
                                                                    className={`object-cover transition-all duration-700 ${isLoaded ? 'opacity-100 group-hover:scale-110 group-active:scale-100' : 'opacity-0'}`}
                                                                    loading="lazy"
                                                                    sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
                                                                />

                                                                {/* Hover Overlay */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                                    <span className="text-[10px] font-bold text-white tracking-wide leading-tight text-left">{m.name}</span>
                                                                </div>

                                                                {/* Active Indicator */}
                                                                {activeMaterial.id === m.id && (
                                                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--terracotta)] shadow-[0_0_8px_var(--terracotta)]" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* GROUT TAB */}
                                {activeTab === 'grout' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="mb-8">
                                            <h3 className="text-xl font-serif text-white mb-2">Mortar Selection</h3>
                                            <p className="text-sm text-white/40 leading-relaxed">The mortar color defines the contrast and character of the brickwork.</p>
                                        </div>
                                        <div className="space-y-4">
                                            {MORTARS.map((mortar) => (
                                                <button
                                                    key={mortar.id}
                                                    onClick={() => setActiveMortar(mortar)}
                                                    className={`w-full p-5 rounded-2xl border flex items-center gap-5 transition-all duration-300 group ${activeMortar.id === mortar.id ? 'border-[var(--terracotta)] bg-white/5 shadow-xl scale-[1.02]' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                                                >
                                                    <div className="w-12 h-12 rounded-full border-2 border-white/10 shadow-inner ring-4 ring-white/5 group-hover:scale-110 transition-transform" style={{ backgroundColor: mortar.id }} />
                                                    <div className="text-left flex-1">
                                                        <span className="block text-base font-medium text-white mb-0.5">{mortar.name}</span>
                                                        <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Premium Grout</span>
                                                    </div>
                                                    {activeMortar.id === mortar.id && (
                                                        <div className="w-6 h-6 rounded-full bg-[var(--terracotta)] flex items-center justify-center text-black shadow-[0_0_10px_var(--terracotta)]">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* BOND TAB */}
                                {activeTab === 'bond' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="mb-8">
                                            <h3 className="text-xl font-serif text-white mb-2">Installation Pattern</h3>
                                            <p className="text-sm text-white/40 leading-relaxed">Select the architectural bond pattern for the masonry.</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {PATTERNS.map((pattern) => (
                                                <button
                                                    key={pattern.id}
                                                    onClick={() => setActivePattern(pattern)}
                                                    className={`relative p-8 rounded-2xl border text-left transition-all duration-300 overflow-hidden group ${activePattern.id === pattern.id ? 'border-[var(--terracotta)] bg-white/5 shadow-xl' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                                                >
                                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" /></svg>
                                                    </div>
                                                    <div className="relative z-10">
                                                        <span className="block text-lg font-medium text-white mb-2">{pattern.name}</span>
                                                        <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold tracking-wider text-white/60 uppercase border border-white/5">Architectural Standard</span>
                                                    </div>
                                                    {activePattern.id === pattern.id && (
                                                        <div className="absolute bottom-6 right-6 w-2 h-2 rounded-full bg-[var(--terracotta)] shadow-[0_0_10px_var(--terracotta)]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TOOLS TAB */}
                                {activeTab === 'tools' && (
                                    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div>
                                            <h3 className="text-base lg:text-xl font-serif text-white mb-4 lg:mb-6">Smart Tools</h3>

                                            {/* Brush Mode */}
                                            <div className="bg-white/5 rounded-2xl p-1.5 lg:p-2 border border-white/10 flex gap-2 mb-6 lg:mb-8">
                                                {[
                                                    { id: 'add', label: 'Add Area', icon: 'M12 4v16m8-8H4' },
                                                    { id: 'subtract', label: 'Erase', icon: 'M20 12H4' },
                                                    { id: 'replace', label: 'New Mask', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' }
                                                ].map((mode) => (
                                                    <button
                                                        key={mode.id}
                                                        onClick={() => setBrushMode(mode.id as any)}
                                                        className={`flex-1 py-3 lg:py-4 rounded-xl text-[9px] lg:text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 lg:gap-2 ${brushMode === mode.id ? 'bg-[var(--terracotta)] text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                                    >
                                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mode.icon} /></svg>
                                                        {mode.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Sliders */}
                                            <div className="space-y-6 lg:space-y-8 px-1 lg:px-2">
                                                <div className="space-y-3 lg:space-y-4">
                                                    <div className="flex justify-between text-[10px] lg:text-xs font-bold tracking-wide uppercase">
                                                        <label className="text-white/60">Color Sensitivity</label>
                                                        <span className="text-[var(--terracotta)]">{tolerance}%</span>
                                                    </div>
                                                    <div className="relative h-3 lg:h-2 bg-white/10 rounded-full overflow-hidden touch-none">
                                                        <div className="absolute top-0 left-0 h-full bg-[var(--terracotta)] rounded-full" style={{ width: `${tolerance}%` }} />
                                                        <input
                                                            type="range" min="1" max="100" value={tolerance}
                                                            onChange={(e) => setTolerance(Number(e.target.value))}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3 lg:space-y-4">
                                                    <div className="flex justify-between text-[10px] lg:text-xs font-bold tracking-wide uppercase">
                                                        <label className="text-white/60">Texture Scale</label>
                                                        <span className="text-[var(--terracotta)]">{scale.toFixed(2)}x</span>
                                                    </div>
                                                    <div className="relative h-3 lg:h-2 bg-white/10 rounded-full overflow-hidden touch-none">
                                                        <div className="absolute top-0 left-0 h-full bg-[var(--terracotta)] rounded-full" style={{ width: `${(scale / 1.5) * 100}%` }} />
                                                        <input
                                                            type="range" min="0.1" max="1.5" step="0.05" value={scale}
                                                            onChange={(e) => setScale(Number(e.target.value))}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3 lg:space-y-4">
                                                    <div className="flex justify-between text-[10px] lg:text-xs font-bold tracking-wide uppercase">
                                                        <label className="text-white/60">Rotation</label>
                                                        <span className="text-[var(--terracotta)]">{rotation}°</span>
                                                    </div>
                                                    <div className="relative h-3 lg:h-2 bg-white/10 rounded-full overflow-hidden touch-none">
                                                        <div className="absolute top-0 left-0 h-full bg-[var(--terracotta)] rounded-full" style={{ width: `${((rotation + 180) / 360) * 100}%` }} />
                                                        <input
                                                            type="range" min="-180" max="180" value={rotation}
                                                            onChange={(e) => setRotation(Number(e.target.value))}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-8 border-t border-white/10 space-y-4">
                                            {/* Format Toggle */}
                                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                                                <div>
                                                    <span className="block text-xs font-bold text-white uppercase tracking-wider">Brick Format</span>
                                                    <span className="text-[10px] text-white/40">Switch between standard and linear sizes</span>
                                                </div>
                                                <button
                                                    onClick={() => setIsLinearMode(!isLinearMode)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isLinearMode ? 'bg-[var(--terracotta)]' : 'bg-white/10'}`}
                                                >
                                                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isLinearMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <button onClick={() => visualizerRef.current?.undo()} className="py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 text-white/80 hover:text-white">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                                    Undo
                                                </button>
                                                <button onClick={() => visualizerRef.current?.reset()} className="py-4 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 text-white/80 hover:text-red-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    Clear
                                                </button>
                                            </div>
                                            <button onClick={() => visualizerRef.current?.download()} className="w-full py-5 bg-white text-black hover:bg-gray-100 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 group">
                                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                Download High-Res
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Side Summary Panel - Hidden on Mobile */}
                        {!isMobile && (
                            <div className="fixed top-24 right-8 w-72 bg-[#20201E]/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/10 p-5 space-y-4 pointer-events-auto z-40">
                                <h3 className="text-lg font-serif text-white/90 border-b border-white/5 pb-3">Configuration</h3>

                                {/* Selected Material */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Selected Material</label>
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                            {loadedImages.has(activeMaterial.id) ? (
                                                <NextImage src={activeMaterial.texture} alt={activeMaterial.name} fill className="object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-shimmer" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">{activeMaterial.name}</p>
                                            <p className="text-[9px] text-white/30 uppercase tracking-wide">{activeMaterial.category}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Mortar Shade */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Mortar Shade</label>
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="w-7 h-7 rounded-full border-2 border-white/10" style={{ backgroundColor: activeMortar.id }} />
                                        <span className="text-sm font-medium text-white/90">{activeMortar.name}</span>
                                    </div>
                                </div>

                                {/* Bond Pattern */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Bond Pattern</label>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-sm font-medium text-white/90">{activePattern.name}</span>
                                    </div>
                                </div>

                                {/* Brick Format */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Brick Format</label>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/90">{isLinearMode ? 'Linear (Long)' : 'Standard'}</span>
                                        <div className={`w-2 h-2 rounded-full ${isLinearMode ? 'bg-[var(--terracotta)] shadow-[0_0_5px_var(--terracotta)]' : 'bg-white/20'}`} />
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => setIsSampleModalOpen(true)}
                                    className="w-full py-5 bg-[var(--terracotta)] hover:bg-[#a85638] text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-[var(--terracotta)]/20 hover:shadow-[var(--terracotta)]/40 hover:-translate-y-1 flex items-center justify-center gap-3 group mt-8"
                                >
                                    <span>Request Sample</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Persistent Controls - Responsive Positioning */}
                <div className="absolute top-16 right-4 lg:top-auto lg:bottom-8 lg:right-8 z-50 pointer-events-auto flex flex-col gap-3 scale-90 origin-right lg:scale-100">
                    {/* Keyboard Shortcuts Toggle */}
                    <button
                        onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                        className="p-3 rounded-full backdrop-blur-xl border bg-[#20201E]/90 border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all duration-300 shadow-2xl"
                        title="Keyboard Shortcuts (?)"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>

                    {/* UI Toggle (Eye Icon) */}
                    <button
                        onClick={() => setIsUIHidden(!isUIHidden)}
                        className={`p-3 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl ${isUIHidden ? 'bg-[var(--terracotta)] border-[var(--terracotta)] text-white hover:bg-[#a85638]' : 'bg-[#20201E]/90 border-white/10 text-white/70 hover:text-white hover:border-white/20'}`}
                        title={isUIHidden ? "Show Interface (H)" : "Hide Interface (H)"}
                    >
                        {isUIHidden ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        )}
                    </button>
                </div>

                {/* Zoom Controls (Left Side) */}
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 pointer-events-auto flex flex-col gap-3 bg-black/40 backdrop-blur-md rounded-full p-2 border border-white/10 shadow-xl scale-75 origin-left lg:scale-100 transition-opacity duration-300 ${isUIHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <button
                        onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 2))}
                        className="p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                        title="Zoom In"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>
                    </button>
                    <div className="text-[10px] text-white/40 text-center font-mono px-2">{Math.round(zoomLevel * 100)}%</div>
                    <button
                        onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}
                        className="p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                        title="Zoom Out"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
                    </button>
                    <div className="h-px bg-white/10 my-1" />
                    <button
                        onClick={() => setZoomLevel(1)}
                        className="p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                        title="Reset Zoom"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>

                {/* Mobile Hint Toast */}
                <AnimatePresence>
                    {!isUIHidden && showMobileHint && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-auto md:hidden"
                        >
                            <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                                <span className="text-[10px] font-medium text-white/90 whitespace-nowrap">Tap surface to apply</span>
                                <button
                                    onClick={() => setShowMobileHint(false)}
                                    className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Keyboard Shortcuts Overlay */}
                <AnimatePresence>
                    {showKeyboardShortcuts && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
                            onClick={() => setShowKeyboardShortcuts(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-[#20201E] rounded-3xl p-8 max-w-md w-full mx-4 border border-white/10 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-serif text-white">Keyboard Shortcuts</h3>
                                    <button
                                        onClick={() => setShowKeyboardShortcuts(false)}
                                        className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { key: 'H', action: 'Toggle UI visibility' },
                                        { key: 'R', action: 'Reset mask' },
                                        { key: 'Ctrl/Cmd + Z', action: 'Undo last action' },
                                        { key: '?', action: 'Show/hide shortcuts' },
                                        { key: 'Esc', action: 'Close modals' },
                                    ].map((shortcut, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-sm text-white/70">{shortcut.action}</span>
                                            <kbd className="px-3 py-1 bg-white/10 rounded-lg text-xs font-mono text-white border border-white/20">{shortcut.key}</kbd>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <SampleModal
                    isOpen={isSampleModalOpen}
                    onClose={() => setIsSampleModalOpen(false)}
                    initialRequirements={`Configurator Request:\nProduct: ${activeMaterial.name}\nMortar: ${activeMortar.name}\nPattern: ${activePattern.name}\nScene: ${activeScene.name}`}
                />
            </div>
        </div >
    );
}
