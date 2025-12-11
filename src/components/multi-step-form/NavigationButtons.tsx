"use client";

import {useMultiStepForm} from "@/hooks/useMultiStepForm";
import {useTranslations} from "next-intl";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";

const NavigationButtons = ({onSubmit}: { onSubmit: () => void }) => {
    const t = useTranslations('common');
    const {isFirstStep, isLastStep, nextStep, previousStep} = useMultiStepForm();

    return (
        <div className="flex justify-between gap-3 mt-6">
            <Button
                type="button"
                variant="outline"

                onClick={previousStep}
                disabled={isFirstStep}
                className="flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="h-4 w-4"/>
                {t('back')}
            </Button>
            <Button
                type={isLastStep ? 'submit' : 'button'}
                onClick={isLastStep ? onSubmit : nextStep}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors"
            >
                {isLastStep ? t('submit') : t('next')}
                {!isLastStep && <ChevronRight className="h-4 w-4"/>}
            </Button>
        </div>
    );
};

export default NavigationButtons;