import { createClient, type SanityClient } from 'next-sanity';
import { groq } from 'next-sanity';

let client: SanityClient;
try {
    client = createClient({
        apiVersion: '2024-11-28',
        dataset: 'production',
        projectId: '22qqjddz',
        useCdn: false,
    });
} catch (e) {
    console.error("Sanity client creation failed:", e);
    client = { fetch: async () => [] } as unknown as SanityClient;
}

export interface AboutPageData {
    title: string;
    hero: {
        estYear: string;
        heading: string;
        subheading: string;
    };
    mainContent: {
        heading: string;
        body: any[];
        imageUrl: string;
        promise: {
            title: string;
            text: string;
        };
    };
    stats: {
        yearsExperience: number;
        projectsCompleted: number;
        citiesCovered: number;
        treesPlanted: number;
    };
    timeline: {
        year: string;
        title: string;
        description: string;
    }[];
    vision: {
        heading: string;
        text: string;
    };
}

const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
    title,
    hero,
    mainContent {
        heading,
        body,
        "imageUrl": image.asset->url,
        promise
    },
    stats,
    timeline,
    vision
}`;

export async function getAboutPageData(): Promise<AboutPageData | null> {
    try {
        const data = await client.fetch(aboutPageQuery, {}, { next: { revalidate: 60 } });
        return data;
    } catch (error) {
        console.error('Error fetching about page data:', error);
        return null;
    }
}

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    category: string;
    order?: number;
}

const faqQuery = groq`*[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    category
}`;

export async function getFAQs(): Promise<FAQ[]> {
    try {
        const faqs = await client.fetch(faqQuery, {}, { next: { revalidate: 60 } });
        return faqs || [];
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }
}
