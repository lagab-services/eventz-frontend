"use client";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";

import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/password-input";
import {Button} from "@/components/ui/button";
import {registerFormSchema, RegisterFormValues} from "@/app/[locale]/(auth)/_lib/validations";
import {registerUser} from "@/app/[locale]/(auth)/_lib/auth-actions";

interface RegisterFormProps{
    className?: string;
}
const RegisterForm = ({className} :RegisterFormProps) => {
    const t = useTranslations('auth');



    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (data: RegisterFormValues) => {
        const messages = {
            success: {
                title: t('register_success_title'),
                description: t('register_success_description')
            },
            error: t('register_password_error')
        };

        await registerUser(data,messages);
    };


    return (
        <div className={className}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-4">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="name">{t('register_fullname')}</FormLabel>
                                    <FormControl>
                                        <Input id="name" placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="email">{t('email')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            placeholder="johndoe@mail.com"
                                            type="email"
                                            autoComplete="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="password">{t('password')}</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            id="password"
                                            placeholder="******"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password Field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="confirmPassword">
                                        {t('confirm_password')}
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            id="confirmPassword"
                                            placeholder="******"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {t('register_action')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default RegisterForm;