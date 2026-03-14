import { z } from 'zod';

export const LeadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    contact: z.string().optional(), // Fallback for various forms
    firmName: z.string().optional().or(z.literal("")),
    city: z.string().min(2, "City is required"),
    country: z.string().optional().default("India"),
    role: z.enum(['Architect', 'Builder', 'Contractor', 'Developer', 'Individual', 'Other']).default('Architect'),
    product: z.string().default("General Inquiry"),
    quantity: z.string().optional().or(z.literal("")),
    timeline: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    isSampleRequest: z.boolean().optional().default(false),
    sampleItems: z.array(z.any()).optional(),
    shippingInfo: z.object({
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
    }).optional(),
});

export type LeadInput = z.infer<typeof LeadSchema>;
