import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'resource',
    title: 'Downloadable Resource',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'type',
            title: 'Resource Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Technical Guide', value: 'Technical Guide' },
                    { title: 'BIM / CAD', value: 'BIM/CAD' },
                    { title: 'Brochure', value: 'Brochure' },
                    { title: 'Manual', value: 'Manual' },
                    { title: 'Report', value: 'Report' },
                ],
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'file',
            title: 'File',
            type: 'file',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'size',
            title: 'File Size (Display Label)',
            type: 'string',
            description: 'e.g. "4.2 MB"',
        }),
    ],
})
