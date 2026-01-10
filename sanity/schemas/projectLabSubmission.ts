export default {
    name: 'projectLabSubmission',
    title: 'Project Lab Submission',
    type: 'document',
    fields: [
        {
            name: 'architectName',
            title: 'Architect Name',
            type: 'string',
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule: any) => Rule.required().email()
        },
        {
            name: 'projectType',
            title: 'Project Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Commercial Facade', value: 'commercial' },
                    { title: 'Residential Villa', value: 'residential' },
                    { title: 'Institutional / Public', value: 'institutional' },
                    { title: 'Interior Feature', value: 'interior' }
                ]
            }
        },
        {
            name: 'city',
            title: 'City',
            type: 'string',
        },
        {
            name: 'sketch',
            title: 'Sketch / Reference Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'description',
            title: 'Project Description',
            type: 'text',
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'New', value: 'new' },
                    { title: 'Analyzing', value: 'analyzing' },
                    { title: 'Report Sent', value: 'completed' }
                ],
                layout: 'radio'
            },
            initialValue: 'new'
        },
        {
            name: 'aiAnalysis',
            title: 'AI Analysis Report',
            type: 'text',
            description: 'The generated facade proposal and material recommendations.'
        },
        {
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
            initialValue: () => new Date().toISOString()
        }
    ],
    preview: {
        select: {
            title: 'architectName',
            subtitle: 'projectType',
            media: 'sketch'
        }
    }
}
