import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'lead',
  title: 'Leads',
  type: 'document',
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'string',
    }),
    defineField({
      name: 'firmName',
      title: 'Firm Name',
      type: 'string',
      description: 'Name of the firm for Architects, Builders, or Contractors',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'string',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
    }),
    defineField({
      name: 'contact',
      title: 'Contact Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Full Address',
      type: 'text',
      hidden: ({ document }) => !document?.isSampleRequest,
    }),
    defineField({
      name: 'notes',
      title: 'Additional Notes',
      type: 'text',
    }),
    defineField({
      name: 'requirement',
      title: 'Requirement Details',
      type: 'text',
      description: 'Specific variation or custom requirement asked by the user',
    }),
    defineField({
      name: 'isSerious',
      title: 'Is Serious Client?',
      type: 'boolean',
      description: 'Auto-detected based on input quality',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Converted', value: 'converted' },
          { title: 'Lost', value: 'lost' },
        ],
      },
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Activity Log',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'note', type: 'text', title: 'Note' },
            { name: 'timestamp', type: 'datetime', title: 'Timestamp', initialValue: () => new Date().toISOString() },
            { name: 'author', type: 'string', title: 'Author', initialValue: 'Admin' }
          ]
        }
      ]
    }),
    defineField({
      name: 'isSampleRequest',
      title: 'Is Sample Request?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sampleItems',
      title: 'Requested Samples',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ document }) => !document?.isSampleRequest,
    }),
    defineField({
      name: 'fulfillmentStatus',
      title: 'Fulfillment Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
        ],
      },
      hidden: ({ document }) => !document?.isSampleRequest,
    }),
    defineField({
      name: 'shippingInfo',
      title: 'Shipping Details',
      type: 'object',
      fields: [
        { name: 'courier', type: 'string', title: 'Courier Name' },
        { name: 'trackingNumber', type: 'string', title: 'Tracking Number' },
        { name: 'dispatchedDate', type: 'datetime', title: 'Dispatched Date' }
      ],
      hidden: ({ document }) => !document?.isSampleRequest,
    }),
  ],
  preview: {
    select: {
      title: 'contact',
      subtitle: 'product',
      isSerious: 'isSerious',
    },
    prepare({ title, subtitle, isSerious }) {
      return {
        title: title || 'No Name',
        subtitle: `${subtitle} ${isSerious ? '🔥 (Serious)' : ''}`,
      }
    },
  },
})
