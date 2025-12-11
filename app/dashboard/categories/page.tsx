
'use client';

import React, { useEffect, useState } from 'react';
import CategoryManager from '@/components/admin/CategoryManager';
// import { client } from '@/lib/sanity.client'; // Removed unused import

interface Category {
    _id: string;
    title: string;
    description?: string;
    slug?: { current: string };
    imageUrl?: string;
    displayOrder?: number;
}

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            // Need a client-side fetch or API route.
            // Since we have valid API tokens in env for client usage (if public),
            // or we can reuse `getProducts` logic.
            // Let's use `writeClient` via API to ensure we get fresh data not cached ISR.

            // Actually, we can just use the manage API with a new intent for full objects
            const res = await fetch('/api/products/manage?intent=categories_full');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--terracotta)]"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-80px)]">
            <CategoryManager categories={categories} onRefresh={fetchCategories} />
        </div>
    );
}
