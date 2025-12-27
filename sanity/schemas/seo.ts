import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'seo',
    title: 'SEO & Social',
    type: 'object',
    fields: [
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            description: 'Title used for search engines and browser tabs.',
            validation: (rule) => rule.max(60).warning('Longer titles may be truncated by search engines'),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            description: 'Description for search engines.',
            validation: (rule) => rule.max(160).warning('Longer descriptions may be truncated by search engines'),
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Keywords for metadata.',
        }),
        defineField({
            name: 'openGraphImage',
            title: 'Open Graph Image (Main)',
            type: 'image',
            description: 'Primary image for sharing on social media.',
        }),
        defineField({
            name: 'openGraphImages',
            title: 'Additional Open Graph Images',
            type: 'array',
            of: [{ type: 'image' }],
            description: 'Additional images for sharing. Some platforms may show these as a gallery.',
        }),
        defineField({
            name: 'lastAutomatedUpdate',
            title: 'Last Automated Update',
            type: 'datetime',
            readOnly: true,
            description: 'When the AI last updated these fields.',
        }),
        defineField({
            name: 'aiInsights',
            title: 'AI Insights',
            type: 'text',
            readOnly: true,
            description: 'Why the AI chose these tags.',
        }),
    ],
})
