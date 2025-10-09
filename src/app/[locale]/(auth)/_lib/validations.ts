import {z} from "zod";

export const emailSchema = z.email();

export const passwordSchema = z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' })

export const nameSchema = z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' });

export const userLoginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});


export const resetPasswordFormSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export const registerFormSchema = z
    .object({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;