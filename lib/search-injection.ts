
export function extractSearchTerm(searchParams: { [key: string]: string | string[] | undefined }): string | null {
    const possibleKeys = ['q', 'query', 'k', 'keyword', 'term', 'utm_term', 'search'];

    for (const key of possibleKeys) {
        const value = searchParams[key];
        if (typeof value === 'string' && value.trim().length > 0) {
            // Decode URI component just in case, though Next.js usually handles it
            try {
                const decoded = decodeURIComponent(value).trim();
                // Basic sanitization: remove special characters that might look weird
                // We allow alphanumeric, spaces, hyphens, and basic punctuation
                return decoded.slice(0, 50); // Limit length
            } catch (e) {
                return value.trim().slice(0, 50);
            }
        }
    }

    return null;
}

export function generateDynamicTitle(baseTitle: string, searchTerm: string | null): string {
    if (!searchTerm) return baseTitle;

    // Capitalize first letter of each word for title case
    const formattedTerm = searchTerm
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    return `Premium ${formattedTerm} - UrbanClay India`;
}
