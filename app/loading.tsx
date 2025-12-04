export default function Loading() {
    return (
        <div className="min-h-screen bg-[var(--sand)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--terracotta)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[var(--ink)] font-medium animate-pulse">Loading UrbanClay...</p>
            </div>
        </div>
    );
}
