import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'aboutPage',
    title: 'About Page (Our Story)',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Internal Title',
            type: 'string',
            initialValue: 'Our Story Page',
            readOnly: true,
        }),
        // Hero Section
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            fields: [
                { name: 'estYear', title: 'Established Year', type: 'string', initialValue: 'Est. 2006' },
                { name: 'heading', title: 'Heading', type: 'string', initialValue: 'A Legacy of Transformation' },
                { name: 'subheading', title: 'Subheading', type: 'text', rows: 3 },
            ]
        }),
        // Main Content (Rooted in Sustainability)
        defineField({
            name: 'mainContent',
            title: 'Main Content',
            type: 'object',
            fields: [
                { name: 'heading', title: 'Heading', type: 'string', initialValue: 'Rooted in Sustainability' },
                { name: 'body', title: 'Body Text', type: 'array', of: [{ type: 'block' }] },
                { name: 'image', title: 'Main Image', type: 'image', options: { hotspot: true } },
                {
                    name: 'promise',
                    title: 'Our Promise Box',
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', initialValue: 'Our Promise' },
                        { name: 'text', type: 'text' }
                    ]
                }
            ]
        }),
        // Stats
        defineField({
            name: 'stats',
            title: 'Statistics',
            type: 'object',
            fields: [
                { name: 'yearsExperience', title: 'Years of Experience', type: 'number' },
                { name: 'projectsCompleted', title: 'Projects Completed', type: 'number' },
                { name: 'citiesCovered', title: 'Cities Covered', type: 'number' },
                { name: 'treesPlanted', title: 'Trees Planted (Thouands)', type: 'number' },
            ]
        }),
        // Timeline
        defineField({
            name: 'timeline',
            title: 'Timeline Milestones',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'year', title: 'Year', type: 'string' },
                        { name: 'title', title: 'Title', type: 'string' },
                        { name: 'description', title: 'Description', type: 'text' },
                    ]
                }
            ]
        }),
        // Vision Section
        defineField({
            name: 'vision',
            title: 'Vision Section',
            type: 'object',
            fields: [
                { name: 'heading', title: 'Heading', type: 'string' },
                { name: 'text', title: 'Text', type: 'text', rows: 4 },
            ]
        })
    ],
})
