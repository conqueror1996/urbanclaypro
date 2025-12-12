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
        <html lang="en">
            <body id="sanity" style={{ margin: 0, overflow: 'auto' }}>
                {children}
            </body>
        </html>
    )
}
