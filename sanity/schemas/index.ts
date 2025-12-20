import { type SchemaTypeDefinition } from 'sanity'

import product from './product'
import project from './project'

import homePage from './homePage'
import aboutPage from './aboutPage'
import category from './category'
import guide from './guide'
import lead from './lead'
import seo from './seo'

import journal from './journal'

import resource from './resource'
import faq from './faq'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [product, project, homePage, aboutPage, category, guide, lead, seo, resource, journal, faq],
}
