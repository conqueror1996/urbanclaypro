'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('uc_admin_auth') === 'true') {
            setIsAuthenticated(true);
            // Restore cookie if missing (e.g., after browser restart or cookie cleared)
            const storedPassword = localStorage.getItem('uc_admin_password');
            if (storedPassword && !document.cookie.includes('uc_admin_token=')) {
                document.cookie = `uc_admin_token=${storedPassword}; path=/; max-age=31536000; SameSite=Lax`;
            }
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'clay2025' || password === 'admin') {
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
            <div className="min-h-screen bg-[#1a1512] flex items-center justify-center p-4 font-sans">
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

    const navItems = [
        { label: 'Overview', href: '/dashboard', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
        { label: 'Product Catalog', href: '/dashboard/products', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
        { label: 'Categories', href: '/dashboard/categories', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
        { label: 'Projects', href: '/dashboard/projects', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
        { label: 'Sales Leads', href: '/dashboard/leads', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    ];

    return (
        <div className="min-h-screen bg-[#f8f7f6] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-[#1a1512] text-white flex flex-col fixed h-full z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--terracotta)] to-[#8a4229] rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                            <span className="font-serif font-bold text-lg">U</span>
                        </div>
                        <div>
                            <h1 className="font-serif text-lg tracking-wide leading-none">UrbanClay</h1>
                            <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">Dashboard</span>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? 'bg-white/10 text-white shadow-inner font-medium'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className={isActive ? 'text-[var(--terracotta)]' : 'group-hover:text-[var(--terracotta)] transition-colors'}>
                                        {item.icon(isActive)}
                                    </span>
                                    <span className="text-sm tracking-wide">{item.label}</span>
                                    {isActive && <motion.div layoutId="nav-indicator" className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-white/40 hover:text-red-400 transition-colors text-sm font-medium w-full group">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="group-hover:translate-x-1 transition-transform">Logout</span>
                    </button>
                    <p className="text-[10px] text-white/20 mt-6 text-center">Version 2.0.4 &bull; Built by DeepMind</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 overflow-y-auto min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
