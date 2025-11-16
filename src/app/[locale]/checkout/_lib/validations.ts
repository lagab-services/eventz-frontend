import { z } from "zod"

export const customerInfoSchema = z.object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    email: z.email("Format d'email invalide"),
    phone: z.string().optional(),
    acceptTerms: z.boolean(),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>

export const attendeeInfoSchema = z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
    ticketTypeId: z.number(),
    customFields: z.record(z.string(),z.string()).optional(),
});

export const orderRequestSchema = z.object({
    billingName: z.string().min(2).max(100),
    billingEmail: z.email(),
    billingPhone: z.string().optional(),

    billingAddress: z.string().optional(),
    billingCity: z.string().optional(),
    billingZipCode: z.string().optional(),
    billingCountry: z.string().optional(),

    attendees: z.array(attendeeInfoSchema).min(1),

    notes: z.string().max(500).optional(),

    acceptTerms: z.literal(true), // AssertTrue
    subscribeNewsletter: z.boolean().optional(),

    successUrl: z.string().url().optional(),
    cancelUrl: z.string().url().optional(),
});
