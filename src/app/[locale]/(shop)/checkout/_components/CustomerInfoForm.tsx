"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useCheckoutStore } from "@/lib/store/checkout";
import {
    CustomerInfo,
    customerInfoSchema,
} from "../_lib/validations";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

const CustomerInfoForm = () => {
    const t = useTranslations("checkout.customerInfo");
    const { customerInfo, setCustomerInfo, nextStep, previousStep } =
        useCheckoutStore();

    const form = useForm<CustomerInfo>({
        resolver: zodResolver(customerInfoSchema),
        defaultValues: customerInfo,
    });

    const onSubmit = (data: CustomerInfo) => {
        setCustomerInfo(data);
        nextStep();
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("fields.firstName.label")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t("fields.firstName.placeholder")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("fields.lastName.label")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t("fields.lastName.placeholder")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("fields.email.label")}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    className="pl-12"
                                                    placeholder={t("fields.email.placeholder")}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("fields.phone.label")}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    className="pl-12"
                                                    placeholder={t("fields.phone.placeholder")}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="acceptTerms"
                                render={({field}) => (
                                    <FormItem>

                                        <FormControl>
                                            <div className="flex items-start gap-3">
                                                <Checkbox id="acceptTerms"  checked={field.value}
                                                          onCheckedChange={field.onChange} />
                                                <div className="grid gap-2">
                                                    <Label htmlFor="acceptTerms">{t("fields.terms.label")}</Label>
                                                    <p className="text-muted-foreground text-sm">
                                                        {t("fields.terms.description")}
                                                    </p>
                                                </div>
                                            </div>
                                        </FormControl>

                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />


                            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={previousStep}
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    {t("buttons.back")}
                                </Button>

                                <Button type="submit">
                                    {t("buttons.continue")}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerInfoForm;