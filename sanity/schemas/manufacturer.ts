import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'manufacturer',
    title: 'Manufacturers',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Manufacturer Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'location',
            title: 'Factory Location',
            type: 'string',
        }),
        defineField({
            name: 'contactPerson',
            title: 'Contact Person',
            type: 'string',
        }),
        defineField({
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
        }),
        defineField({
            name: 'capacity',
            title: 'Monthly Capacity',
            type: 'string',
        }),
        defineField({
            name: 'specialization',
            title: 'Specialization',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'products',
            title: 'Manufactured Products & Costs',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'productWithCost',
                    title: 'Product with Cost',
                    fields: [
                        { name: 'product', type: 'reference', to: [{ type: 'product' }], title: 'Product', description: 'Select from existing catalog' },
                        { name: 'manualProductName', type: 'string', title: 'Manual Product Name', description: 'Or enter name manually if not in catalog' },
                        { name: 'purchaseCost', type: 'number', title: 'Purchase Cost (₹)', description: 'Cost price from this manufacturer' },
                    ],
                    preview: {
                        select: {
                            title: 'product.title',
                            subtitle: 'purchaseCost',
                        },
                        prepare({ title, subtitle }) {
                            return {
                                title: title || 'Unnamed Product',
                                subtitle: subtitle ? `₹${subtitle}` : 'No cost set',
                            }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'rating',
            title: 'Rating',
            type: 'number',
            validation: (rule) => rule.min(1).max(5),
        }),
    ],
})
