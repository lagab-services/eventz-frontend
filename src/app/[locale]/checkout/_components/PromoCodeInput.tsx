"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface PromoCodeFormValues {
    promoCode: string;
}

interface PromoCodeInputProps {
    onApply: (code: string) => void;
}

export function PromoCodeInput({ onApply }: PromoCodeInputProps) {
    const t = useTranslations("checkout.promoCode");
    const { register, handleSubmit, reset, formState: { errors } } = useForm<PromoCodeFormValues>();

    const onSubmit = (data: PromoCodeFormValues) => {
        onApply(data.promoCode);

        toast.success(t("appliedTitle"), {
            description: t("appliedDescription", { code: data.promoCode }),
        });

        reset();
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm py-2">
            <Label htmlFor="promoCode">{t("label")}</Label>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <Input
                    id="promoCode"
                    placeholder={t("placeholder")}
                    className="bg-background"
                    {...register("promoCode", { required: t("errorRequired") })}
                />
                <Button type="submit">{t("applyButton")}</Button>
            </form>
            {errors.promoCode && (
                <p className="text-red-500 text-sm">{errors.promoCode.message}</p>
            )}
        </div>
    );
}
