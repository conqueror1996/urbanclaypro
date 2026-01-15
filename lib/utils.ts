
export function getTrackingLink(courier: string, trackingNumber: string): string {
    if (!trackingNumber) return '#';

    const c = courier.toLowerCase();
    const n = trackingNumber;

    if (c.includes('bluedart')) return `https://www.bluedart.com/track?handler=trakDetails&trackNo=${n}`;
    if (c.includes('delhivery')) return `https://www.delhivery.com/track/package/${n}`;
    if (c.includes('dtdc')) return `https://www.dtdc.in/tracking/shipment-tracking.asp`;
    if (c.includes('professional')) return `https://www.tpcindia.com/track-consignment-search-details.aspx?obj=${n}`;
    if (c.includes('fedex')) return `https://www.fedex.com/fedextrack/?trknbr=${n}`;

    // Default fallback
    return `https://www.google.com/search?q=${encodeURIComponent(courier + ' tracking ' + n)}`;
}

export function validateTrackingNumber(courier: string, number: string): { valid: boolean; error?: string } {
    const c = courier.toLowerCase();
    const n = number.trim().toUpperCase();

    if (!n) return { valid: false, error: 'Tracking number is required' };

    if (c.includes('bluedart')) {
        // BlueDart typically 8-11 digits
        if (!/^\d{8,11}$/.test(n)) return { valid: false, error: 'BlueDart numbers are usually 8-11 digits' };
    }
    else if (c.includes('dtdc')) {
        // DTDC: Usually letter + 8 digits (e.g. Z12345678) or just digits
        if (!/^[A-Z0-9]{8,15}$/.test(n)) return { valid: false, error: 'Invalid DTDC number format (check length)' };
    }
    else if (c.includes('professional')) {
        // Professional Courier: Usually starts with letters, 9-15 chars
        if (!/^[A-Z0-9]{8,20}$/.test(n)) return { valid: false, error: 'Invalid Professional Courier number' };
    }

    return { valid: true };
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

export function toSlug(text: string | null | undefined): string {
    return (text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function capitalizeWords(str: string): string {
    if (!str) return '';
    return str.replace(/\b\w/g, l => l.toUpperCase());
}
