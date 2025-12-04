import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'homePage',
    title: 'Home Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Document Title',
            type: 'string',
            description: 'Internal title for this document (e.g. "Main Home Page")',
            initialValue: 'Home Page'
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Background Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                }
            ]
        }),
        defineField({
            name: 'heroHeading',
            title: 'Hero Heading',
            type: 'string',
            description: 'Optional: Override the default hero heading'
        }),
        defineField({
            name: 'heroSubheading',
            title: 'Hero Subheading',
            type: 'string',
            description: 'Optional: Override the default hero subheading'
        }),
        defineField({
            name: 'ourStoryImage',
            title: 'Our Story Section Image',
            type: 'image',
            description: 'Image displayed in the "Our Story" section on the homepage',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                }
            ]
        })
    ],
})
