import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product',
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
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'tag',
            title: 'Tag / Category',
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
            validation: (rule) => rule.required(),
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
            name: 'images',
            title: 'Images',
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
            title: 'Available Colors & Textures',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'name',
                            title: 'Name',
                            type: 'string',
                        },
                        {
                            name: 'image',
                            title: 'Image',
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
                            media: 'image'
                        }
                    }
                }
            ]
        }),
        defineField({
            name: 'collections',
            title: 'Collections',
            description: 'Group variants into tabs (e.g., Smooth, Linear, Rustic)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    title: 'Collection',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Collection Name',
                            type: 'string',
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'text',
                            rows: 3
                        }),
                        defineField({
                            name: 'priceRange',
                            title: 'Price Range',
                            type: 'string',
                            placeholder: '₹85 - ₹120 / sq.ft',
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
                            ],
                        }),
                        {
                            name: 'variants',
                            title: 'Variants',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        { name: 'name', title: 'Name', type: 'string' },
                                        {
                                            name: 'image',
                                            title: 'Image',
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
                                            media: 'image'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
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
                    description: 'Upload Technical Data Sheets, Installation Guides, etc.',
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
                    description: 'Upload .zip, .rvt, .obj files',
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
                    description: 'Upload Product Brochures and Catalogues',
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
