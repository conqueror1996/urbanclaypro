import { type SchemaTypeDefinition } from 'sanity'

import product from './product'
import project from './project'

import homePage from './homePage'
import category from './category'
import guide from './guide'
import lead from './lead'
import seo from './seo'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [product, project, homePage, category, guide, lead, seo],
}
