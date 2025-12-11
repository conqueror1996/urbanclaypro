
import type { StructureResolver } from 'sanity/structure'

// Helper to build the hierarchy
export const structure: StructureResolver = (S) =>
    S.list()
        .title('Content')
        .items([
            // 1. Catalog Hierarchy (The requested "Category Wise" view)
            S.listItem()
                .title('Catalog by Category')
                .icon(() => '📂')
                .child(
                    S.documentTypeList('category')
                        .title('Categories')
                        .child(categoryId =>
                            S.documentList()
                                .title('Products in Category')
                                .filter('_type == "product" && category._ref == $categoryId')
                                .params({ categoryId })
                                .initialValueTemplates([
                                    S.initialValueTemplateItem('product-by-category', { categoryId })
                                ])
                        )
                ),

            S.divider(),

            // 2. Standard Document Types
            S.documentTypeListItem('product').title('All Products (Flat)'),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('category').title('Manage Categories'), // Direct access to edit categories

            S.divider(),

            S.documentTypeListItem('homePage').title('Home Page'),
            S.documentTypeListItem('selectionGuide').title('Selection Guide'),
            // Filter out the ones we manually added above to avoid duplicates if we used S.documentTypeListItems()
            // but here we are being explicit.

            // Catch-all for other types (like SEO, etc if they exist as docs)
            ...S.documentTypeListItems().filter(
                (listItem) => !['product', 'category', 'project', 'homePage', 'selectionGuide', 'media.tag'].includes(listItem.getId() as string)
            ),
        ])
