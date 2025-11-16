"use client";
import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {useCartStore} from "@/lib/store/cart";
import {Loader2, ShoppingCart, Tag, ChevronDown, ChevronUp} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import {PromoCodeInput} from "./PromoCodeInput";

const OrderSummary = () => {

    const cart = useCartStore((state) => state.cart);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const t = useTranslations('checkout.orderSummary');

    const [appliedPromoCode, setAppliedPromoCode] = React.useState<string | null>(null);

    const handleApplyPromoCode = (code: string) => {
        setAppliedPromoCode(code);
        // You might also want to update the cart state with the discount if the API call is successful
        // For example: useCartStore.setState((state) => ({ cart: { ...state.cart, promoCode: code, discount: calculateDiscount(state.cart.subtotal, code) } }));
        console.log("Promo code applied:", code);
    };

    const handleRemovePromoCode = () => {
        setAppliedPromoCode(null);
        // You might also want to update the cart state to remove the discount
        // For example: useCartStore.setState((state) => ({ cart: { ...state.cart, promoCode: null, discount: 0 } }));
        console.log("Promo code removed");
    };

    if (!cart) {
        return (
            <Card className="sticky top-6 border-0 shadow-none w-full bg-transparent">
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400"/>
                </CardContent>
            </Card>
        );
    }

    if (cart.totalItems === 0) {
        return (
            <Card className="sticky top-6 border-0 shadow-none w-full bg-transparent">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mb-3"/>
                    <p className="text-sm text-gray-500">{t('emptyCart')}</p>
                </CardContent>
            </Card>
        );
    }

    // Group items by event
    const itemsByEvent = cart.items.reduce((acc, item) => {
        const eventTitle = item.eventTitle;
        if (!acc[eventTitle]) {
            acc[eventTitle] = [];
        }
        acc[eventTitle].push(item);
        return acc;
    }, {} as Record<string, typeof cart.items>);

    return (
        <Card className="sticky top-6 border-0 shadow-none w-full bg-transparent">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <span>{t('title')}</span>
                        <Badge variant="secondary">
                            {t('ticketCount', {count: cart.totalItems})}
                        </Badge>
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-8 w-8 p-0"
                        aria-label={isExpanded ? t('collapse') : t('expand')}
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4"/>
                        ) : (
                            <ChevronDown className="h-4 w-4"/>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* List of items */}
                <div className={cn(
                    "space-y-4 transition-all duration-200",
                    !isExpanded && "hidden"
                )}>
                    {Object.entries(itemsByEvent).map(([eventTitle, items]) => (
                        <div key={eventTitle} className="space-y-2">
                            {/* Event title if multiple events */}
                            {Object.keys(itemsByEvent).length > 1 && (
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                    {eventTitle}
                                </p>
                            )}

                            {/* Items for this event */}
                            {items.map((item) => (
                                <div key={item.ticketTypeId} className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {item.ticketTypeName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {t('quantityPrice', {
                                                quantity: item.quantity,
                                                price: item.unitPrice.toFixed(2)
                                            })}
                                        </p>
                                        {!item.isAvailable && (
                                            <Badge variant="destructive" className="mt-1 text-xs">
                                                {t('unavailable')}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="font-semibold text-sm whitespace-nowrap">
                                        {t('price', {amount: item.totalPrice.toFixed(2)})}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <PromoCodeInput onApply={handleApplyPromoCode}
                                initialPromoCode={cart.promoCode || null}
                                onRemove={handleRemovePromoCode}/>
                <Separator/>

                {/* Price details */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}</span>
                        <span className="font-medium">
                            {t('price', {amount: cart.subtotal.toFixed(2)})}
                        </span>
                    </div>

                    {cart.fees > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{t('serviceFees')}</span>
                            <span className="font-medium">
                                {t('price', {amount: cart.fees.toFixed(2)})}
                            </span>
                        </div>
                    )}

                    {cart.discount > 0 && (
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1 text-green-700">
                                <Tag className="h-3 w-3"/>
                                <span>{t('discount')}</span>
                                {cart.promoCode && (
                                    <Badge variant="outline" className="ml-1 text-xs border-green-700 text-green-700">
                                        {cart.promoCode}
                                    </Badge>
                                )}
                            </div>
                            <span className="font-medium text-green-700">
                                {t('discountAmount', {amount: cart.discount.toFixed(2)})}
                            </span>
                        </div>
                    )}
                </div>

                <Separator className="bg-gray-300"/>

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg">{t('total')}</span>
                    <div className="text-right">
                        <span className="font-bold text-2xl text-primary">
                            {t('price', {amount: cart.total.toFixed(2)})}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('taxIncluded')}
                        </p>
                    </div>
                </div>

                {/* Messages */}
                {(cart.warnings.length > 0 || cart.errors.length > 0) && (
                    <>
                        <Separator/>
                        <div className="space-y-2">
                            {cart.warnings.map((warning, index) => (
                                <div key={`warning-${index}`}
                                     className="flex items-start gap-2 p-2 bg-yellow-50 rounded-md">
                                    <span className="text-yellow-600 text-xs">⚠️</span>
                                    <p className="text-xs text-yellow-700 flex-1">
                                        {warning.message}
                                    </p>
                                </div>
                            ))}

                            {cart.errors.map((error, index) => (
                                <div key={`error-${index}`} className="flex items-start gap-2 p-2 bg-red-50 rounded-md">
                                    <span className="text-red-600 text-xs">❌</span>
                                    <p className="text-xs text-red-700 flex-1">
                                        {error.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Validity indicator */}
                {!cart.isValid && cart.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-700 font-medium text-center">
                            {t('fixErrors')}
                        </p>
                    </div>
                )}

                {/* Additional information */}
                <div className="pt-2 space-y-1 text-xs text-gray-500">
                    <p>✓ {t('securePayment')}</p>
                    <p>✓ {t('emailDelivery')}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderSummary;
