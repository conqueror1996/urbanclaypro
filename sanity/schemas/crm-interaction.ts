export default {
    name: 'crmInteraction',
    title: 'Interaction',
    type: 'object',
    fields: [
        {
            name: 'date',
            title: 'Date',
            type: 'datetime',
            initialValue: () => new Date().toISOString()
        },
        {
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Call', value: 'call' },
                    { title: 'WhatsApp', value: 'whatsapp' },
                    { title: 'Email', value: 'email' },
                    { title: 'Site Visit / Meeting', value: 'meeting' },
                    { title: 'Sample Delivery', value: 'sample' }
                ]
            }
        },
        {
            name: 'summary',
            title: 'Conversation Summary',
            type: 'text',
            rows: 3
        },
        {
            name: 'nextAction',
            title: 'Agreed Next Step',
            type: 'string'
        }
    ]
}
