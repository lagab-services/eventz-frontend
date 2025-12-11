import {z} from "zod";
import {TFunction} from "@/types";

export const getUserLoginSchema = (t: TFunction) =>
    z.object({
        email: z.email({message: t('login_email_error')}),
        password: z.string()
            .min(6, {message: t('login_password_min_error')})
            .regex(/[a-zA-Z0-9]/, {message: t('login_password_regex_error')}),
    });

export type UserLoginFormValues = z.infer<ReturnType<typeof getUserLoginSchema>>;

export const getResetPasswordFormSchema = (t: TFunction) =>
    z.object({
        password: z.string()
            .min(6, {message: t('reset_password_min_error')})
            .regex(/[a-zA-Z0-9]/, {message: t('reset_password_regex_error')}),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: t('reset_passwords_match_error'),
    });

export type ResetPasswordFormValues = z.infer<ReturnType<typeof getResetPasswordFormSchema>>;

export const getRegisterFormSchema = (t: TFunction) =>
    z.object({
        firstName: z.string().min(2, {message: t('register_firstname_error')}),
        lastName: z.string().min(2, {message: t('register_lastname_error')}),
        email: z.email({message: t('register_email_error')}),
        password: z.string()
            .min(6, {message: t('register_password_min_error')})
            .regex(/[a-zA-Z0-9]/, {message: t('register_password_regex_error')}),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: t('register_passwords_match_error'),
    });

export type RegisterFormValues = z.infer<ReturnType<typeof getRegisterFormSchema>>;

export const getForgotPasswordFormSchema = (t: TFunction) =>
    z.object({
        email: z.email({message: t('forgot_password_email_error')}),
    });

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof getForgotPasswordFormSchema>>;
