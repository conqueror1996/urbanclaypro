import { useState, useMemo } from 'react';
import { Product } from '@/lib/types';

export interface FilterState {
    category: string;
    colors: string[];
    applications: string[];
    series: string | null; // Product family/range
    budget: string | null; // Price Range or Tier
    size: string | null;
}

export const initialFilterState: FilterState = {
    category: 'All',
    colors: [],
    applications: [],
    series: null,
    budget: null,
    size: null
};

export function useProductFilter(allProducts: Product[]) {
    const [filters, setFilters] = useState<FilterState>(initialFilterState);
    const [searchTerm, setSearchTerm] = useState('');

    // Extract available options dynamically based on ALL products (for initial state)
    // or based on Category selection (Smart Defaults)
    const options = useMemo(() => {
        // Base content for options: Filter by Category first if selected
        const baseProducts = filters.category === 'All'
            ? allProducts
            : allProducts.filter(p => (p.category?.title || p.tag) === filters.category);

        // Colors (Flatten all variants)
        const colors = new Set<string>();
        // active colors are simple hex or names. We need to standardize.
        // Assuming variants have color hex or name.
        allProducts.forEach(p => {
            // If product has variants, check them
            if (p.variants) {
                p.variants.forEach(v => {
                    if (v.color) colors.add(v.color);
                });
            }
        });

        // Applications (from specs)
        const applications = new Set<string>();
        baseProducts.forEach(p => {
            if (p.specs?.application) {
                // Split by comma if multiple
                p.specs.application.split(',').forEach(app => applications.add(app.trim()));
            }
        });

        // Series (Range)
        const series = new Set<string>();
        baseProducts.forEach(p => {
            if (p.range) series.add(p.range);
        });

        // Sizes
        const sizes = new Set<string>();
        baseProducts.forEach(p => {
            if (p.specs?.size) sizes.add(p.specs.size);
        });

        return {
            colors: Array.from(colors),
            applications: Array.from(applications).sort(),
            series: Array.from(series).sort(),
            sizes: Array.from(sizes).sort()
        };
    }, [allProducts, filters.category]);

    // The Filtering Logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            // 1. Category
            if (filters.category !== 'All') {
                const pCat = product.category?.title || product.tag;
                if (pCat !== filters.category) return false;
            }

            // 2. Search Term
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matches =
                    product.title.toLowerCase().includes(term) ||
                    product.tag.toLowerCase().includes(term) ||
                    product.description.toLowerCase().includes(term);
                if (!matches) return false;
            }

            // 3. Application (OR logic for selected apps - product must match AT LEAST ONE if any selected)
            // Actually, usually users want "Flooring AND External". But products usually have "Flooring, External".
            // If user selects "Flooring", show all products that *can* be flooring.
            if (filters.applications.length > 0) {
                const pApps = product.specs?.application || '';
                // Check if pApps contains ANY of the selected filters
                const hasMatch = filters.applications.some(app => pApps.includes(app));
                if (!hasMatch) return false;
            }

            // 4. Series (Exact Match)
            if (filters.series && product.range !== filters.series) {
                return false;
            }

            // 5. Colors (Complex!)
            // We need to check if the product has ANY variant with the selected color.
            // But wait, the previous code showed variants *individually*.
            // Ideally we filter *Variants*. But here we filter *Products*.
            // The display layer handles expanding variants.
            // If we filter products, we keep a product if ANY of its variants match.
            if (filters.colors.length > 0) {
                const hasColor = product.variants?.some(v =>
                    filters.colors.includes(v.color || '') // simplified matching
                );
                if (!hasColor) return false;
            }

            // 6. Size
            if (filters.size && product.specs?.size !== filters.size) {
                return false;
            }

            return true;
        });
    }, [allProducts, filters, searchTerm]);

    // Action creators
    const setCategory = (cat: string) => setFilters(prev => ({ ...initialFilterState, category: cat })); // Reset others on cat change
    const toggleColor = (color: string) => setFilters(prev => ({
        ...prev,
        colors: prev.colors.includes(color)
            ? prev.colors.filter(c => c !== color)
            : [...prev.colors, color]
    }));
    const toggleApplication = (app: string) => setFilters(prev => ({
        ...prev,
        applications: prev.applications.includes(app)
            ? prev.applications.filter(a => a !== app)
            : [...prev.applications, app]
    }));
    const setSeries = (series: string | null) => setFilters(prev => ({ ...prev, series }));
    const setSize = (size: string | null) => setFilters(prev => ({ ...prev, size }));

    return {
        filters,
        setCategory,
        toggleColor,
        toggleApplication,
        setSeries,
        setSize,
        setSearchTerm,
        searchTerm,
        filteredProducts,
        options
    };
}
