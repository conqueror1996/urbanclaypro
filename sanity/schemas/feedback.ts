import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'feedback',
    title: 'Client Feedback',
    type: 'document',
    fields: [
        defineField({
            name: 'site',
            title: 'Project Site',
            type: 'reference',
            to: [{ type: 'site' }],
        }),
        defineField({
            name: 'workmanshipRating',
            title: 'Workmanship Rating',
            type: 'number',
            description: '1 to 5 stars',
        }),
        defineField({
            name: 'materialRating',
            title: 'Material Quality Rating',
            type: 'number',
            description: '1 to 5 stars',
        }),
        defineField({
            name: 'serviceRating',
            title: 'Service & Communication Rating',
            type: 'number',
            description: '1 to 5 stars',
        }),
        defineField({
            name: 'siteImages',
            title: 'Site Photographs',
            type: 'array',
            of: [{ type: 'image' }],
            description: 'Photos uploaded by the client',
        }),
        defineField({
            name: 'comments',
            title: 'Client Comments',
            type: 'text',
        }),
        defineField({
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'site.name',
            subtitle: 'submittedAt',
        },
    },
})
