import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'faq',
    title: 'FAQ',
    type: 'document',
    fields: [
        defineField({
            name: 'question',
            title: 'Question',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'answer',
            title: 'Answer',
            type: 'text',
            rows: 4,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'General', value: 'General' },
                    { title: 'Technical', value: 'Technical' },
                    { title: 'Installation', value: 'Installation' },
                    { title: 'Shipping', value: 'Shipping' },
                ]
            },
            initialValue: 'General'
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
        }),
    ],
})
