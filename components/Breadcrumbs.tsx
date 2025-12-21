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
        <nav className="flex flex-nowrap items-center justify-start text-[10px] font-bold uppercase tracking-wide text-gray-500 leading-none">
            <Link href="/" className="hover:text-[var(--terracotta)] transition-colors flex items-center">Home</Link>

            {parts.map((part, idx) => {
                const path = `/${parts.slice(0, idx + 1).join('/')}`;
                const isLast = idx === parts.length - 1 && !variantName;

                return (
                    <React.Fragment key={path}>
                        <span className="mx-2 text-gray-300 text-[10px] flex items-center">/</span>
                        {isLast ? (
                            <span className="text-[var(--terracotta)] flex items-center whitespace-nowrap">{formatLabel(part)}</span>
                        ) : (
                            <>
                                <Link href={path} className="hover:text-[var(--terracotta)] transition-colors flex items-center whitespace-nowrap">
                                    {formatLabel(part)}
                                </Link>
                                {/* Insert Range if present and we just rendered the category (second to last item) */}
                                {range && idx === parts.length - 2 && (
                                    <>
                                        <span className="mx-2 text-gray-300 text-[10px] flex items-center">/</span>
                                        <span className="text-[#5d554f] cursor-default flex items-center whitespace-nowrap">{range}</span>
                                    </>
                                )}
                            </>
                        )}
                    </React.Fragment>
                );
            })}

            {variantName && (
                <>
                    <span className="mx-2 text-gray-300 text-[10px] flex items-center">/</span>
                    <span className="text-[var(--terracotta)] flex items-center whitespace-nowrap">{variantName}</span>
                </>
            )}
        </nav>
    );
}
