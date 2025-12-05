"use client";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Minus, Plus} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {TicketCategory, TicketType} from "@/types/events";
import {useTranslations} from "next-intl";


export interface SelectedQuantities {
    [ticketId: number]: number;
}

interface TicketSelectorProps {
    className?: string;
    categories: TicketCategory[];
    onQuantityChange: (ticketId: number, quantity: number) => void;
    selectedQuantities: Record<number, number>;
}

const TicketSelector = ({categories, className, onQuantityChange, selectedQuantities}: TicketSelectorProps) => {

    const t = useTranslations('ticket');
    const handleQuantityChange = (ticketId: number, change: number, tickets: TicketType[]) => {
        const currentQuantity = selectedQuantities[ticketId] || 0;
        const newQuantity = Math.max(0, currentQuantity + change);
        const ticket = tickets.find(t => t.id === ticketId);

        if (ticket && newQuantity <= ticket.maxQuantity && newQuantity <= ticket.quantityAvailable) {
            onQuantityChange(ticketId, newQuantity);
        }
    };


    const getCategoryTicketCount = (category: TicketCategory) => {
        return category.ticketTypes.reduce((sum, ticket) => {
            return sum + (selectedQuantities[ticket.id] || 0);
        }, 0);
    };

    // Filter and order active categories
    const activeCategories = categories
        .filter(cat => cat.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder);

    const defaultOpenCategories = activeCategories
        .filter(cat => !cat.isCollapsed)
        .map(cat => `category-${cat.id}`);

    return (
        <div className={className}>
            <Accordion
                type="multiple"
                defaultValue={defaultOpenCategories}
                className="space-y-4"
            >
                {activeCategories.map((category) => {
                    const ticketCount = getCategoryTicketCount(category);

                    return (
                        <AccordionItem
                            key={category.id}
                            value={`category-${category.id}`}
                            className="border border-gray-200  last:border-b-1 dark:border-gray-200/50  rounded-lg overflow-hidden"
                        >
                            <AccordionTrigger
                                className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800 dark:to-black hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-800/50 dark:hover:to-black hover:no-underline">
                                <div className="text-left flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{category.name}
                                            {category.description && (
                                                <span
                                                    className="text-sm text-gray-600 dark:text-gray-300 font-light ml-2">{category.description}</span>
                                            )}
                                        </h3>
                                        {ticketCount > 0 && (
                                            <Badge className="bg-primary text-white dark:text-black">
                                                {t('selectedTickets', {count: ticketCount})}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="p-4 space-y-4 bg-background">
                                {category.ticketTypes.map((ticket) => (
                                    <Card
                                        key={ticket.id}
                                        className={`transition-all duration-200 hover:shadow-lg border-1 gap-2 ${
                                            selectedQuantities[ticket.id] > 0
                                                ? 'border-primary bg-blue-50/50 dark:bg-gray-900/50'
                                                : 'border-gray-200 dark:border-gray-200/50 hover:border-gray-300'
                                        } ${ticket.isSoldOut ? 'opacity-60' : ''}`}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <CardTitle className="text-base">{ticket.name}</CardTitle>
                                                        {ticket.isSoldOut && (
                                                            <Badge variant="destructive">{t('soldOut')}</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400 text-xs" dangerouslySetInnerHTML={{__html: ticket.description.replaceAll('\n', '<br/>')}}/>
                                                </div>

                                                <div className="text-right ml-6">
                                                    <div
                                                        className="text-xl font-bold text-gray-900 dark:text-gray-300 mb-1">
                                                        €{ticket.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {!ticket.isSoldOut && (
                                            <CardContent className="pt-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 invisible">
                                                        {t('maxPerOrder', {maxPerOrder: ticket.maxQuantity})}
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(ticket.id, -1, category.ticketTypes)}
                                                            disabled={(selectedQuantities[ticket.id] || 0) === 0}
                                                            className="h-9 w-9 p-0"
                                                        >
                                                            <Minus className="h-4 w-4"/>
                                                        </Button>

                                                        <span className="font-semibold min-w-[2rem] text-center">
                            {selectedQuantities[ticket.id] || 0}
                          </span>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(ticket.id, 1, category.ticketTypes)}
                                                            disabled={
                                                                (selectedQuantities[ticket.id] || 0) >= ticket.maxQuantity ||
                                                                (selectedQuantities[ticket.id] || 0) >= ticket.quantityAvailable
                                                            }
                                                            className="h-9 w-9 p-0"
                                                        >
                                                            <Plus className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default TicketSelector;