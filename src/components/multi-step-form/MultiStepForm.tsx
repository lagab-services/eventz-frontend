import {FormStep, MultiStepFormContextProps} from "@/types/MultiStepForm";
import {ReactElement, useEffect, useState} from "react";
import {DefaultValues, FormProvider, useForm} from "react-hook-form";
import NavigationButtons from "@/components/multi-step-form/NavigationButtons";
import {MultiStepFormProvider} from "@/components/multi-step-form/MultiStepFormContext";
import ProgressIndicator from "@/components/multi-step-form/ProgressIndicator";
import {cn} from "@/lib/utils";
import {toast} from "sonner";

interface MultiStepFormProps<TFormValues extends Record<string, unknown>> {
    steps: FormStep<TFormValues>[];
    defaultValues?: Partial<TFormValues>;
    className?: string;
    onSubmit?: (values: unknown) => Promise<void>;
    progressComponent?: ReactElement;
}

const MultiStepForm = <TFormValues extends Record<string, unknown>>({
                                                                        className,
                                                                        defaultValues = {} as Partial<TFormValues>,
                                                                        onSubmit,
                                                                        steps,
                                                                        progressComponent,
                                                                    }: MultiStepFormProps<TFormValues>) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [savedData, setSavedData] = useState<TFormValues | null>(null);

    const form = useForm({
        defaultValues: defaultValues as DefaultValues<TFormValues>,
        mode: 'onChange',
    });

    const currentStep = steps[currentStepIndex];

    // Load saved data from memory on mount
    useEffect(() => {
        if (savedData) {
            form.reset(savedData);
        }
    }, []);

    const saveFormState = () => {
        setSavedData(form.getValues());
    };

    const nextStep = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fieldsToValidate = currentStep.fields as any;
        const isValid = await form.trigger(fieldsToValidate);
        if (!isValid) return;

        const currentValues = form.getValues(fieldsToValidate) as unknown[];

        const formValues = Object.fromEntries(
            currentStep.fields.map((field, index) => [field, currentValues[index] || ''])
        );


        const validationResult = currentStep.validationSchema.safeParse(formValues);

        if (!validationResult.success) {
            validationResult.error.issues.forEach((err) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                form.setError(err.path.join('.') as any, {
                    type: 'manual',
                    message: err.message,
                });
            });
            return;
        }

        if (currentStepIndex < steps.length - 1) {
            saveFormState();
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const previousStep = () => {
        if (currentStepIndex > 0) {
            saveFormState();
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    const goToStep = (position: number) => {
        if (position >= 0 && position - 1 < steps.length) {
            saveFormState();
            setCurrentStepIndex(position - 1);
        }
    };

    const submitForm = form.handleSubmit(async (data) => {
        try {
            if (onSubmit) await onSubmit(data);
            // Reset
            form.reset();
            setCurrentStepIndex(0);
            setSavedData(null);
        } catch (err: unknown) {
            let errorMessage = "An unknown error occurred";
            if (err instanceof Error) errorMessage = err.message;
            toast.error(errorMessage);
        }
    });

    const value: MultiStepFormContextProps<TFormValues> = {
        currentStep,
        currentStepIndex,
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === steps.length - 1,
        nextStep,
        previousStep,
        goToStep,
        steps,
    };

    return (
        <MultiStepFormProvider value={value}>
            <FormProvider {...form}>
                <div className={cn(className)}>
                    <div>
                        {progressComponent ? progressComponent : <ProgressIndicator/>}

                        <form onSubmit={submitForm}>
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">{currentStep.title}</h2>
                            {currentStep.component}
                            <NavigationButtons onSubmit={submitForm}/>
                        </form>
                    </div>
                </div>
            </FormProvider>
        </MultiStepFormProvider>
    );
};

export default MultiStepForm;