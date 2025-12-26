
import { Product } from "./types";

export const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "UrbanClay",
    "url": "https://claytile.in",
    "logo": "https://claytile.in/images/logo.png",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9876543210", // Example
        "contactType": "sales",
        "areaServed": "IN"
    },
    "sameAs": [
        "https://instagram.com/urbanclay",
        "https://linkedin.com/company/urbanclay"
    ]
});

export const generateProductSchema = (product: Product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images?.[0]?.url,
    "description": product.seo?.metaDescription || product.description,
    "brand": {
        "@type": "Brand",
        "name": "UrbanClay"
    },
    // Assuming Indian pricing structure could be dynamic, filler for now
    "offers": {
        "@type": "Offer",
        "url": `https://claytile.in/products/${product.category?.slug}/${product.slug}`,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
    }
});

export const generateArticleSchema = (post: any) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": post.coverImage?.url,
    "author": {
        "@type": "Organization",
        "name": "UrbanClay Editorial"
    },
    "publisher": {
        "@type": "Organization",
        "name": "UrbanClay",
        "logo": {
            "@type": "ImageObject",
            "url": "https://claytile.in/logo.png"
        }
    },
    "datePublished": post.publishedAt
});
