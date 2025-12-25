import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'return',
    title: 'Returns',
    type: 'document',
    fields: [
        defineField({
            name: 'lead',
            title: 'Original Lead/Order',
            type: 'reference',
            to: [{ type: 'lead' }],
        }),
        defineField({
            name: 'product',
            title: 'Product Returned',
            type: 'reference',
            to: [{ type: 'product' }],
        }),
        defineField({
            name: 'quantity',
            title: 'Quantity Returned',
            type: 'number',
        }),
        defineField({
            name: 'reason',
            title: 'Reason for Return',
            type: 'text',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            initialValue: 'pending',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Approved', value: 'approved' },
                    { title: 'Rejected', value: 'rejected' },
                    { title: 'Material Received', value: 'received' },
                    { title: 'Refunded/Credit Issued', value: 'refunded' },
                ],
            },
        }),
        defineField({
            name: 'date',
            title: 'Return Date',
            type: 'date',
            initialValue: () => new Date().toISOString().split('T')[0],
        }),
        defineField({
            name: 'photos',
            title: 'Photos of Damaged Material',
            type: 'array',
            of: [{ type: 'image' }],
        }),
    ],
    preview: {
        select: {
            title: 'lead.contact',
            subtitle: 'reason',
        },
        prepare({ title, subtitle }) {
            return {
                title: title || 'Anonymous Return',
                subtitle: subtitle,
            }
        },
    },
})
