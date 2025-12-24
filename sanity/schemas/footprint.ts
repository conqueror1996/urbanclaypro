import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'footprint',
    title: 'Footprint Tracking',
    type: 'document',
    fields: [
        defineField({
            name: 'path',
            title: 'Page Path',
            type: 'string',
        }),
        defineField({
            name: 'ip',
            title: 'IP Address',
            type: 'string',
        }),
        defineField({
            name: 'userAgent',
            title: 'User Agent',
            type: 'string',
        }),
        defineField({
            name: 'timestamp',
            title: 'Timestamp',
            type: 'datetime',
        }),
    ],
    preview: {
        select: {
            title: 'path',
            subtitle: 'timestamp',
        },
    },
})
