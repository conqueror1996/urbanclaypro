import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'dispute',
    title: 'Disputes',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Dispute Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'relatedTo',
            title: 'Related To',
            type: 'reference',
            to: [{ type: 'lead' }, { type: 'vendor' }, { type: 'labour' }, { type: 'site' }],
        }),
        defineField({
            name: 'priority',
            title: 'Priority',
            type: 'string',
            initialValue: 'medium',
            options: {
                list: [
                    { title: 'Low', value: 'low' },
                    { title: 'Medium', value: 'medium' },
                    { title: 'High', value: 'high' },
                    { title: 'Critical', value: 'critical' },
                ],
            },
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            initialValue: 'open',
            options: {
                list: [
                    { title: 'Open', value: 'open' },
                    { title: 'Investigating', value: 'investigating' },
                    { title: 'Resolved', value: 'resolved' },
                    { title: 'Closed', value: 'closed' },
                ],
            },
        }),
        defineField({
            name: 'resolution',
            title: 'Resolution Details',
            type: 'text',
        }),
        defineField({
            name: 'dateRaised',
            title: 'Date Raised',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'status',
        },
    },
})
