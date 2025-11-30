import {apiClient, RestApi} from "@/lib/httpClient";
import {CheckoutResponse, OrderRequest, TrackOrderRequest} from "@/types/checkout";
import {Page} from "@/types/page";
import {OrderResponse} from "@/types/order";

export class OrderService {
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

    static fromAccessAndSession(accessToken?: string, sessionToken?: string) {
        return new OrderService(accessToken, sessionToken ? { 'X-Session-Token': sessionToken } : undefined);
    }

    static fromToken(token: string) {
        return new OrderService(undefined, { 'X-Session-Token': token });
    }

    // ➤ POST /api/orders/checkout
    async createCheckoutSession(order: OrderRequest): Promise<CheckoutResponse> {
        const res = await this.api.post<CheckoutResponse>("/api/orders/checkout", order);
        return res.data;
    }

    // ➤ GET /api/orders/{orderId}
    async getOrder(orderId: number): Promise<OrderResponse> {
        const res = await this.api.get<OrderResponse>(`/api/orders/${orderId}`);
        return res.data;
    }

    // ➤ GET /api/orders/user/{userId}?page=0&size=20
    async getUserOrders(
        userId: number,
        page: number = 0,
        size: number = 20
    ): Promise<Page<OrderResponse>> {
        const res = await this.api.get<Page<OrderResponse>>(`/api/orders/user/${userId}`, {
            params: {page, size}
        });
        return res.data;
    }

    // ➤ GET /api/orders/event/{eventId}?page=0&size=20
    async getEventOrders(
        eventId: number,
        page: number = 0,
        size: number = 20
    ): Promise<Page<OrderResponse>> {
        const res = await this.api.get<Page<OrderResponse>>(`/api/orders/event/${eventId}`, {
            params: {page, size}
        });
        return res.data;
    }

    // ➤ PUT /api/orders/{orderId}/cancel?reason=xxx
    async cancelOrder(
        orderId: number,
        reason?: string
    ): Promise<OrderResponse> {
        const res = await this.api.put<OrderResponse>(`/api/orders/${orderId}/cancel`, null, {
            params: reason ? {reason} : {}
        });
        return res.data;
    }

    // -------------------------
    // Guest Order Endpoints
    // -------------------------

    async trackGuestOrder(
        request: TrackOrderRequest
    ): Promise<OrderResponse> {
        const res = await this.api.post<OrderResponse>("/api/guest/orders/track", request);
        return res.data;
    }

    async downloadTicket(
        orderNumber: string,
        attendeeId: number
    ): Promise<Blob> {
        const res = await this.api.get<Blob>(`/api/guest/orders/${orderNumber}/attendees/${attendeeId}/ticket`, {
            responseType: "blob", // nécessaire pour un PDF
        });
        return res.data;
    }

}