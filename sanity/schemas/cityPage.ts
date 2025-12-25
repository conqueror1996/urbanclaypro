
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'cityPage',
    title: 'City Landing Page',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'City Name',
            type: 'string',
            validation: (rule) => rule.required(),
            readOnly: true
        }),
        defineField({
            name: 'slug',
            title: 'City Slug',
            type: 'slug',
            validation: (rule) => rule.required(),
            readOnly: true
        }),
        defineField({
            name: 'region',
            title: 'Region',
            type: 'string',
            options: {
                list: [
                    { title: 'West', value: 'West' },
                    { title: 'North', value: 'North' },
                    { title: 'South', value: 'South' },
                    { title: 'East', value: 'East' },
                ]
            }
        }),

        // SEO METADATA
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            validation: (rule) => rule.max(70).warning('Title should be under 70 chars')
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            validation: (rule) => rule.max(160).warning('Description should be under 160 chars')
        }),

        // PAGE CONTENT
        defineField({
            name: 'heroTitle',
            title: 'Hero Heading Prefix',
            type: 'string',
            description: 'Text before the city name. e.g. "Premium Terracotta Tiles in"'
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero Subtext',
            type: 'text',
            rows: 2
        }),
        defineField({
            name: 'climateAdvice',
            title: 'Local Climate Advice',
            type: 'text',
            rows: 4,
            description: 'Why terracotta is good for this specific city\'s weather.'
        }),

        // LISTS
        defineField({
            name: 'areasServed',
            title: 'Areas Served',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'List of neighborhoods (e.g. Bandra, Andheri) for local SEO.'
        }),
        defineField({
            name: 'popularProducts',
            title: 'Popular Products Override',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Specific product keywords for this city.'
        })
    ]
})
