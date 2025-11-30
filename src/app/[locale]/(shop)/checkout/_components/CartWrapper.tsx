"use client";
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Stepper, StepperContent,
    StepperIndicator,
    StepperItem,
    StepperNav, StepperPanel, StepperSeparator,
    StepperTitle,
    StepperTrigger
} from "@/components/ui/stepper";
import {Card, CardContent} from "@/components/ui/card";
import {stepOrder, useCheckoutStore} from "@/store/checkout";
import {ArrowLeft, Check, Loader2, LoaderCircleIcon} from "lucide-react";
import OrderSummary from "@/app/[locale]/(shop)/checkout/_components/OrderSummary";
import AttendeeInfoForm from "@/app/[locale]/(shop)/checkout/_components/AttendeeInfoForm";
import CustomerInfoForm from "@/app/[locale]/(shop)/checkout/_components/CustomerInfoForm";
import RecapForm from "@/app/[locale]/(shop)/checkout/_components/RecapForm";
import {CartResponse} from "@/types/cart";
import {Skeleton} from "@/components/ui/skeleton";
import {useCartStore} from "@/store/cart";
import {Link} from "@/i18n/navigation";
import {Button} from "@/components/ui/button";
import {formatEventUrl} from "@/lib/formater";
import {useTranslations} from "next-intl";

interface CartWrapperProps {
    cart: CartResponse;
    sessionId: string;
}

const CartWrapper = ({cart,sessionId}: CartWrapperProps) => {
    const {
        currentStep,
        completedSteps,
        initializeAttendeesFromCart,
        attendees,
        setLoading,
        _hasHydrated,
        fetchCustomFields,
        setSessionId
    } = useCheckoutStore();
    let eventId: number;
    const [eventLink,setEventLink]= useState<string>("#")
    const {setCart} = useCartStore();
    const t = useTranslations('checkout');

    useEffect(() => {
        const initializeCheckout = async () => {
            setCart(cart);
            setSessionId(sessionId);
            if (cart.items && cart.items.length > 0) {
                eventId = cart.items[0].eventId;
                setEventLink(formatEventUrl(cart.items[0].eventTitle,eventId));
                await fetchCustomFields(eventId);

                // Initialize attendees only if empty or count doesn't match
                const expectedAttendeesCount = cart.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );
                if (attendees.length !== expectedAttendeesCount) {
                    initializeAttendeesFromCart(cart.items);
                }
            }
            setLoading(false);
        };
        if (_hasHydrated) {
            initializeCheckout();
        }
    }, [_hasHydrated]);

    const renderStep = useCallback((step: string) => {
        switch (step) {
            case 'tickets':
                return <AttendeeInfoForm eventId={eventId}/>;
            case 'info':
                return <CustomerInfoForm/>;
            case 'payment':
                return <RecapForm/>;
            case 'confirmation':
                return <div className="flex flex-col items-center space-y-4 py-12">
                    <Loader2 className="w-16 h-16  animate-spin" />
                    <h2 className="text-2xl font-semibold">
                        {t('redirect_in_progress')}
                    </h2>
                    <p className="text-muted-foreground text-center">
                        {t('redirect_auto_message')}
                    </p>
                </div>;
            default:
                return <>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-primary"/>
                    </div>
                    fin
                </>
        }
    }, []);

    const renderedSteps = useMemo(() => {
        if (!_hasHydrated) return <Skeleton className="h-80 shadow-none w-full ">
            <div className="flex items-center justify-center py-8 h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400"/>
            </div>
        </Skeleton>;
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
    }, [currentStep, completedSteps, renderStep, _hasHydrated]);

    return (
        <div className="flex items-start flex-col md:flex-row md:py-8">
            <section className=" w-full md:w-1/2 h-full flex justify-end">

                <div className="flex justify-between flex-col max-w-[1280px] w-full md:w-[80%] ">
                    <Link href={eventLink} className="pt-6 mb-6 md:pt-0"><Button variant="link"><ArrowLeft />{t('backToEvent')}</Button></Link>
                    <Card className="sticky top-6 border-0 shadow-none w-full py-6 pt-0  pb-0 md:py-6">
                        <CardContent>
                            <Stepper
                                value={stepOrder.indexOf(currentStep) + 1}
                                onValueChange={(newValue) => {
                                    const newStep = stepOrder[newValue - 1];
                                    useCheckoutStore.setState({currentStep: newStep});
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
                                                    <StepperSeparator className="md:mx-2.5"/>
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

export default CartWrapper;