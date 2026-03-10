import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Product Category',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Category Name',
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
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'A brief description of this product category.',
        }),
        defineField({
            name: 'image',
            title: 'Category Image / Thumbnail',
            type: 'image',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                }
            ]
        }),
        defineField({
            name: 'pillarHeroImage',
            title: 'Pillar Page Hero Image',
            description: 'The large immersive background image for this God-level Pillar Landing Page.',
            type: 'image',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                }
            ]
        }),
        defineField({
            name: 'displayOrder',
            title: 'Display Order',
            type: 'number',
            description: 'Order in which to display this category (lower numbers first)',
        }),
        defineField({
            name: 'bottomContent',
            title: 'SEO Power Text (Bottom)',
            type: 'text',
            description: 'Rich text content for SEO to be displayed at the bottom of the category page.',
        }),
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
        }),
        defineField({
            name: 'specifierToolkitImage',
            title: 'Specifier Toolkit Image',
            description: 'The unique system diagram image shown in the "Fast-Track Your Technical Specification" section for this specific category pillar page.',
            type: 'image',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                }
            ]
        }),
    ],
})
