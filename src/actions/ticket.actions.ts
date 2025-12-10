"use server";

import {createHmac} from "node:crypto";

const SECRET = process.env.TICKET_SECRET!;
const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const generateTicketUrl = async (ticketId: string) => {
    const expires = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
    const base = `${ticketId}:${expires}`;
    console.log(crypto);
    const sig = createHmac("sha256", SECRET).update(base).digest("hex");

    return `${BASE_URL}/api/tickets/pdf?ticket=${ticketId}&expires=${expires}&sig=${sig}`;
}