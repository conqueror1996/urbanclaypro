
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'seoSnapshot',
    title: 'SEO History Snapshot',
    type: 'document',
    fields: [
        defineField({
            name: 'date',
            title: 'Date',
            type: 'datetime',
            initialValue: () => new Date().toISOString()
        }),
        defineField({
            name: 'score',
            title: 'Global Health Score',
            type: 'number'
        }),
        defineField({
            name: 'details',
            title: 'Score Breakdown',
            type: 'object',
            fields: [
                { name: 'passed', type: 'number', title: 'Passed Checks' },
                { name: 'warnings', type: 'number', title: 'Warnings' },
                { name: 'failed', type: 'number', title: 'Critical Failures' },
                { name: 'totalPages', type: 'number', title: 'Pages Scanned' }
            ]
        })
    ]
})
