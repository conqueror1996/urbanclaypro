import { type SchemaTypeDefinition } from 'sanity'

import product from './product'
import project from './project'

import homePage from './homePage'
import guide from './guide'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [product, project, homePage, guide],
}
