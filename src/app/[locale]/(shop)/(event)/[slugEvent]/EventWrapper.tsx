"use client";
import React, {useMemo, useRef, useState} from 'react';
import TicketSelector, {SelectedQuantities} from "@/components/features/ticket/TicketSelector";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronUp, Loader2, MapPin, ShoppingCart} from "lucide-react";
import {CustomTabs} from "@/components/ui/CustomTabs";
import {Event} from "@/types/events";
import {useTranslations} from "next-intl";
import {useCart} from "@/hooks/useCart";
import {AddToCartRequest} from "@/types/cart";
import EventHeader from "@/app/[locale]/(shop)/(event)/_components/EventHeader";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import StaticMap from "@/components/features/event/StaticMap";
import {formatAddress} from "@/lib/formater";

interface EventWrapperProps {
    event: Event;
}

const EventWrapper = ({event}: EventWrapperProps) => {
    const [selectedQuantities, setSelectedQuantities] = useState<SelectedQuantities>({});
    const t = useTranslations('event');
    const [isOpen, setIsOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<string>("about");
    const customTabsRef = useRef<HTMLDivElement>(null);

    const {goToCheckout, isLoading} = useCart();

    const handleQuantityChange = (ticketId: number, quantity: number) => {
        setSelectedQuantities(prev => ({
            ...prev,
            [ticketId]: quantity
        }));
    };

    const {totalTickets, totalPrice} = useMemo(() => {
        const allTicketTypes = event.ticketCategories.flatMap(cat => cat.ticketTypes);

        const calculatedTotalTickets = Object.values(selectedQuantities).reduce(
            (sum: number, qty: number) => sum + qty,
            0
        );

        const calculatedTotalPrice = Object.entries(selectedQuantities).reduce((sum, [ticketIdString, qty]) => {
            const ticketId = parseInt(ticketIdString, 10);
            const ticket = allTicketTypes.find(t => t.id === ticketId);
            const price = ticket?.price ?? 0;
            return sum + (price * qty);
        }, 0);

        return {
            totalTickets: calculatedTotalTickets,
            totalPrice: calculatedTotalPrice,
        };
    }, [selectedQuantities, event.ticketCategories]);

    const handleGoToCheckout = async () => {
        // Prepare request for API
        const cartRequest: AddToCartRequest = {
            eventId: event.id,
            items: Object.entries(selectedQuantities)
                .filter(([_, quantity]) => quantity > 0)
                .map(([ticketIdString, quantity]) => ({
                    ticketTypeId: parseInt(ticketIdString, 10),
                    quantity
                }))
        };

        // Ensure at least one ticket is selected
        if (cartRequest.items.length === 0) {
            return;
        }

        await goToCheckout(cartRequest);
    };

    const scrollToTabs = () => {
        setActiveTab("tickets");
        if (customTabsRef.current) {
            customTabsRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

    const tabs = [
        {
            title: t('about'),
            value: "about",
            content: (
                <div
                    className="py-8"
                    dangerouslySetInnerHTML={{__html: event.description.replaceAll('\n', '<br/>')}}
                />
            ),
        },
        {
            title: t('tickets'),
            value: "tickets",
            content: (
                <div className="md:flex gap-4">
                    <TicketSelector
                        categories={event.ticketCategories}
                        onQuantityChange={handleQuantityChange}
                        selectedQuantities={selectedQuantities}
                        className="md:w-2/3"
                    />

                    {totalTickets > 0 && (
                        <div className="fixed bottom-0 w-full left-0 right-0 z-10 md:relative md:w-1/3 ">
                            <div
                                className="p-6 bg-background md:bg-transparent rounded-lg border-2 border-b-0 rounded-b-none shadow-[0px_-8px_13px_0px_rgba(0,_0,_0,_0.1)] md:rounded-none md:border-0 md:shadow-none sticky top-24 ">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('recap')}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{t('selectedTickets', {count: totalTickets})}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold ">€{totalPrice}</div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('total')}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleGoToCheckout}
                                    disabled={isLoading || totalTickets === 0}
                                    className="w-full bg-primary py-6">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            {t('processing')}
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="mr-2 h-5 w-5"/>
                                            {t('goToCheckout')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ),
        }
    ];

    const {visibleContent, hiddenContent} = useMemo(() => {
        const maxVisibleBlocks = 4;

        const blocks = event.summary.replaceAll('\n', '<br/>').split(/<br\s*\/?>/gi).filter(b => b.trim());

        const visible = blocks.slice(0, maxVisibleBlocks).join('<br/>');
        const hidden = blocks.slice(maxVisibleBlocks).join('<br/>');

        return {
            visibleContent: visible,
            hiddenContent: hidden
        };
    }, [event.summary]);

    return (
        <>
            <section className="relative">
                <EventHeader event={event} onTicketsClick={scrollToTabs}/>
            </section>
            <section className="container max-w-6xl mx-auto relative p-4 min-h-lvh">
                <div className="p-2 py-6">

                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <div className="relative">
                            <div
                                className="space-y-6 text-gray-700 dark:text-white text-md leading-relaxed prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{__html: visibleContent}}
                            />

                            {!isOpen && hiddenContent && (
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 dark:from-background dark:via-background/80 to-transparent pointer-events-none"></div>
                            )}

                            {hiddenContent && (
                                <CollapsibleContent
                                    className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                    <div
                                        className="space-y-6 text-gray-700 dark:text-white text-md leading-relaxed pt-6 prose prose-lg max-w-none"
                                        dangerouslySetInnerHTML={{__html: hiddenContent}}
                                    />
                                </CollapsibleContent>
                            )}
                        </div>

                        {hiddenContent && (
                            <CollapsibleTrigger
                                className="mt-8 flex items-center gap-2 text-primary font-medium text-lg transition-colors group">
                                <span>{isOpen ? 'Collapse' : 'Read More'}</span>
                                {isOpen ? (
                                    <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5"/>
                                ) : (
                                    <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5"/>
                                )}
                            </CollapsibleTrigger>
                        )}
                    </Collapsible>
                </div>

                <div ref={customTabsRef}>
                    <CustomTabs
                        tabs={tabs}
                        defaultValue={activeTab}
                        value={activeTab}
                        onValueChange={setActiveTab}
                        contentClassName="py-2"/>
                </div>
                <div>
                    <div className="mb-3 text-2xl font-bold">{t('location')}</div>
                    <div className="flex items-center gap-4 mb-4">
                        <MapPin size={20}/>
                        <div>
                            <div className="text-foreground">{event.address.name}</div>
                            <div className="flex-1 text-foreground">{formatAddress(event.address)}</div>
                        </div>
                    </div>
                    <div><StaticMap address={formatAddress(event.address)} latitude={event.address.latitude!} longitude={event.address.longitude!}/></div>
                </div>

            </section>
        </>
    );
};

export default EventWrapper;
