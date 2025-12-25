import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'site',
    title: 'Ongoing Sites',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Site/Project Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'client',
            title: 'Client Name',
            type: 'string',
        }),
        defineField({
            name: 'clientEmail',
            title: 'Client Email ID',
            type: 'string',
        }),
        defineField({
            name: 'clientPhone',
            title: 'Client Contact Number',
            type: 'string',
        }),
        defineField({
            name: 'clientJob',
            title: 'Client Profession/Job',
            type: 'string',
        }),
        defineField({
            name: 'clientProfile',
            title: 'Client Profile/Bio',
            type: 'text',
        }),
        defineField({
            name: 'location',
            title: 'Site Address',
            type: 'string',
        }),
        defineField({
            name: 'contactTechnical',
            title: 'Engineer/Contractor Contact Number',
            type: 'string',
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
        }),
        defineField({
            name: 'expectedCompletion',
            title: 'Expected Completion',
            type: 'date',
        }),
        defineField({
            name: 'actualCompletionDate',
            title: 'Actual Completion Date',
            type: 'date',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            initialValue: 'in_progress',
            options: {
                list: [
                    { title: 'Planned', value: 'planned' },
                    { title: 'In Progress', value: 'in_progress' },
                    { title: 'Paused', value: 'paused' },
                    { title: 'Completed', value: 'completed' },
                    { title: 'Canceled', value: 'canceled' },
                ],
            },
        }),
        defineField({
            name: 'supervisor',
            title: 'Site Supervisor',
            type: 'string',
        }),
        defineField({
            name: 'labours',
            title: 'Labours Assigned',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'labour' }] }],
        }),
        defineField({
            name: 'materials',
            title: 'Materials Sent to Site',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'product', type: 'reference', to: [{ type: 'product' }] },
                        { name: 'quantity', type: 'number' },
                        { name: 'date', type: 'date' },
                    ]
                }
            ]
        }),
        defineField({
            name: 'notes',
            title: 'Progress Notes',
            type: 'text',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'status',
        },
    },
})
