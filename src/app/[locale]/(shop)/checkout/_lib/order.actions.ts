"use server";

import {OrderRequest} from "@/types/checkout";
import {OrderService} from "@/services/OrderService";

export const createOrder = async(input: OrderRequest,sessionId: string,accessToken: string) => {

    try {
        const orderService = OrderService.fromAccessAndSession(accessToken,sessionId);
        const res = await orderService.createCheckoutSession(input);
        console.log("response",res);
        return {data: res ,error: null};


    } catch (e){
        return {data: null,error: e instanceof Error ? e.message : 'An error occurred'};
    }
};