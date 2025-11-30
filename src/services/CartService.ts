import 'server-only';
import { AddToCartRequest, CartResponse } from '@/types/cart';
import { cookies } from 'next/headers';
import { apiClient, RestApi } from "@/lib/httpClient";
import {uuidToBase64} from "@/lib/uuid";

export class CartService {
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

    static async fromCookie() {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("sessionId");

        if (sessionCookie) {
            return new CartService(undefined, { 'X-Session-Token': sessionCookie.value });
        }

        return new CartService();
    }
    static fromToken(token: string) {
        return new CartService(undefined, { 'X-Session-Token': token });
    }


    // ➤ POST /api/cart/items
    async addToCart(req: AddToCartRequest): Promise<CartResponse> {
        const promises = req.items.map(item => {
            const urlParams = new URLSearchParams();

            if (item.ticketTypeId) {
                urlParams.append("ticketTypeId", item.ticketTypeId.toString());
            }

            if (item.quantity) {
                urlParams.append("quantity", item.quantity.toString());
            }

            const queryString = urlParams.toString();
            const url = queryString
                ? `/api/cart/items?${queryString}`
                : `/api/cart/items`;

            return this.api.post<CartResponse>(url, req);
        });

        const results = await Promise.all(promises);

        const lastResponse = results[results.length - 1];

        const result = lastResponse.data;

        const sessionHeader =
            lastResponse.config.headers?.["x-session-token"] ??
            lastResponse.config.headers?.["X-Session-Token"] ??
            null;

        return {
            ...result,
            session: uuidToBase64(sessionHeader),
        };
    }

    // ➤ GET /api/cart
    async getCart(): Promise<CartResponse> {
        const res = await this.api.get<CartResponse>(`/api/cart`);
        return res.data;
    }

    // ➤ PUT /api/cart/items/{ticketTypeId}
    async updateCartItem(ticketTypeId: number, quantity: number): Promise<CartResponse> {
        const res = await this.api.put<CartResponse>(`/api/cart/items/${ticketTypeId}`, { quantity });
        return res.data;
    }

    // ➤ DELETE /api/cart/items/{ticketTypeId}
    async removeCartItem(ticketTypeId: number): Promise<CartResponse> {
        const res = await this.api.delete<CartResponse>(`/api/cart/items/${ticketTypeId}`);
        return res.data;
    }

    // ➤ DELETE /api/cart
    async clearCart(): Promise<void> {
        await this.api.delete(`/api/cart`);
    }

    // ➤ POST /api/cart/promo?code=XXXX
    async applyPromoCode(promoCode: string): Promise<CartResponse> {
        const res = await this.api.post<CartResponse>(`/api/cart/promo`, null, {
            params: { code: promoCode }
        });
        return res.data;
    }

    // ➤ POST /api/cart/promo?code=
    async removePromoCode(): Promise<CartResponse> {
        const res = await this.api.post<CartResponse>(`/api/cart/promo`, null, {
            params: { code: "" }
        });
        return res.data;
    }
}

