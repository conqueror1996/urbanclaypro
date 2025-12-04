'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(path => path);

    if (paths.length === 0) return null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: paths.map((path, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            item: `https://urbanclay.in/${paths.slice(0, index + 1).join('/')}`
        }))
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center space-x-2 text-sm text-[#7a6f66]">
                <li>
                    <Link href="/" className="hover:text-[var(--terracotta)] transition-colors">
                        Home
                    </Link>
                </li>
                {paths.map((path, index) => {
                    const href = `/${paths.slice(0, index + 1).join('/')}`;
                    const isLast = index === paths.length - 1;
                    const label = path.replace(/-/g, ' ');

                    return (
                        <li key={path} className="flex items-center">
                            <span className="mx-2 text-gray-400">/</span>
                            {isLast ? (
                                <span className="font-medium text-[#2A1E16] capitalize" aria-current="page">
                                    {label}
                                </span>
                            ) : (
                                <Link href={href} className="hover:text-[var(--terracotta)] transition-colors capitalize">
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
