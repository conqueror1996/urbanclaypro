
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'wikiArticle',
    title: 'Wiki / Technical Article',
    type: 'document',
    groups: [
        { name: 'content', title: 'Content' },
        { name: 'seo', title: 'SEO' },
        { name: 'relations', title: 'Relations' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Article Title',
            type: 'string',
            validation: (rule) => rule.required(),
            group: 'content'
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (rule) => rule.required(),
            group: 'content'
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Installation Guide', value: 'installation' },
                    { title: 'Technical Specification', value: 'technical' },
                    { title: 'Maintenance & Care', value: 'maintenance' },
                    { title: 'Material Science', value: 'science' },
                    { title: 'Architectural History', value: 'history' }
                ]
            },
            validation: (rule) => rule.required(),
            group: 'content'
        }),
        defineField({
            name: 'difficulty',
            title: 'Technical Level',
            type: 'string',
            options: {
                list: [
                    { title: 'Beginner (Homeowner)', value: 'beginner' },
                    { title: 'Intermediate (Contractor)', value: 'intermediate' },
                    { title: 'Advanced (Architect/Engineer)', value: 'advanced' }
                ]
            },
            initialValue: 'beginner',
            group: 'content'
        }),
        defineField({
            name: 'summary',
            title: 'Short Summary',
            type: 'text',
            rows: 3,
            description: 'Executive summary for search results and previews.',
            group: 'content'
        }),
        defineField({
            name: 'content',
            title: 'Article Content',
            type: 'array',
            of: [
                { type: 'block' },
                { type: 'image', options: { hotspot: true } },
                {
                    type: 'object',
                    name: 'infoBox',
                    title: 'Info Box / Pro Tip',
                    fields: [
                        { name: 'type', type: 'string', options: { list: ['Tip', 'Warning', 'Note'] } },
                        { name: 'text', type: 'text' }
                    ]
                },
                // Table support would go here if using a plugin, or we simulate it with custom objects
            ],
            group: 'content'
        }),

        // RELATIONS
        defineField({
            name: 'relatedProducts',
            title: 'Related Products',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'product' } }],
            group: 'relations'
        }),
        defineField({
            name: 'relatedDownloads',
            title: 'Related Downloads (PDFs)',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'resource' } }],
            group: 'relations'
        }),

        // SEO
        defineField({
            name: 'seo',
            title: 'SEO Metadata',
            type: 'seo', // Using your existing SEO object if available, else standard fields
            group: 'seo'
        })
    ]
})
