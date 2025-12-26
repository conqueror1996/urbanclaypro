
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
        defineField({
            name: 'weatherContext',
            title: 'Weather Context Short',
            type: 'string',
            description: 'Short phrase like "Hot Dry", "Humid Coastal", etc.',
            initialValue: 'Tropical'
        }),

        // DELIVERY INFO
        defineField({
            name: 'deliveryTime',
            title: 'Typical Delivery Time',
            type: 'string',
            description: 'e.g. "24-48 Hours" or "3-5 Days"',
            initialValue: '2-4 Days'
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
        }),

        // RICH CONTENT (The "Hyper-Local" Booster)
        defineField({
            name: 'faq',
            title: 'City Specific FAQs',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'faqItem',
                    fields: [
                        { name: 'question', type: 'string', title: 'Question' },
                        { name: 'answer', type: 'text', title: 'Answer', rows: 3 }
                    ]
                }
            ],
            description: 'Add questions specific to this city to boost rank zero potential.'
        }),
        defineField({
            name: 'localImages',
            title: 'Local Project Gallery',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            description: 'Show projects actually built in this city.'
        })
    ]
})
