'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { structure } from './sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { schema } from './sanity/schemas'

export default defineConfig({
    basePath: '/studio',
    projectId: '22qqjddz',
    dataset: 'production',
    // Add and edit the content schema in the './sanity/schema' folder
    schema: {
        types: schema.types,
        templates: (prev) => [
            ...prev,
            {
                id: 'product-by-category',
                title: 'Product by Category',
                description: 'Product belonging to a specific category',
                schemaType: 'product',
                parameters: [{ name: 'categoryId', type: 'string' }],
                value: ({ categoryId }: { categoryId: string }) => ({
                    category: { _type: 'reference', _ref: categoryId }
                })
            }
        ]
    },
    plugins: [
        structureTool({ structure }),
        // Vision is a tool that lets you query your content with GROQ in the studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: '2024-11-28' }),
    ],
})
