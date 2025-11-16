"use client";

import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {toast} from "sonner";
import {useTranslations} from "next-intl";
import {useEffect} from "react";

interface PromoCodeFormValues {
    promoCode: string;
}

interface PromoCodeInputProps {
    onApply: (code: string) => void;
    onRemove: () => void;
    initialPromoCode: string | null;
}

export function PromoCodeInput({onApply, onRemove, initialPromoCode}: PromoCodeInputProps) {
    const t = useTranslations("checkout.promoCode");
    const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm<PromoCodeFormValues>();

    useEffect(() => {
        if (initialPromoCode) {
            setValue("promoCode", initialPromoCode);
        } else {
            setValue("promoCode", ""); // Clear the input if no initial code
        }
    }, [initialPromoCode, setValue]);

    const onSubmit = (data: PromoCodeFormValues) => {
        if (data.promoCode && data.promoCode !== initialPromoCode) {
            onApply(data.promoCode);
            toast.success(t("appliedTitle"), {
                description: t("appliedDescription", {code: data.promoCode}),
            });
            // Keep the input value after applying
            // reset(); // Removed reset to keep the applied code in the input
        } else if (!data.promoCode && initialPromoCode) {
            // If the input is cleared and there was an initial code, trigger removal
            onRemove();
            toast.success(t("removedTitle"), {
                description: t("removedDescription", {code: initialPromoCode}),
            });
            reset(); // Reset after removal
        } else if (!data.promoCode && !initialPromoCode) {
            // If input is empty and there was no initial code, do nothing or show a message
            toast.info(t("noCodeEntered"));
        }
    };

    const handleRemoveClick = () => {
        setValue("promoCode", "");
        onRemove();
        toast.success(t("removedTitle"), {
            description: t("removedDescription", {code: initialPromoCode || ""}), // Use initialPromoCode if available
        });
        reset(); // Reset form state after removal
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm py-2">
            <Label htmlFor="promoCode">{t("label")}</Label>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <Input
                    id="promoCode"
                    placeholder={t("placeholder")}
                    className="bg-background"
                    {...register("promoCode", {required: t("errorRequired")})}
                />
                {initialPromoCode && !errors.promoCode ? (
                    <Button type="button" variant="outline" onClick={handleRemoveClick}>
                        {t("removeButton")}
                    </Button>
                ) : (
                    <Button type="submit" disabled={!!errors.promoCode}>
                        {t("applyButton")}
                    </Button>
                )}
            </form>
            {errors.promoCode && (
                <p className="text-red-500 text-sm">{errors.promoCode.message}</p>
            )}
        </div>
    );
}
