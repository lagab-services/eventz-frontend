import {apiClient, RestApi} from "@/lib/httpClient";
import {CheckoutResponse, OrderRequest, TrackOrderRequest} from "@/types/checkout";
import {Page} from "@/types/page";
import {OrderResponse, OrderWithTickets} from "@/types/order";

export class AttendeeService {
    private readonly api: RestApi;

    constructor(token?: string, customHeader?: Record<string, string>) {
        this.api = apiClient;

        if (token) {
            this.api.setAuth(token);
        }
        if (customHeader) {
            this.api.setHeaders(customHeader);
        }
    }


    // ➤ GET /api/attendees/ticket/**/download
    async downloadTicketFromTicketId(
        ticketId: number
    ): Promise<Blob> {
        const res = await this.api.get<Blob>(`/api/attendees/ticket/${ticketId}/download`, {
            responseType: "blob",
        });
        return res.data;
    }

    // ➤ GET /api/guest/orders/${orderNumber}/attendees/${attendeeId}/ticket
    async downloadTicket(
        orderNumber: string,
        attendeeId: number
    ): Promise<Blob> {
        const res = await this.api.get<Blob>(`/api/guest/orders/${orderNumber}/attendees/${attendeeId}/ticket`, {
            responseType: "blob",
        });
        return res.data;
    }

}