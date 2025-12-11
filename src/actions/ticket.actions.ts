"use server";

import {createHmac} from "node:crypto";
import {OrderService} from "@/services/OrderService";
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {GetTicketsSchema} from "@/types/tickets";

const SECRET = process.env.TICKET_SECRET!;
const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const generateTicketUrl = async (ticketId: string) => {
    const expires = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
    const base = `${ticketId}:${expires}`;
    console.log(crypto);
    const sig = createHmac("sha256", SECRET).update(base).digest("hex");

    return `${BASE_URL}/api/tickets/pdf?ticket=${ticketId}&expires=${expires}&sig=${sig}`;
}


export const getUserTickets = async (input: GetTicketsSchema) => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    //pagination
    const pageForBackend = input.page - 1;


    try {
        const orderService = new OrderService(session?.user.accessToken);
        const paginatedTickets = await orderService.getUserTickets(pageForBackend, input.size);
        if (!paginatedTickets) {
            return {data: [], pageCount: 0, totalElements: 0};
        }
        const totalElements = paginatedTickets.totalElements;

        const pageCount = paginatedTickets.totalPages;

        return {data: paginatedTickets.content, pageCount, totalElements: totalElements};

    } catch (e) {
        console.error(e);
        return {data: [], pageCount: 0, totalElements: 0};
    }
};