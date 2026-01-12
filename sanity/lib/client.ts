import { createClient } from 'next-sanity'

export const client = createClient({
    apiVersion: '2024-11-28',
    dataset: 'production',
    projectId: '22qqjddz',
    useCdn: false,
})
