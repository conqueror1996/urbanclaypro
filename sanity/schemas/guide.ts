import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'selectionGuide',
    title: 'Selection Guide',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Selection Guide'
        }),
        // Section 1: The Clay Spectrum
        defineField({
            name: 'spectrumItems',
            title: 'The Clay Spectrum Items',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', title: 'Title' },
                        { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
                        { name: 'description', type: 'text', title: 'Description' },
                        {
                            name: 'features',
                            type: 'array',
                            title: 'Features',
                            of: [{ type: 'string' }]
                        }
                    ]
                }
            ]
        }),
        // Section 2: Comparison Matrix
        defineField({
            name: 'comparisonRows',
            title: 'Comparison Matrix Rows',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'feature', type: 'string', title: 'Feature Name' },
                        { name: 'wirecut', type: 'string', title: 'Wirecut Value' },
                        { name: 'pressed', type: 'string', title: 'Pressed Value' },
                        { name: 'handmade', type: 'string', title: 'Handmade Value' }
                    ],
                    preview: {
                        select: {
                            title: 'feature',
                            subtitle: 'wirecut'
                        }
                    }
                }
            ]
        }),
        // Section 3: Technical Glossary
        defineField({
            name: 'glossaryItems',
            title: 'Technical Glossary Items',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'term', type: 'string', title: 'Term' },
                        { name: 'definition', type: 'text', title: 'Definition' }
                    ]
                }
            ]
        })
    ]
})
