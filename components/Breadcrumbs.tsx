'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
    range?: string;
}

export default function Breadcrumbs({ items, range }: BreadcrumbsProps) {
    // Legacy support: If range is provided but items are not, build a default path
    const breadcrumbItems = React.useMemo(() => {
        if (items && items.length > 0) return items;
        
        if (range) {
            return [
                { name: 'Archive', href: '/products' },
                { name: range, href: `/products?search=${encodeURIComponent(range)}` }
            ];
        }
        
        return [];
    }, [items, range]);

    if (breadcrumbItems.length === 0) {
        return (
            <nav className="flex mb-8 overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/40">
                    <li className="flex items-center">
                        <Link href="/" className="hover:text-[var(--terracotta)] transition-colors flex items-center gap-1">
                            <Home className="w-3 h-3" />
                            <span>Home</span>
                        </Link>
                    </li>
                </ol>
            </nav>
        );
    }

    return (
        <nav className="flex mb-8 overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/40 h-5">
                <li className="flex items-center h-full">
                    <Link href="/" className="hover:text-[var(--terracotta)] transition-colors flex items-center gap-1 h-full leading-none">
                        <Home className="w-3 h-3 translate-y-[-0.5px]" />
                        <span className="leading-none">Home</span>
                    </Link>
                </li>
                
                {breadcrumbItems.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2 h-full">
                        <ChevronRight className="w-3 h-3 text-[var(--foreground)]/20 flex-shrink-0" />
                        {index === breadcrumbItems.length - 1 ? (
                            <span className="text-[var(--terracotta)] leading-none inline-flex items-center h-full" aria-current="page">
                                {item.name}
                            </span>
                        ) : (
                            <Link href={item.href} className="hover:text-[var(--terracotta)] transition-colors leading-none inline-flex items-center h-full">
                                {item.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
