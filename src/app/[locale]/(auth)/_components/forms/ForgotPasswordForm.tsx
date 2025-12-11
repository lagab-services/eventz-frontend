"use client";
import React, {useState} from 'react';
import {cn} from '@/lib/utils';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {LoaderCircle} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {useTranslations} from "next-intl";
import {forgotPasswordAction} from "@/app/[locale]/(auth)/_lib/auth-actions";

const getForgotPasswordFormSchema = (t: (key: string) => string) =>
    z.object({
        email: z.email({message: t('forgot_password_email_error')}),
    });

type ForgotPasswordFormValue = z.infer<ReturnType<typeof getForgotPasswordFormSchema>>;

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
    onSuccess?: () => void;
}

const ForgotPasswordForm = ({className, onSuccess, ...props}: ForgotPasswordFormProps) => {
    const t = useTranslations('auth');
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<ForgotPasswordFormValue>({
        resolver: zodResolver(getForgotPasswordFormSchema(t)),
        defaultValues: {
            email: "",
        },
    });
    const onSubmit = async (data: ForgotPasswordFormValue) => {
        setIsLoading(true)
        const messages = {
            success: {
                title: t('forgot_password_success_title'),
                description: t('forgot_password_success_description')
            },
            error: t('forgot_password_error')
        };

        const success = await forgotPasswordAction(data, messages);

        setIsLoading(false);

        if (success && onSuccess) {
            onSuccess();
        }

    };

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>{t('email')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} className="w-full" type="submit">
                        {isLoading && (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        {t('forgot_password_action')}
                    </Button>
                </form>
            </Form>
        </div>);
};

export default ForgotPasswordForm;