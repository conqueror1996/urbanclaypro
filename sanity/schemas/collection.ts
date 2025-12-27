export default {
    name: 'collection',
    title: 'SEO Collection Pages',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Display Title',
            type: 'string',
            description: 'The main H1 title on the page (e.g. "Exposed Wirecut Bricks")',
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            description: 'The URL path (e.g. /products/exposed-bricks)',
            options: {
                source: 'title',
                maxLength: 96
            },
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'description',
            title: 'Short Description',
            type: 'text',
            rows: 3,
            description: 'A brief description shown under the title.'
        },
        {
            name: 'seo',
            title: 'SEO Settings',
            type: 'seo',
        },
        {
            name: 'filterTags',
            title: 'Product Filter Tags',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'List of product tags/categories to automatically include in this collection (e.g. "Brick", "Wall"). Matches against Product Tags or Category Slug.'
        },
        {
            name: 'featuredImage',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'priority',
            title: 'Priority',
            type: 'number',
            initialValue: 0,
            description: 'Higher numbers appear first in lists'
        }
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'slug.current',
            media: 'featuredImage'
        }
    }
}
