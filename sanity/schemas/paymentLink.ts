import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'paymentLink',
    title: 'Payment Links',
    type: 'document',
    fields: [
        defineField({
            name: 'orderId',
            title: 'Order ID (Internal)',
            type: 'string',
            description: 'Unique reference e.g., ORD-2024-001',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'clientName',
            title: 'Client Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'clientEmail',
            title: 'Client Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: 'clientPhone',
            title: 'Client Phone',
            type: 'string',
        }),
        defineField({
            name: 'productName',
            title: 'Product / Service Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'amount',
            title: 'Amount (INR)',
            type: 'number',
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'status',
            title: 'Payment Status',
            type: 'string',
            initialValue: 'pending',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Paid', value: 'paid' },
                    { title: 'Expired', value: 'expired' },
                ],
            },
        }),
        defineField({
            name: 'terms',
            title: 'Terms & Conditions',
            type: 'text',
            initialValue: '1. Standard delivery timeline is 3-4 weeks from payment.\n2. Goods once sold cannot be returned.\n3. Unloading at site is client responsibility.',
        }),
        defineField({
            name: 'deliveryTimeline',
            title: 'Delivery Timeline (Text)',
            type: 'string',
            initialValue: '3-4 Weeks',
        }),
        defineField({
            name: 'paymentId',
            title: 'Razorpay Payment ID',
            type: 'string',
            readOnly: true,
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'expiryDate',
            title: 'Expiry Date',
            type: 'datetime',
            description: 'Optional. Link will automatically expire after this date.',
        }),
    ],
    preview: {
        select: {
            title: 'orderId',
            subtitle: 'clientName',
            status: 'status',
        },
        prepare({ title, subtitle, status }) {
            return {
                title: title,
                subtitle: `${subtitle} | ${status.toUpperCase()}`,
            }
        },
    },
})
