'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Search, X, ArrowRight, LayoutDashboard, Target, Users,
    Receipt, Package, ShoppingBag, RotateCcw, Activity,
    Truck, Cpu, PenTool, Globe, BookOpen, MessageSquare,
    LayoutTemplate, Settings, Plus, DollarSign, FileText
} from 'lucide-react';

interface CommandItem {
    id: string;
    label: string;
    icon: any;
    href?: string;
    action?: () => void;
    group: string;
    keywords: string[];
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Toggle with Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const COMMANDS: CommandItem[] = [
        // Navigation
        { id: 'nav-home', label: 'Go to Dashboard', icon: LayoutDashboard, href: '/dashboard', group: 'Navigation', keywords: ['home', 'index'] },
        { id: 'nav-crm', label: 'CRM Engine', icon: Target, href: '/dashboard/crm', group: 'Navigation', keywords: ['crm', 'customers', 'sales'] },
        { id: 'nav-leads', label: 'Sales Leads', icon: Users, href: '/dashboard/leads', group: 'Navigation', keywords: ['leads', 'inbox'] },
        { id: 'nav-orders', label: 'Orders & Payments', icon: Receipt, href: '/dashboard/orders', group: 'Navigation', keywords: ['orders', 'billing'] },
        { id: 'nav-stocks', label: 'Inventory Management', icon: Package, href: '/dashboard/stocks', group: 'Navigation', keywords: ['stock', 'inventory'] },
        { id: 'nav-products', label: 'Product Catalog', icon: ShoppingBag, href: '/dashboard/products', group: 'Navigation', keywords: ['products', 'items'] },

        // Actions
        { id: 'act-payment', label: 'Create Payment Link', icon: DollarSign, href: '/dashboard/orders/create', group: 'Quick Actions', keywords: ['new', 'payment', 'link', 'generate'] },
        { id: 'act-product', label: 'Add New Product', icon: Plus, href: '/dashboard/products/new', group: 'Quick Actions', keywords: ['new', 'product', 'create'] },
        { id: 'act-campaign', label: 'Start New Campaign', icon: PenTool, href: '/dashboard/campaigns/new', group: 'Quick Actions', keywords: ['marketing', 'email', 'new'] },

        // Tools
        { id: 'tool-seo', label: 'SEO Suite', icon: Globe, href: '/dashboard/seo', group: 'Tools', keywords: ['seo', 'meta', 'search'] },
        { id: 'tool-journal', label: 'Journal Manager', icon: BookOpen, href: '/dashboard/journal', group: 'Tools', keywords: ['journal', 'blog', 'content'] },

    ];

    const filteredCommands = COMMANDS.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.group.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
    );

    // Group commands for display
    const groupedCommands = filteredCommands.reduce((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    const handleSelect = (item: CommandItem) => {
        onClose();
        if (item.action) {
            item.action();
        } else if (item.href) {
            router.push(item.href);
        }
    };

    // Keyboard navigation within list
    useEffect(() => {
        const handleNavigation = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    handleSelect(filteredCommands[selectedIndex]);
                }
            }
        };

        window.addEventListener('keydown', handleNavigation);
        return () => window.removeEventListener('keydown', handleNavigation);
    }, [isOpen, filteredCommands, selectedIndex]);

    // Ensure selected index is always valid
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onClose()}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-start justify-center pt-[20vh] px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#1a110d] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[60vh]"
                        >
                            {/* Header / Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-white/5">
                                <Search className="w-5 h-5 text-gray-500" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Type a command or search..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder:text-gray-600 outline-none text-lg h-full"
                                    autoComplete="off"
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-gray-600 border border-white/10 px-1.5 py-0.5 rounded">ESC</span>
                                </div>
                            </div>

                            {/* Results */}
                            <div
                                ref={listRef}
                                className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                            >
                                {filteredCommands.length > 0 ? (
                                    Object.entries(groupedCommands).map(([group, items]) => (
                                        <div key={group} className="mb-2">
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 py-2 select-none">
                                                {group}
                                            </div>
                                            <div className="space-y-0.5">
                                                {items.map((item) => {
                                                    // Calculate absolute index for highlighting
                                                    const absoluteIndex = filteredCommands.findIndex(c => c.id === item.id);
                                                    const isSelected = absoluteIndex === selectedIndex;

                                                    return (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => handleSelect(item)}
                                                            onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                                                            className={`
                                                                w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all
                                                                ${isSelected
                                                                    ? 'bg-[var(--terracotta)] text-white shadow-lg shadow-orange-900/20'
                                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <item.icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                                                                <span className="font-medium">{item.label}</span>
                                                            </div>
                                                            {isSelected && <ArrowRight className="w-4 h-4 opacity-50" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-500">
                                        <p>No results found for "{query}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 bg-black/20 border-t border-white/5 text-[10px] text-gray-600 flex justify-between items-center">
                                <div className="flex gap-4">
                                    <span><strong>↑↓</strong> to navigate</span>
                                    <span><strong>↵</strong> to select</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>System Online</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
