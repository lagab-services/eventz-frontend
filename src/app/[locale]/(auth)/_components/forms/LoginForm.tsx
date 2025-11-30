"use client";
import {useState} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import {useForm} from "react-hook-form"

import {cn} from "@/lib/utils"
import {Button, buttonVariants} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {LoaderCircle} from "lucide-react"

import {PasswordInput} from '@/components/ui/password-input';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {toast} from "sonner";
import {userLoginSchema} from "@/app/[locale]/(auth)/_lib/validations";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {authClient} from "@/lib/auth/auth-client";

interface UserAuthFormProps  {
    className?: string;
}

type FormData = z.infer<typeof userLoginSchema>

const UserAuthForm = ({className}: UserAuthFormProps) => {
    const t = useTranslations('auth');
    const form = useForm<FormData>({
        resolver: zodResolver(userLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/';
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);


    async function onSubmit(data: FormData) {

        /*setIsLoading(true)
        const signInResult = await signIn('credentials', {
            redirect: false,
            email: data.email.toLowerCase(),
            password: data.password,
        });

        setIsLoading(false)

        if (signInResult?.ok) {
            router.push(redirect)
            return toast.success(t('login_success'));
        }

        return toast.error(t('login_error'));*/
    }

    const handleLogin =  async () => {
        await authClient.signIn.social({
            provider: "google",
        });
    };

    return (
        <div className={cn("grid gap-6", className)}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
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
                                    <FormDescription/>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel htmlFor="password">{t('password')}</FormLabel>
                                        <Link
                                            href="/forgot-password"
                                            className="ml-auto inline-block text-sm underline"
                                        >
                                            {t('ask_forgot_password')}
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <PasswordInput {...field}
                                        />
                                    </FormControl>
                                    <FormDescription/>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button disabled={isLoading} className="ml-auto w-full" type="submit">
                            {isLoading && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            {t('signin_with_email')}
                        </Button>
                    </div>
                </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                  {t('or_continue_with')}
              </span>
                </div>
            </div>
            <button
                type="button"
                className={cn(buttonVariants({variant: "outline"}))}
                onClick={() => {
                    setIsGoogleLoading(true);
                    handleLogin();
                }}
                disabled={isLoading || isGoogleLoading}
            >
                {isGoogleLoading && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                )}
                {" "}
                Google
            </button>
        </div>)
};


export default UserAuthForm;