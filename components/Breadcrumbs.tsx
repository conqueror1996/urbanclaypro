'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Breadcrumbs({ range }: { range?: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const parts = pathname.split('/').filter(p => p);

    // Custom label mapping for slug
    const formatLabel = (slug: string) => {
        return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const variantName = searchParams.get('variant');

    return (
        <nav className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link href="/" className="hover:text-[var(--terracotta)] transition-colors">Home</Link>

            {parts.map((part, idx) => {
                const path = `/${parts.slice(0, idx + 1).join('/')}`;
                const isLast = idx === parts.length - 1 && !variantName;

                return (
                    <React.Fragment key={path}>
                        <span className="mx-2 text-gray-300">/</span>
                        {isLast ? (
                            <span className="text-[var(--terracotta)]">{formatLabel(part)}</span>
                        ) : (
                            <>
                                <Link href={path} className="hover:text-[var(--terracotta)] transition-colors">
                                    {formatLabel(part)}
                                </Link>
                                {/* Insert Range if present and we just rendered the category (second to last item) */}
                                {range && idx === parts.length - 2 && (
                                    <>
                                        <span className="mx-2 text-gray-300">/</span>
                                        <span className="text-[#5d554f] cursor-default">{range}</span>
                                    </>
                                )}
                            </>
                        )}
                    </React.Fragment>
                );
            })}

            {variantName && (
                <>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-[var(--terracotta)]">{variantName}</span>
                </>
            )}
        </nav>
    );
}
