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
        // Detailed Invoicing Configuration
        defineField({
            name: 'gstNumber',
            title: 'GST Number',
            type: 'string',
        }),
        defineField({
            name: 'panNumber',
            title: 'PAN Number',
            type: 'string',
        }),
        defineField({
            name: 'billingAddress',
            title: 'Billing Address',
            type: 'text',
        }),
        defineField({
            name: 'shippingAddress',
            title: 'Shipping Address',
            type: 'text',
        }),
        defineField({
            name: 'lineItems',
            title: 'Line Items',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'name', type: 'string', title: 'Item Name' },
                    { name: 'description', type: 'string', title: 'Description' },
                    { name: 'quantity', type: 'number', title: 'Quantity' },
                    { name: 'rate', type: 'number', title: 'Rate' },
                    { name: 'discount', type: 'number', title: 'Discount %' },
                    { name: 'taxRate', type: 'number', title: 'GST %' },
                    { name: 'taxId', type: 'string', title: 'Zoho Tax ID' }
                ]
            }]
        }),
        defineField({
            name: 'amount',
            title: 'Grand Total (INR)',
            type: 'number',
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'shippingCharges',
            title: 'Shipping Charges',
            type: 'number',
            initialValue: 0
        }),
        defineField({
            name: 'adjustment',
            title: 'Adjustment (+/-)',
            type: 'number',
            initialValue: 0
        }),
        defineField({
            name: 'tdsOption',
            title: 'TDS / TCS Option',
            type: 'string',
            options: {
                list: [
                    { title: 'None', value: 'none' },
                    { title: 'TDS (Receivable)', value: 'tds' },
                    { title: 'TCS (Payable)', value: 'tcs' }
                ]
            },
            initialValue: 'none'
        }),
        defineField({
            name: 'tdsRate',
            title: 'TDS/TCS Rate %',
            type: 'number',
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
            name: 'customerNotes',
            title: 'Customer Notes',
            type: 'text',
        }),
        defineField({
            name: 'zohoInvoiceNumber',
            title: 'Zoho Invoice #',
            type: 'string',
            description: 'Generated after payment'
        }),
        defineField({
            name: 'zohoInvoiceId',
            title: 'Zoho Invoice ID',
            type: 'string',
            readOnly: true
        }),
        defineField({
            name: 'paidAt',
            title: 'Paid At',
            type: 'datetime',
            readOnly: true,
            description: 'Timestamp when payment was confirmed'
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
                subtitle: `${subtitle} | ${status?.toUpperCase()}`,
            }
        },
    },
})
