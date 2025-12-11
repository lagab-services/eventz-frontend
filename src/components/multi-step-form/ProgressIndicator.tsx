"use client";
import {useMultiStepForm} from "@/hooks/useMultiStepForm";
import {
    Stepper, StepperDescription,
    StepperIndicator,
    StepperItem, StepperNav,
    StepperSeparator,
    StepperTitle,
    StepperTrigger
} from "@/components/ui/stepper";
import React from "react";
import {cn} from "@/lib/utils";

const ProgressIndicator = () => {
    const {steps, currentStepIndex, goToStep} = useMultiStepForm();
    //const progress = (currentStepIndex / (steps.length - 1)) * 100;

    return (
        <Stepper
            value={currentStepIndex}
            onValueChange={() => {
                console.log('setCurrentStep');
            }}
        >
            <div className="mt-8">
                <StepperNav>
                    {steps.map((step) => {
                        const isCompleted = currentStepIndex > step.position - 1;
                        const isCurrent = currentStepIndex === step.position - 1;

                        return (
                            <StepperItem key={step.position} step={step.position}>
                                <StepperTrigger className={cn("flex-col", step.triggerClassName)}
                                                disabled={!(isCompleted || isCurrent)}
                                                onClick={() => goToStep(step.position)}>
                                    <StepperIndicator
                                        className="bg-primary text-primary-foreground">{step.position}</StepperIndicator>
                                    <div className="hidden sm:block">
                                        <StepperTitle>{step.title}</StepperTitle>
                                        <StepperDescription>{step.description}</StepperDescription>
                                    </div>
                                </StepperTrigger>
                                <StepperSeparator/>
                            </StepperItem>
                        );
                    })}
                </StepperNav>
            </div>
        </Stepper>
    );
};

export default ProgressIndicator;