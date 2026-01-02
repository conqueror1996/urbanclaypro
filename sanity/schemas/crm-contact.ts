export default {
    name: 'crmContact',
    title: 'CRM Global Contact',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
        },
        {
            name: 'source',
            title: 'Source',
            type: 'string',
            initialValue: 'google'
        },
        {
            name: 'lastSyncedAt',
            title: 'Last Synced At',
            type: 'datetime',
        }
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'phone'
        }
    }
}
