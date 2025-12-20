import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'journal',
    title: 'Journal / Blog',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'string',
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            of: [
                { type: 'block' },
                { type: 'image' },
            ],
        }),
    ],
})
