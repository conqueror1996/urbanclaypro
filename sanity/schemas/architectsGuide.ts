import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'architectsGuide',
    title: 'Architect\'s Handbook Page',
    type: 'document',
    groups: [
        { name: 'hero', title: 'Hero Section' },
        { name: 'content', title: 'Main Content' },
        { name: 'seo', title: 'SEO' }
    ],
    fields: [
        // HERO SECTION
        defineField({
            name: 'heroLabel',
            title: 'Hero Badge Label',
            type: 'string',
            initialValue: 'The Architect\'s Handbook',
            group: 'hero'
        }),
        defineField({
            name: 'title',
            title: 'Main Title',
            type: 'string',
            initialValue: 'Mastering Architectural Clay.',
            group: 'hero'
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'text',
            rows: 3,
            initialValue: 'From high-performance generic cladding systems to the humble wirecut brick—everything you need to specify clay with confidence.',
            group: 'hero'
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: { hotspot: true },
            group: 'hero'
        }),

        // SECTION 1: INTRODUCTION
        defineField({
            name: 'introTitle',
            title: 'Section 1 Title',
            type: 'string',
            initialValue: 'Why the world is returning to Clay',
            group: 'content'
        }),
        defineField({
            name: 'introText',
            title: 'Section 1 text',
            type: 'text',
            rows: 4,
            group: 'content'
        }),
        defineField({
            name: 'benefits',
            title: 'Key Benefits List',
            type: 'array',
            of: [{ type: 'string' }],
            group: 'content'
        }),

        // SECTION 2: FACADE SYSTEMS
        defineField({
            name: 'systemsTitle',
            title: 'Section 2 Title',
            type: 'string',
            initialValue: 'Dry Cladding vs Wet Cladding',
            group: 'content'
        }),
        defineField({
            name: 'systemsIntro',
            title: 'Section 2 Intro',
            type: 'text',
            group: 'content'
        }),
        defineField({
            name: 'drySystem',
            title: 'Dry Cladding Card',
            type: 'object',
            fields: [
                { name: 'title', type: 'string' },
                { name: 'bestFor', type: 'string' },
                { name: 'description', type: 'text' },
                { name: 'image', type: 'image' },
                { name: 'linkUrl', type: 'string' }
            ],
            group: 'content'
        }),
        defineField({
            name: 'wetSystem',
            title: 'Wet Cladding Card',
            type: 'object',
            fields: [
                { name: 'title', type: 'string' },
                { name: 'bestFor', type: 'string' },
                { name: 'description', type: 'text' },
                { name: 'image', type: 'image' },
                { name: 'linkUrl', type: 'string' }
            ],
            group: 'content'
        }),

        // SECTION 3: BRICK COMPARISON
        defineField({
            name: 'brickTitle',
            title: 'Section 3 Title',
            type: 'string',
            initialValue: 'Wirecut vs Handmade Bricks',
            group: 'content'
        }),
        defineField({
            name: 'brickIntro',
            title: 'Section 3 Intro',
            type: 'text',
            group: 'content'
        }),
        defineField({
            name: 'comparisonTable',
            title: 'Comparison Matrix',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'feature', type: 'string', title: 'Feature' },
                        { name: 'wirecut', type: 'string', title: 'Wirecut Value' },
                        { name: 'handmade', type: 'string', title: 'Handmade Value' }
                    ],
                    preview: {
                        select: {
                            title: 'feature',
                            subtitle: 'wirecut'
                        }
                    }
                }
            ],
            group: 'content'
        }),

        // SECTION 4: JAALIS
        defineField({
            name: 'jaaliTitle',
            title: 'Section 4 Title',
            type: 'string',
            initialValue: 'The Breathing Wall: Terracotta Jaalis',
            group: 'content'
        }),
        defineField({
            name: 'jaaliIntro',
            title: 'Section 4 Intro',
            type: 'text',
            group: 'content'
        }),
        defineField({
            name: 'jaaliQuote',
            title: 'Highlight Quote',
            type: 'text',
            rows: 2,
            group: 'content'
        }),

        // SEO
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            group: 'seo'
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            group: 'seo'
        }),
        defineField({
            name: 'seoImage',
            title: 'SEO Share Image',
            type: 'image',
            group: 'seo'
        })
    ]
})
