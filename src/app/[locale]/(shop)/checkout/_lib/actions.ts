"use server";

import {OrderRequest} from "@/types/checkout";

export const createOrder = async(input: OrderRequest) => {
    //const orderService = new OrderService();
    try {
        console.log("call api to create order with input:", input);
        /* Todo: uncomment when API is ready
        const res = await orderService.createCheckoutSession(input);
        return {data: res ,error: null};*/
        return {data: {checkoutUrl: 'http://google.fr'} ,error: null};


    } catch (e){
        return {data: null,error: e instanceof Error ? e.message : 'An error occurred'};
    }
};