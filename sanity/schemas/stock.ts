import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'stock',
    title: 'Stocks',
    type: 'document',
    fields: [
        defineField({
            name: 'product',
            title: 'Product',
            type: 'reference',
            to: [{ type: 'product' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'quantity',
            title: 'Current Quantity',
            type: 'number',
            initialValue: 0,
            validation: (rule) => rule.required().min(0),
        }),
        defineField({
            name: 'unit',
            title: 'Unit',
            type: 'string',
            initialValue: 'sqft',
            options: {
                list: [
                    { title: 'Sq. Ft.', value: 'sqft' },
                    { title: 'Pieces', value: 'pcs' },
                    { title: 'Boxes', value: 'boxes' },
                    { title: 'Kgs', value: 'kgs' },
                ],
            },
        }),
        defineField({
            name: 'location',
            title: 'Warehouse/Location',
            type: 'string',
        }),
        defineField({
            name: 'minStockLevel',
            title: 'Minimum Stock Level',
            type: 'number',
            initialValue: 100,
        }),
        defineField({
            name: 'lastUpdated',
            title: 'Last Updated',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'history',
            title: 'Stock History',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'change', type: 'number', title: 'Change' },
                        { name: 'type', type: 'string', title: 'Type', options: { list: ['Add', 'Subtract', 'Correction'] } },
                        { name: 'reason', type: 'string', title: 'Reason' },
                        { name: 'timestamp', type: 'datetime', title: 'Timestamp', initialValue: () => new Date().toISOString() },
                    ]
                }
            ]
        }),
    ],
    preview: {
        select: {
            title: 'product.title',
            quantity: 'quantity',
            unit: 'unit',
        },
        prepare({ title, quantity, unit }) {
            return {
                title: title || 'Unknown Product',
                subtitle: `${quantity} ${unit} in stock`,
            }
        },
    },
})
