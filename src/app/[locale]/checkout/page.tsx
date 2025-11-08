"use client";
import React, {useCallback, useMemo} from 'react';
import {
    Stepper, StepperContent,
    StepperIndicator,
    StepperItem,
    StepperNav, StepperPanel, StepperSeparator,
    StepperTitle,
    StepperTrigger
} from "@/components/ui/stepper";
import {Check, LoaderCircleIcon} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {stepOrder, useCheckoutStore} from "@/lib/store/checkout";
import AttendeeInfoForm from "./_components/AttendeeInfoForm";
import CustomerInfoForm from "./_components/CustomerInfoForm";
import {useCheckoutInitialization} from "@/app/[locale]/checkout/_hooks/useCheckoutInitialization";
import OrderSummary from "./_components/OrderSummary";
import {Spinner} from "@/components/ui/spinner";
import RecapForm from "@/app/[locale]/checkout/_components/RecapForm";

const Page = () => {

    useCheckoutInitialization();
    const { currentStep, completedSteps, isLoading} = useCheckoutStore();

    const renderStep = useCallback((step: string) => {
        switch (step) {
            case 'tickets':
                return <AttendeeInfoForm eventId={1} />;
            case 'info':
                return <CustomerInfoForm />;
            case 'payment':
                return <RecapForm/>;
            default:
                return <>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-primary" />
                    </div>
                    fin
                </>
        }
    }, [currentStep]);

    const renderedSteps = useMemo(() => {
        return stepOrder.map((step, index) => {
            const isStepVisible =
                completedSteps.includes(step) || step === currentStep;

            if (!isStepVisible) return null;

            return (
                <StepperContent key={step} value={index + 1} className="flex items-center justify-center">
                    <div className="w-full">{renderStep(step)}</div>
                </StepperContent>
            );
        });
    }, [currentStep, completedSteps, renderStep]);

    if (isLoading) {
        return <div className="text-center py-20 flex justify-center"><Spinner /></div>;
    }

    return (
        <div className="flex items-start flex-col-reverse md:flex-row md:py-8">
            <section className=" w-full md:w-1/2 h-full flex justify-end">
                <div className="flex justify-between flex-col max-w-[1280px] w-full md:w-[80%] py-6 md:py-12">
                    <Card className="sticky top-6 border-0 shadow-none w-full">
                        <CardContent>
                            <Stepper
                                value={stepOrder.indexOf(currentStep)+1}
                                onValueChange={(newValue) => {
                                    const newStep = stepOrder[newValue - 1];
                                    useCheckoutStore.setState({ currentStep: newStep });
                                }}
                                indicators={{
                                    completed: <Check className="size-4"/>,
                                    loading: <LoaderCircleIcon className="size-4 animate-spin"/>,
                                }}
                                className="space-y-8 "
                            >
                                <StepperNav className="hidden md:inline-flex ">
                                    {stepOrder.map((step, index) => {
                                        const isDisabled =
                                            !completedSteps.includes(step) && step !== currentStep;

                                        return (
                                            <StepperItem
                                                key={step}
                                                step={index + 1}
                                                className="relative"
                                                disabled={isDisabled}
                                            >
                                                <StepperTrigger className="flex justify-start gap-1.5">
                                                    <StepperIndicator>{index + 1}</StepperIndicator>
                                                    <div className="flex flex-col items-start gap-0.5">
                                                        <StepperTitle>{step}</StepperTitle>
                                                    </div>
                                                </StepperTrigger>
                                                {stepOrder.length > index + 1 && (
                                                    <StepperSeparator className="md:mx-2.5" />
                                                )}
                                            </StepperItem>
                                        );
                                    })}
                                </StepperNav>

                                <StepperPanel className="text-sm">
                                    {renderedSteps}
                                </StepperPanel>
                            </Stepper>
                        </CardContent>
                    </Card>
                </div>
            </section>
            <section className=" block md:absolute right-0 w-full md:w-1/2 min-h-full">
                <div
                    className="flex items-start justify-start max-w-[1280px] py-6 md:py-12 px-6 md:px-12 w-full md:w-[65%] gap-5 flex-col">
                    <OrderSummary/>
                </div>

            </section>
        </div>
    );
};

export default Page;