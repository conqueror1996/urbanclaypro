export default {
    name: 'architectLead',
    title: 'Architect Lead',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Architect Name',
            type: 'string',
        },
        {
            name: 'firmName',
            title: 'Firm Name',
            type: 'string',
        },
        {
            name: 'email',
            title: 'Email Address',
            type: 'string',
            validation: (Rule: any) => Rule.required().email()
        },
        {
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        },
        {
            name: 'city',
            title: 'City',
            type: 'string',
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'New', value: 'new' },
                    { title: 'Contacted', value: 'contacted' },
                    { title: 'Replied', value: 'replied' },
                    { title: 'Converted', value: 'converted' }
                ],
                layout: 'radio'
            },
            initialValue: 'new'
        },
        {
            name: 'notes',
            title: 'Notes',
            type: 'text',
        },
        {
            name: 'scrapedAt',
            title: 'Scraped At',
            type: 'datetime',
            initialValue: () => new Date().toISOString()
        },
        {
            name: 'opens',
            title: 'Email Opens',
            type: 'number',
            initialValue: 0
        },
        {
            name: 'lastOpenedAt',
            title: 'Last Opened',
            type: 'datetime'
        },
        {
            name: 'hasRequestedSample',
            title: 'Has Requested Sample',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'convertedAt',
            title: 'Converted At',
            type: 'datetime'
        }
    ],
    preview: {
        select: {
            title: 'firmName',
            subtitle: 'name',
            description: 'email'
        }
    }
}
