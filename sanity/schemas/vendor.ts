import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'vendor',
    title: 'Vendors',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Vendor Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'companyName',
            title: 'Company Name',
            type: 'string',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Raw Materials', value: 'raw_materials' },
                    { title: 'Logistics', value: 'logistics' },
                    { title: 'Packaging', value: 'packaging' },
                    { title: 'Tools & Equipment', value: 'tools' },
                    { title: 'Others', value: 'others' },
                ],
            },
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
            title: 'Email Address',
            type: 'string',
        }),
        defineField({
            name: 'address',
            title: 'Address',
            type: 'text',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            initialValue: 'active',
            options: {
                list: [
                    { title: 'Active', value: 'active' },
                    { title: 'Inactive', value: 'inactive' },
                    { title: 'Blacklisted', value: 'blacklisted' },
                ],
            },
        }),
        defineField({
            name: 'notes',
            title: 'Notes',
            type: 'text',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'category',
        },
    },
})
