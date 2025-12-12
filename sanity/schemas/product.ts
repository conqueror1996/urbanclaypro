import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product Range',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Collection Name',
            description: 'The name of this collection (e.g. Handmade Brick, Wirecut Brick)',
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
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'tag',
            title: 'Category',
            description: 'The top-level category this collection belongs to',
            type: 'string',
            options: {
                list: [
                    { title: 'Brick Wall Tiles', value: 'Brick Wall Tiles' },
                    { title: 'Exposed Bricks', value: 'Exposed Bricks' },
                    { title: 'Terracotta Jaali', value: 'Jaali' },
                    { title: 'Roof Tiles', value: 'Roof Tile' },
                    { title: 'Terracotta Panels', value: 'Terracotta Panels' },
                    { title: 'Clay Ceiling Tile', value: 'Clay Ceiling Tile' },
                    { title: 'Clay Floor Tiles', value: 'Floor Tiles' },
                ],
            },
            // Legacy field, keeping for now to avoid breaking existing data immediately
            hidden: true,
        }),
        defineField({
            name: 'category',
            title: 'Category Reference',
            description: 'Select the category this collection belongs to (Replaces the old dropdown)',
            type: 'reference',
            to: [{ type: 'category' }],
        }),
        defineField({
            name: 'range',
            title: 'Range/Collection',
            description: 'Group products into ranges (e.g., Handmade Collection, Wirecut Collection, Extruded Collection)',
            type: 'string',
            placeholder: 'e.g., Handmade Collection',
        }),
        defineField({
            name: 'priceRange',
            title: 'Price Range',
            type: 'string',
            placeholder: '₹85 - ₹120 / sq.ft',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
        }),
        defineField({
            name: 'images',
            title: 'Range Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative Text',
                        }
                    ]
                }
            ],
        }),
        defineField({
            name: 'variants',
            title: 'Variants (Colors/Finishes)',
            description: 'Individual color variants within this collection (e.g., Deep Rustic Red, Charcoal Smoky)',
            type: 'array',
            of: [
                {
                    name: 'variant',
                    type: 'object',
                    title: 'Variant',
                    fields: [
                        {
                            name: 'name',
                            title: 'Variant Name',
                            type: 'string',
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: 'family',
                            title: 'Family Group',
                            description: 'Optional: Group variants together (e.g. "Rustic Red Series")',
                            type: 'string',
                        },
                        {
                            name: 'slug',
                            title: 'Variant Slug',
                            type: 'slug',
                            options: {
                                source: (doc, options) => {
                                    const parent = options.parent as { name?: string };
                                    return parent?.name || '';
                                },
                                maxLength: 96,
                            },
                        },
                        {
                            name: 'image',
                            title: 'Variant Image',
                            type: 'image',
                            options: { hotspot: true },
                            fields: [
                                {
                                    name: 'alt',
                                    type: 'string',
                                    title: 'Alternative Text',
                                }
                            ]
                        },
                        {
                            name: 'gallery',
                            title: 'Additional Images',
                            type: 'array',
                            of: [{ type: 'image', options: { hotspot: true } }]
                        }
                    ],
                    preview: {
                        select: {
                            title: 'name',
                            subtitle: 'family',
                            media: 'image'
                        },
                        prepare({ title, subtitle, media }) {
                            return {
                                title: title,
                                subtitle: subtitle ? `Family: ${subtitle}` : 'Single Variant',
                                media: media
                            }
                        }
                    }
                }
            ]
        }),
        defineField({
            name: 'specs',
            title: 'Specifications',
            type: 'object',
            fields: [
                defineField({ name: 'size', title: 'Size', type: 'string' }),
                defineField({ name: 'thickness', title: 'Thickness', type: 'string' }),
                defineField({ name: 'coverage', title: 'Coverage', type: 'string' }),
                defineField({ name: 'weight', title: 'Weight', type: 'string' }),
                defineField({ name: 'waterAbsorption', title: 'Water Absorption', type: 'string' }),
                defineField({ name: 'compressiveStrength', title: 'Compressive Strength', type: 'string' }),
                defineField({ name: 'firingTemperature', title: 'Firing Temperature', type: 'string' }),
                defineField({ name: 'efflorescence', title: 'Efflorescence', type: 'string' }),
                defineField({ name: 'application', title: 'Application', type: 'string' }),
            ],
        }),
        defineField({
            name: 'resources',
            title: 'Downloads & Resources',
            type: 'object',
            fields: [
                defineField({
                    name: 'technicalSheets',
                    title: 'Technical Sheets',
                    type: 'array',
                    of: [{
                        type: 'file',
                        options: { accept: '.pdf' },
                        fields: [
                            { name: 'title', type: 'string', title: 'Title', initialValue: 'Technical Sheet' }
                        ]
                    }]
                }),
                defineField({
                    name: 'bimModels',
                    title: 'BIM & 3D Models',
                    type: 'array',
                    of: [{
                        type: 'file',
                        options: { accept: '.zip,.rvt,.obj,.fbx' },
                        fields: [
                            { name: 'title', type: 'string', title: 'Title', initialValue: '3D Model' }
                        ]
                    }]
                }),
                defineField({
                    name: 'productCatalogues',
                    title: 'Product Catalogues',
                    type: 'array',
                    of: [{
                        type: 'file',
                        options: { accept: '.pdf' },
                        fields: [
                            { name: 'title', type: 'string', title: 'Title', initialValue: 'Product Catalogue' }
                        ]
                    }]
                }),
            ]
        }),
    ],
})
