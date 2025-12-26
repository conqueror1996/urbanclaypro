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
import footprint from './footprint'

import vendor from './vendor'
import labour from './labour'
import stock from './stock'
import manufacturer from './manufacturer'
import site from './site'
import returnSchema from './return'
import dispute from './dispute'
import feedback from './feedback'

import collection from './collection'

import wikiArticle from './wikiArticle'
import cityPage from './cityPage'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [
        collection,
        product,
        project,
        homePage,
        aboutPage,
        category,
        guide,
        lead,
        seo,
        resource,
        journal,
        faq,
        footprint,
        vendor,
        labour,
        stock,
        manufacturer,
        site,
        returnSchema,
        dispute,
        feedback,
        wikiArticle,
        cityPage
    ],
}
