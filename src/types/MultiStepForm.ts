import {z} from 'zod';
import {LucideIcon} from 'lucide-react';
import {ReactNode} from "react";

export interface FormStep<TFormValues> {
    title: string;
    description?: string;
    triggerClassName?: string;
    position: number;
    validationSchema: z.ZodType<TFormValues>;
    component: ReactNode;
    icon?: LucideIcon;
    fields: (keyof TFormValues)[];
}

export type StepsConfig<T> = FormStep<T>[];

export interface MultiStepFormContextProps<TFormValues> {
    currentStep: FormStep<TFormValues>;
    currentStepIndex: number;
    isFirstStep: boolean;
    isLastStep: boolean;
    nextStep: () => Promise<void>;
    previousStep: () => void;
    goToStep: (step: number) => void;
    steps: StepsConfig<TFormValues>;
}

/*export interface MultiStepFormProps<TFormValues extends Record<string, any>> {
    steps: FormStep<TFormValues>[];
    schema: z.ZodType<TFormValues>;
    onSubmit: (data: TFormValues) => void | Promise<void>;
    storageKey?: string;
}*/