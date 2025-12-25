
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'backlink',
    title: 'Backlink Opportunity',
    type: 'document',
    fields: [
        defineField({
            name: 'domain',
            title: 'Target Domain',
            type: 'string',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'To Contact', value: 'pending' },
                    { title: 'Contacted', value: 'contacted' },
                    { title: 'Published', value: 'published' },
                    { title: 'Rejected', value: 'rejected' }
                ]
            },
            initialValue: 'pending'
        }),
        defineField({
            name: 'dr',
            title: 'Domain Rating (Est)',
            type: 'number'
        }),
        defineField({
            name: 'notes',
            title: 'Notes',
            type: 'text'
        })
    ]
})
