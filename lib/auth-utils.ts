/**
 * Ensures the authentication cookie is set before making API calls
 * This prevents "Unauthorized" errors when the cookie gets cleared
 */
export function ensureAuthCookie(): boolean {
    if (typeof window === 'undefined') return false;

    // Check if cookie exists
    if (document.cookie.includes('uc_admin_token=')) {
        return true;
    }

    // Try to restore from localStorage
    const storedPassword = localStorage.getItem('uc_admin_password');
    if (storedPassword) {
        document.cookie = `uc_admin_token=${storedPassword}; path=/; max-age=31536000; SameSite=Lax`;
        return true;
    }

    return false;
}

/**
 * Makes an authenticated API call with automatic cookie restoration
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Ensure cookie is set
    if (!ensureAuthCookie()) {
        throw new Error('Authentication required. Please log in again.');
    }

    // Make the request
    const response = await fetch(url, {
        ...options,
        credentials: 'include', // Ensure cookies are sent
    });

    // If unauthorized, try one more time after ensuring cookie
    if (response.status === 401) {
        ensureAuthCookie();
        return fetch(url, {
            ...options,
            credentials: 'include',
        });
    }

    return response;
}
