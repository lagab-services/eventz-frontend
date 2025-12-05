"use server";

import {OrderWithTickets} from "@/types/order";
import {OrderService} from "@/services/OrderService";
import {TrackOrderRequest} from "@/types/checkout";

export async function getOrderInfo(data: TrackOrderRequest): Promise<OrderWithTickets | null> {
    try {
        const orderService = new OrderService();
        return  await orderService.trackGuestOrder(data);
    } catch (e) {
        console.error("Failed to fetch order:", e);
        return null;
    }
}
