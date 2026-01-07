import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product Range',
    type: 'document',
    groups: [
        { name: 'editorial', title: 'Editorial', default: true },
        { name: 'variants', title: 'Variants & Images' },
        { name: 'specs', title: 'Specifications' },
        { name: 'downloads', title: 'Downloads' },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Collection Name',
            description: 'The name of this collection (e.g. Handmade Brick, Wirecut Brick)',
            type: 'string',
            group: 'editorial',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'editorial',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'sku',
            title: 'SKU / Product Code',
            description: 'Unique identifier for internal tracking and search engines',
            type: 'string',
            group: 'editorial',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
            group: 'editorial',
        }),
        defineField({
            name: 'tag',
            title: 'Category',
            description: 'The top-level category this collection belongs to',
            type: 'string',
            group: 'editorial',
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
            group: 'editorial',
            to: [{ type: 'category' }, { type: 'collection' }],
        }),
        defineField({
            name: 'range',
            title: 'Range/Collection',
            description: 'Group products into ranges (e.g., Handmade Collection, Wirecut Collection, Extruded Collection)',
            type: 'string',
            group: 'editorial',
            placeholder: 'e.g., Handmade Collection',
        }),
        defineField({
            name: 'priceRange',
            title: 'Price Range',
            type: 'string',
            group: 'editorial',
            placeholder: '₹85 - ₹120 / sq.ft',
        }),
        defineField({
            name: 'priceTier',
            title: 'Price Tier',
            type: 'string',
            group: 'editorial',
            options: {
                list: [
                    { title: 'Budget (₹ 40-70)', value: 'low' },
                    { title: 'Mid-Range (₹ 70-120)', value: 'mid' },
                    { title: 'Premium (₹ 120+)', value: 'high' },
                ],
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            group: 'editorial',
            rows: 5,
        }),
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
            group: 'seo',
        }),
        defineField({
            name: 'images',
            title: 'Range Images',
            type: 'array',
            group: 'variants',
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
            group: 'variants',
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
                            name: 'color',
                            title: 'Color Family',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Red / Terracotta', value: 'Red' },
                                    { title: 'Brown / Earth', value: 'Brown' },
                                    { title: 'Grey / Black', value: 'Grey' },
                                    { title: 'Beige / Sand', value: 'Beige' },
                                    { title: 'White / Cream', value: 'White' },
                                    { title: 'Multicolor', value: 'Multicolor' },
                                ],
                            },
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
                        },
                        {
                            name: 'badge',
                            title: 'Badge',
                            description: 'Add a badge like "New", "Premium", or "Hot"',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'None', value: '' },
                                    { title: 'New', value: 'New' },
                                    { title: 'Premium', value: 'Premium' },
                                    { title: 'Best Seller', value: 'Best Seller' },
                                    { title: 'Hot', value: 'Hot' },
                                ],
                            },
                        },
                        {
                            name: 'seo',
                            title: 'Variant Specific SEO',
                            description: 'Override the default SEO for this specific color/finish',
                            type: 'seo',
                        }
                    ],
                    preview: {
                        select: {
                            title: 'name',
                            subtitle: 'family',
                            color: 'color',
                            media: 'image'
                        },
                        prepare({ title, subtitle, color, media }) {
                            return {
                                title: title,
                                subtitle: [color, subtitle].filter(Boolean).join(' • ') || 'No color/family set',
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
            group: 'specs',
            fields: [
                defineField({ name: 'size', title: 'Size', type: 'string' }),
                defineField({ name: 'thickness', title: 'Thickness', type: 'string' }),
                defineField({ name: 'coverage', title: 'Coverage', type: 'string' }),
                defineField({ name: 'weight', title: 'Weight (Display String)', type: 'string' }),
                defineField({ name: 'unitWeightKg', title: 'Unit Weight (kg)', type: 'number', description: 'Numeric weight for logistics calculations' }),
                defineField({ name: 'waterAbsorption', title: 'Water Absorption', type: 'string' }),
                defineField({ name: 'compressiveStrength', title: 'Compressive Strength', type: 'string' }),
                defineField({ name: 'firingTemperature', title: 'Firing Temperature', type: 'string' }),
                defineField({ name: 'efflorescence', title: 'Efflorescence', type: 'string' }),
                defineField({ name: 'application', title: 'Application', type: 'string' }),
            ],
        }),
        defineField({
            name: 'texturePackage',
            title: 'PBR Texture Package',
            type: 'object',
            group: 'specs',
            fields: [
                defineField({
                    name: 'seamlessPreview',
                    title: 'Seamless Preview (4K)',
                    type: 'image',
                    description: 'A seamless tileable image of the texture.',
                    options: { hotspot: true }
                }),
                defineField({
                    name: 'downloadFile',
                    title: 'Texture Maps (ZIP)',
                    type: 'file',
                    description: 'Zip file containing Albedo, Normal, Roughness, Displacement maps.'
                })
            ]
        }),
        defineField({
            name: 'resources',
            title: 'Downloads & Resources',
            type: 'object',
            group: 'downloads',
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
