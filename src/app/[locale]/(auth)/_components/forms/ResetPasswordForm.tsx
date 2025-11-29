"use client";
import {resetPasswordFormSchema, ResetPasswordFormValues} from "@/app/[locale]/(auth)/_lib/validations";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {PasswordInput} from "@/components/ui/password-input";
import {Button} from "@/components/ui/button";
import {resetPassword} from "@/app/[locale]/(auth)/_lib/auth-actions";
import {useTranslations} from "next-intl";

interface ResetPasswordFormProps {
    className?: string;
}

const ResetPasswordForm = ({className}: ResetPasswordFormProps) => {
    const t = useTranslations('auth');


    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (data: ResetPasswordFormValues) => {
        const messages = {
            success: {
                title: t('reset_password_success_title'),
                description: t('reset_password_success_description')
            },
            error: t('reset_password_error')
        };

        await resetPassword(data, messages);
    };


    return (
        <div className={className}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-4">
                        {/* New Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="password">{t('new_password')}</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            id="password"
                                            placeholder="******"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password Field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
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
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {t('reset_password_action')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ResetPasswordForm;