export const metadata = {
    title: 'UrbanClay Studio',
    description: 'Content Management System',
}

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div
            id="sanity-studio-wrapper"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: '#1a1b1e',
                overflow: 'auto',
                overscrollBehavior: 'none'
            }}
        >
            {children}
        </div>
    )
}
