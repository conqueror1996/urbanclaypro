'use client';

import React, { useState, useEffect } from 'react';

interface TOCItem {
    id: string;
    text: string;
    level: string; // 'h2' | 'h3'
}

export default function WikiTOC({ headings }: { headings: TOCItem[] }) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0px 0px -80% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="hidden lg:block sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
            <h5 className="font-bold text-gray-900 uppercase tracking-wider text-xs mb-4">On this page</h5>
            <ul className="space-y-2 text-sm border-l border-gray-100">
                {headings.map((heading) => (
                    <li key={heading.id} className={heading.level === 'h3' ? 'pl-4' : ''}>
                        <a
                            href={`#${heading.id}`}
                            className={`block pl-3 border-l-2 transition-all duration-200 ${activeId === heading.id
                                    ? 'border-[var(--terracotta)] text-[var(--terracotta)] font-medium'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                setActiveId(heading.id);
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
