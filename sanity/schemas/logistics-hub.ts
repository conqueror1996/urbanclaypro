import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'logisticsHub',
    title: 'Logistics Hubs',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Hub Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'locationName',
            title: 'City/Region',
            type: 'string',
            description: 'e.g. Bangalore, Morbi, Noida',
        }),
        defineField({
            name: 'lat',
            title: 'Latitude',
            type: 'number',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'lng',
            title: 'Longitude',
            type: 'number',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'type',
            title: 'Hub Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Factory / Manufacturing Unit', value: 'factory' },
                    { title: 'Warehouse / Distribution Center', value: 'warehouse' },
                    { title: 'Showroom / Experience Center', value: 'showroom' },
                ],
            },
        }),
        defineField({
            name: 'isActive',
            title: 'Available for Logistics Calculation',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'locationName',
        },
    },
})
