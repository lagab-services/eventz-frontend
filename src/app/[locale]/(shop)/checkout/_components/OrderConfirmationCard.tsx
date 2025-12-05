"use client";

import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {useCartStore} from "@/store/cart";
import {useCheckoutStore} from "@/store/checkout";
import {notFound} from "next/navigation";
import {OrderWithTickets} from "@/types/order";
import {getOrderInfo} from "@/lib/actions/oder.action";
import {ArrowDownToLine, ArrowLeft, Calendar, Check, MapPin} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";
import {useLocale} from "next-intl";
import {formatEventDates} from "@/lib/dateFormatter";
import {Ticket} from "@/types/tickets";

const OrderConfirmationCard = ({sessionId}: { sessionId: string }) => {
    const {clearCart} = useCartStore();
    const {customerInfo, checkoutSessionId, orderId, _hasHydrated} = useCheckoutStore();

    const [order, setOrder] = useState<OrderWithTickets | null>(null);
    const [loading, setLoading] = useState(true);
    const locale = useLocale() as "fr" | "en" | "es";

    useEffect(() => {
        if (!_hasHydrated) return;

        // Security check : sessionId from store vs URL
        if (checkoutSessionId !== sessionId) {
            clearCart();
            notFound();
        }

        const fetchData = async () => {
            if (!customerInfo?.email || !orderId) {
                clearCart();
                notFound();
                return;
            }

            const orderRequest = {
                orderNumber: orderId,
                email: customerInfo.email,
            };

            const data = await getOrderInfo(orderRequest);

            if (!data) {
                clearCart();
                notFound();
                return;
            }

            setOrder(data);
            setLoading(false);
        };

        fetchData();
    }, [_hasHydrated]);

    if (loading) {
        return (
            <div className="container min-h-screen flex items-center justify-center">
                <div className="space-y-4 w-full max-w-xl mx-auto">
                    <Skeleton className="h-10 w-3/4 mx-auto"/>
                    <Skeleton className="h-6 w-2/3 mx-auto"/>

                    <Card className="p-4">
                        <Skeleton className="h-8 w-1/3 mb-4"/>
                        <Skeleton className="h-4 w-full mb-2"/>
                        <Skeleton className="h-4 w-5/6 mb-2"/>
                        <Skeleton className="h-4 w-1/2"/>
                    </Card>

                    <Skeleton className="h-10 w-40 mx-auto mt-6"/>
                </div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Card className="container mx-auto border-0 shadow-none bg-transparent">
                <CardContent>
                    {/* Success Icon */}
                    <div className="flex justify-center mb-8">
                        <div
                            className="w-20 h-20 bg-primary/10  rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600">
                            <Check className="w-10 h-10 text-white" strokeWidth={3}/>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center mb-4">
                        Merci pour votre achat pour l  evenement
                        <p className="text-4xl "> {order.eventTitle} 🎉</p>
                    </h2>

                    <p className="text-center text-muted-foreground mb-8">
                        Commande n° <b>{order.orderNumber}</b>
                    </p>

                    {/* Order Summary */}
                    <Card className="container md:w-2xl mx-auto bg-background shadow-none">
                        <CardHeader>
                            <h3 className="text-2xl font-bold">Récapitulatif</h3>
                        </CardHeader>

                        <CardContent>
                            {/* Event */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-6 h-6 "/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-1">Date et heure</p>
                                        <p className="font-semibold capitalize">
                                            {formatEventDates(order.eventStartDate, order.eventEndDate, locale)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-1">Lieu</p>
                                        <p className="font-semibold">{order.eventLocation}</p>
                                        {order.eventAddress && (
                                            <p className="text-muted-foreground">{order.eventAddress}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-8"/>
                            <div className="space-y-3 mb-4">
                                <h3 className="text-lg font-bold">Tickets</h3>
                                {order.tickets.map((ticket) => (
                                    <Card key={ticket.ticketId} className="shadow-none border-none py-2">
                                        <CardContent className="flex gap-6 items-center">
                                            <Button variant="ghost" className="cursor-pointer" onClick={() =>alert('Téléchargement du ticket...')}>
                                                <ArrowDownToLine size={18}/>
                                            </Button>
                                            <div className="participant-info">
                                                <div className="font-semibold">{ticket.buyerName} - <span className="text-xs font-medium">{ticket.ticketType}</span></div>
                                                <div className="text-sm text-muted-foreground">{ticket.buyerEmail}</div>

                                            </div>

                                        </CardContent>
                                    </Card>
                                ))}

                            </div>

                            <Separator className="my-8"/>

                            {/* Items */}
                            <div className="space-y-3 mb-8">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-muted-foreground">
                                        <span>
                                            {item.quantity} × {item.ticketTypeName}
                                        </span>
                                        <span>
                                            {item.totalPrice.toLocaleString("fr-FR", {
                                                style: "currency",
                                                currency: "EUR",
                                            })}
                                        </span>
                                    </div>
                                ))}

                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span>
                                        {order.totalAmount.toLocaleString("fr-FR", {
                                            style: "currency",
                                            currency: "EUR",
                                        })}
                                    </span>
                                </div>
                            </div>


                        </CardContent>
                    </Card>

                    <div className="flex justify-center mt-10">
                        <Link href={`/${order?.eventUrl}`}>
                            <Button variant="outline">
                                <ArrowLeft/>
                                Back to Event
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderConfirmationCard;
