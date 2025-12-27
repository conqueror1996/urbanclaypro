import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of aggressive bots to block from SERVER access entirely
// We permit Google, Bing, DuckDuckGo, Twitter, etc.
const BAD_BOTS = [
    'bytespider',       // Aggressive TikTok scraper
    'gptbot',           // OpenAI scraper (optional, saves bandwidth)
    'dotbot',           // Mozilla crawler that can be spammy
    'semrushbot',       // SEO tools (heavy load)
    'ahrefsbot',        // SEO tools (heavy load)
    'mj12bot',          // Majestic SEO
    'petalbot',         // Huawei search
    'seznambot',        // Czech search engine (often irrelevant for India)
    'python',           // Generic scripts
    'curl',             // CLI tools
    'wget'              // CLI tools
];

/**
 * Proxy function (formerly Middleware)
 * Next.js 16+ convention for request interception.
 */
export function proxy(request: NextRequest) {
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

    // Check if the user agent matches any bad bot
    const isBadBot = BAD_BOTS.some(bot => userAgent.includes(bot));

    if (isBadBot) {
        // Return 403 Forbidden without processing the page (Saves CPU/Memory)
        return new NextResponse('Access Denied: Automated access is restricted.', { status: 403 });
    }

    return NextResponse.next();
}

// Run on all routes
export const config = {
    matcher: '/:path*',
};
