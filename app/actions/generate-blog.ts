
'use server'

import { writeClient } from '@/sanity/lib/write-client';
import { generateBlogDraft } from '@/lib/ai/content-generator';

export async function createBlogDraft(formData: FormData) {
    const topic = formData.get('topic') as string;
    const tone = formData.get('tone') as any;
    const audience = formData.get('audience') as any;

    if (!topic) return { success: false, error: 'Topic is required' };

    try {
        const blogPost = await generateBlogDraft({
            topic,
            tone,
            targetAudience: audience
        });

        if (!blogPost) throw new Error('Failed to generate content');

        // Simple Markdown to Portable Text visualizer
        // In a real app, we'd use a parser. Here we make a simple block for the whole text
        // or split by paragraphs.
        const blocks = blogPost.content.split('\n\n').map(para => {
            if (para.startsWith('# ')) {
                return {
                    _type: 'block',
                    style: 'h1',
                    children: [{ _type: 'span', text: para.replace('# ', '') }]
                };
            }
            if (para.startsWith('## ')) {
                return {
                    _type: 'block',
                    style: 'h2',
                    children: [{ _type: 'span', text: para.replace('## ', '') }]
                };
            }
            if (para.startsWith('### ')) {
                return {
                    _type: 'block',
                    style: 'h3',
                    children: [{ _type: 'span', text: para.replace('### ', '') }]
                };
            }
            return {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: para }]
            };
        });

        // Create as a DRAFT by using the drafts. prefix
        const draftId = `drafts.${require('crypto').randomUUID()}`;

        const doc = {
            _id: draftId,
            _type: 'journal',
            title: blogPost.title,
            slug: blogPost.slug,
            excerpt: blogPost.excerpt,
            publishedAt: new Date().toISOString(),
            author: 'UrbanClay AI',
            body: blocks,
            seo: blogPost.seo
        };

        const result = await writeClient.create(doc);

        return {
            success: true,
            id: result._id,
            title: blogPost.title,
            slug: blogPost.slug.current,
            excerpt: blogPost.excerpt,
            content: blogPost.content
        };

    } catch (error: any) {
        console.error('Create Draft Error:', error);
        return { success: false, error: error.message };
    }
}
