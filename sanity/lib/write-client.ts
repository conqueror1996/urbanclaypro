import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'

export const writeClient = createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn: false, // Always fresher for writes
    token: process.env.SANITY_API_TOKEN,
})
