'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

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

    const navItems = [
        { label: 'Overview', href: '/dashboard', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
        { label: 'Project Lab AI', href: '/dashboard/project-lab', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
        { label: 'Operations Hub', href: '/dashboard/operations', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg> },
        { label: 'Customer Voice', href: '/dashboard/feedback', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
        { label: 'Product Catalog', href: '/dashboard/products', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
        { label: 'Journal Manager', href: '/dashboard/journal', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
        { label: 'Sales Leads', href: '/dashboard/leads', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { label: 'Sample Logistics', href: '/dashboard/samples', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
        { label: 'Inventory', href: '/dashboard/stocks', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg> },
        { label: 'Returns/Disputes', href: '/dashboard/returns', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg> },
        { label: 'SEO Suite', href: '/dashboard/seo', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
        { label: 'CMS Studio', href: '/studio', icon: (active: boolean) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
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
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white/80 hover:text-white"
                >
                    {isMobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                </button>
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
                    fixed inset-y-0 left-0 z-50 h-full bg-[var(--ink)] text-[#e9e2da] flex flex-col border-r border-white/5 shadow-2xl transition-transform duration-300 ease-in-out
                    ${isCollapsed ? 'md:w-20' : 'md:w-72'}
                    w-64 
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className={`relative ${isCollapsed ? 'md:p-4' : 'p-6 md:p-8'}`}>
                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex absolute -right-3 top-10 bg-[var(--terracotta)] text-white w-6 h-6 rounded-full items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                    >
                        <svg
                            className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className={`flex items-center gap-3 mb-8 md:mb-10 ${isCollapsed ? 'md:justify-center' : ''}`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--terracotta)] to-[#8a4229] rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20 shrink-0">
                            <span className="font-serif font-bold text-lg text-white">U</span>
                        </div>
                        {(!isCollapsed || isMobileMenuOpen) && (
                            <div className="md:block block">
                                {/* Always show text on mobile since mobile sidebar is fixed width */}
                                <h1 className={`font-serif text-lg tracking-wide leading-none text-white ${isCollapsed && !isMobileMenuOpen ? 'md:hidden' : ''}`}>UrbanClay</h1>
                                <span className={`text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium font-sans ${isCollapsed && !isMobileMenuOpen ? 'md:hidden' : ''}`}>Dashboard</span>
                            </div>
                        )}
                    </div>

                    <nav className="space-y-1 md:space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click (mobile)
                                    title={isCollapsed ? item.label : ''}
                                    className={`flex items-center ${isCollapsed ? 'md:justify-center md:px-0 md:py-3' : 'gap-4 px-4 py-3'} px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? 'bg-white/10 text-white shadow-inner font-medium'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className={`${isActive ? 'text-[var(--terracotta)]' : 'group-hover:text-[var(--terracotta)] transition-colors'}`}>
                                        {item.icon(isActive)}
                                    </span>
                                    {(!isCollapsed || isMobileMenuOpen) && (
                                        <span className={`text-sm tracking-wide whitespace-nowrap ${isCollapsed && !isMobileMenuOpen ? 'md:hidden' : ''}`}>{item.label}</span>
                                    )}
                                    {(!isCollapsed || isMobileMenuOpen) && isActive && <div className={`w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] ml-auto ${isCollapsed && !isMobileMenuOpen ? 'md:hidden' : ''}`} />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className={`mt-auto border-t border-white/5 ${isCollapsed ? 'md:p-4' : 'p-6 md:p-8'}`}>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center ${isCollapsed ? 'md:justify-center' : 'gap-3'} text-white/40 hover:text-red-400 transition-colors text-sm font-medium w-full group`}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {(!isCollapsed || isMobileMenuOpen) && <span className={`group-hover:translate-x-1 transition-transform ${isCollapsed && !isMobileMenuOpen ? 'md:hidden' : ''}`}>Logout</span>}
                    </button>
                    {(!isCollapsed || isMobileMenuOpen) && <p className={`text-[10px] text-white/20 mt-6 text-center whitespace-nowrap overflow-hidden text-ellipsis font-mono ${isCollapsed && !isMobileMenuOpen ? 'md:hidden' : ''}`}>v2.0.4 &bull; Monolith OS</p>}
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
        </div>
    );
}
