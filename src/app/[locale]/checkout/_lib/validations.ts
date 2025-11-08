import { z } from "zod"

export const customerInfoSchema = z.object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    email: z.email("Format d'email invalide"),
    phone: z.string().optional(),
    acceptTerms: z.boolean(),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>