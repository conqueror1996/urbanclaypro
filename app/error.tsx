'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[var(--sand)] flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-red-100 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-3xl text-red-500 font-bold">!</span>
            </div>
            <h2 className="text-3xl font-serif font-medium text-[#2A1E16] mb-4">Something went wrong!</h2>
            <p className="text-[#5d554f] max-w-md mb-8">
                We apologize for the inconvenience. Please try again.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-6 py-3 bg-[var(--terracotta)] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
                Try again
            </button>
        </div>
    );
}
