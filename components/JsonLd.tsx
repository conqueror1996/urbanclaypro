export default function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
    if (Array.isArray(data)) {
        return (
            <>
                {data.map((item, i) => (
                    <script
                        key={`jsonld-${i}`}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
                    />
                ))}
            </>
        );
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
