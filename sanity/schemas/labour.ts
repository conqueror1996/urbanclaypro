import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'labour',
    title: 'Labours',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Labour Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'trade',
            title: 'Trade/Skill',
            type: 'string',
            options: {
                list: [
                    { title: 'Mason', value: 'mason' },
                    { title: 'Carpenter', value: 'carpenter' },
                    { title: 'Electrician', value: 'electrician' },
                    { title: 'Plumber', value: 'plumber' },
                    { title: 'Painter', value: 'painter' },
                    { title: 'Helper/General', value: 'helper' },
                    { title: 'Site Supervisor', value: 'supervisor' },
                ],
            },
        }),
        defineField({
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        }),
        defineField({
            name: 'dailyRate',
            title: 'Daily Rate',
            type: 'number',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            initialValue: 'available',
            options: {
                list: [
                    { title: 'Available', value: 'available' },
                    { title: 'On Site', value: 'on_site' },
                    { title: 'Unreachable', value: 'unreachable' },
                ],
            },
        }),
        defineField({
            name: 'currentSite',
            title: 'Current Site',
            type: 'reference',
            to: [{ type: 'site' }],
        }),
        defineField({
            name: 'address',
            title: 'Address',
            type: 'text',
        }),
        defineField({
            name: 'experience',
            title: 'Work Experience (Years)',
            type: 'number',
        }),
        defineField({
            name: 'projectCost',
            title: 'Project-based Cost (Lumpsum)',
            type: 'number',
        }),
        defineField({
            name: 'documents',
            title: 'Mason Documents',
            description: 'Upload ID cards, certifications, or past work photos',
            type: 'array',
            of: [{ type: 'image' }],
        }),
        defineField({
            name: 'emergencyContact',
            title: 'Emergency Contact',
            type: 'string',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'trade',
        },
    },
})
