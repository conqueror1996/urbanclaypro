'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, LayoutDashboard, Target, Users,
    Receipt, Package, ShoppingBag, RotateCcw, Activity,
    Truck, Cpu, PenTool, Globe, BookOpen, MessageSquare,
    LayoutTemplate, LogOut, Search
} from 'lucide-react';
import CommandPalette from '@/components/dashboard/CommandPalette';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('uc_admin_auth') === 'true') {
            setIsAuthenticated(true);
            // Restore cookie if missing (e.g., after browser restart or cookie cleared)
            const storedPassword = localStorage.getItem('uc_admin_password');
            if (storedPassword && !document.cookie.includes('uc_admin_token=')) {
                // Secure cookie attributes should be used in production
                document.cookie = `uc_admin_token=${storedPassword}; path=/; max-age=31536000; SameSite=Lax`;
            }
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Check custom password first, then default passwords
        const customPassword = localStorage.getItem('uc_custom_password');
        const isValid = password === 'clay2025' || password === 'admin' || (customPassword && password === customPassword);

        if (isValid) {
            setIsAuthenticated(true);
            localStorage.setItem('uc_admin_auth', 'true');
            localStorage.setItem('uc_admin_password', password);
            // Store token in cookie for API access
            document.cookie = `uc_admin_token=${password}; path=/; max-age=31536000; SameSite=Lax`;
        } else {
            alert('Invalid Access key');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('uc_admin_auth');
        localStorage.removeItem('uc_admin_password');
        document.cookie = 'uc_admin_token=; path=/; max-age=0;';
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center p-4 font-sans">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl"
                >
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-[var(--terracotta)] to-[#8a4229] rounded-2xl mx-auto mb-6 shadow-lg shadow-orange-900/40 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h1 className="text-3xl font-serif text-white mb-2">UrbanClay <span className="text-white/40 block text-sm font-sans font-medium uppercase tracking-[0.2em] mt-2">Control Center</span></h1>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="Enter Access Key"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] transition-all text-center font-mono tracking-[0.2em]"
                            />
                        </div>
                        <button type="submit" className="w-full bg-[var(--terracotta)] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#a85638] transition-all hover:shadow-lg hover:shadow-orange-900/20 active:scale-[0.98]">
                            Authenticate
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }


    const NAV_GROUPS = [
        {
            title: "Market Intelligence",
            items: [
                { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
                { label: 'CRM Engine', href: '/dashboard/crm', icon: Target },
                { label: 'Sales Leads', href: '/dashboard/leads', icon: Users },
            ]
        },
        {
            title: "Global Commerce",
            items: [
                { label: 'Payment Links', href: '/dashboard/orders', icon: Receipt },
                { label: 'Inventory', href: '/dashboard/stocks', icon: Package },
                { label: 'Product Catalog', href: '/dashboard/products', icon: ShoppingBag },
                { label: 'Returns/Disputes', href: '/dashboard/returns', icon: RotateCcw },
            ]
        },
        {
            title: "Field Operations",
            items: [
                { label: 'Operations Hub', href: '/dashboard/operations', icon: Activity },
                { label: 'Sample Logistics', href: '/dashboard/samples', icon: Truck },
                { label: 'Project Lab AI', href: '/dashboard/project-lab', icon: Cpu },
            ]
        },
        {
            title: "Content & Growth",
            items: [
                { label: 'Campaigns', href: '/dashboard/campaigns', icon: PenTool },
                { label: 'SEO Suite', href: '/dashboard/seo', icon: Globe },
                { label: 'Journal Manager', href: '/dashboard/journal', icon: BookOpen },
                { label: 'Customer Voice', href: '/dashboard/feedback', icon: MessageSquare },
                { label: 'CMS Studio', href: '/studio', icon: LayoutTemplate },
            ]
        }
    ];



    return (
        <div className="min-h-screen bg-[var(--sand)] flex flex-col md:flex-row font-sans">

            {/* Mobile Header */}
            <div className="md:hidden bg-[var(--ink)] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--terracotta)] to-[#8a4229] rounded-lg flex items-center justify-center shrink-0">
                        <span className="font-serif font-bold text-sm text-white">U</span>
                    </div>
                    <span className="font-serif text-lg tracking-wide">UrbanClay</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCommandOpen(true)}
                        className="text-white/80 hover:text-white"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white/80 hover:text-white"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 h-full bg-[#1a110d] text-[#e9e2da] flex flex-col border-r border-white/5 shadow-2xl transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'md:w-20' : 'md:w-72'}
                    w-64 
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className={`relative flex flex-col h-full ${isCollapsed ? 'md:p-3' : 'p-6 md:p-6'}`}>
                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex absolute -right-3 top-8 bg-[#b45a3c] text-white w-6 h-6 rounded-full items-center justify-center shadow-lg shadow-black/20 hover:scale-110 transition-transform z-10 border border-[#1a110d]"
                    >
                        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                    </button>

                    <div className={`flex items-center gap-3 mb-8 shrink-0 ${isCollapsed ? 'md:justify-center' : ''}`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#b45a3c] to-[#8a4229] rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20 shrink-0">
                            <span className="font-serif font-black text-xl text-white">U</span>
                        </div>
                        {(!isCollapsed || isMobileMenuOpen) && (
                            <div className="md:block block overflow-hidden">
                                <h1 className="font-serif text-lg tracking-wide leading-none text-white whitespace-nowrap">UrbanClay</h1>
                                <span className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-bold font-sans">Control Center</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-hide mask-fade-bottom">
                        {/* SEARCH TRIGGER */}
                        <div className="px-2 mb-6">
                            <button
                                onClick={() => setIsCommandOpen(true)}
                                className={`
                                    w-full bg-[#2a221f] hover:bg-[#3d322d] border border-white/5 rounded-xl flex items-center gap-3 transition-all group
                                    ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}
                                `}
                            >
                                <Search className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                {(!isCollapsed || isMobileMenuOpen) && (
                                    <div className="flex flex-1 justify-between items-center text-sm">
                                        <span className="text-gray-400 group-hover:text-gray-200">Search...</span>
                                        <div className="flex gap-1">
                                            <span className="bg-white/10 text-gray-500 rounded px-1.5 text-[10px] font-mono">⌘</span>
                                            <span className="bg-white/10 text-gray-500 rounded px-1.5 text-[10px] font-mono">K</span>
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>

                        {NAV_GROUPS.map((group, idx) => (
                            <div key={group.title}>
                                {(!isCollapsed || isMobileMenuOpen) && (
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 px-2">
                                        {group.title}
                                    </h3>
                                )}
                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`
                                                    group flex items-center relative transition-all duration-200
                                                    ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3'}
                                                    rounded-xl
                                                    ${isActive
                                                        ? 'bg-gradient-to-r from-[#b45a3c]/20 to-transparent text-[#b45a3c]'
                                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                    }
                                                `}
                                                title={isCollapsed ? item.label : ''}
                                            >
                                                <div className={`
                                                    ${isActive ? 'text-[#b45a3c]' : 'text-white/60 group-hover:text-white'}
                                                    transition-colors
                                                `}>
                                                    <item.icon className={`w-5 h-5 ${isCollapsed ? 'w-6 h-6' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                                                </div>

                                                {(!isCollapsed || isMobileMenuOpen) && (
                                                    <span className={`text-[13px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                                                        {item.label}
                                                    </span>
                                                )}

                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#b45a3c] rounded-r-full shadow-[0_0_10px_#b45a3c]" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`mt-auto pt-6 border-t border-white/5 shrink-0 ${isCollapsed ? 'items-center' : ''}`}>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full text-white/50 hover:text-rose-400 hover:bg-rose-500/10 p-3 rounded-xl transition-all group`}
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            {(!isCollapsed || isMobileMenuOpen) && <span className="text-xs font-bold uppercase tracking-wider">Disconnect</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ease-in-out p-4 md:p-10 overflow-y-auto min-h-[calc(100vh-64px)] md:min-h-screen
                ${isCollapsed ? 'md:ml-20' : 'md:ml-72'} 
                ml-0
            `}>
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
        </div>
    );
}
