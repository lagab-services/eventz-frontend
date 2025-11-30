import React from 'react';
import {base64ToUuid} from "@/lib/uuid";
import {getCart} from "@/actions/cart.actions";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ShoppingCart} from "lucide-react";
import CartWrapper from "@/app/[locale]/(shop)/checkout/_components/CartWrapper";

const CheckoutPage = async({params}: { params: Promise<{ uid: string }> }) => {

    const {uid} = await params;
    const checkoutSessionId = base64ToUuid(uid);

    const res = await getCart(checkoutSessionId);

    if(!res.success){
        return <div className="m-6 text-center min-h-80 content-center">
            <div className="text-destructive">Cet élément est introuvable.</div>
        </div>;
    }

    const cart = res.data;

    if(cart.items.length == 0){
        return <div className="m-6 text-center flex-1 content-center">
            <Empty >
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <ShoppingCart />
                    </EmptyMedia>
                    <EmptyTitle>Ton panier est vide…</EmptyTitle>
                    <EmptyDescription>
                        mais pas pour longtemps, j’en suis sûr ! 😄
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button  size="sm">
                        <ChevronLeft /> Revenir aux billets
                    </Button>
                </EmptyContent>
            </Empty>
        </div>;
    }



    return (
        <div className="min-h-80  flex-1 ">
            <CartWrapper cart={cart} sessionId={checkoutSessionId}/>
        </div>
    );
};

export default CheckoutPage;