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
            title: 'Manufactured Products',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
        }),
        defineField({
            name: 'rating',
            title: 'Rating',
            type: 'number',
            validation: (rule) => rule.min(1).max(5),
        }),
    ],
})
