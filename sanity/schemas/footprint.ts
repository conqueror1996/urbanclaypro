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
            name: 'browser',
            title: 'Browser',
            type: 'string',
        }),
        defineField({
            name: 'deviceType',
            title: 'Device Type',
            type: 'string',
        }),
        defineField({
            name: 'vitals',
            title: 'Web Vitals',
            type: 'object',
            fields: [
                { name: 'lcp', type: 'number', title: 'LCP (ms)' },
                { name: 'cls', type: 'number', title: 'CLS' },
                { name: 'fid', type: 'number', title: 'FID (ms)' },
            ]
        }),
        defineField({
            name: 'referrer',
            title: 'Referrer URL',
            type: 'string',
        }),
        defineField({
            name: 'errors', // Track JS errors for robustness
            title: 'Errors',
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
