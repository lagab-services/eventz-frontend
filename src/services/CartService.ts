import 'server-only';
import { AddToCartRequest, CartResponse } from '@/types/cart';
import { cookies } from 'next/headers';
import { apiClient, RestApi } from "@/lib/httpClient";

export class CartService {
    private readonly api: RestApi;

    constructor(token?: string) {
        this.api = apiClient;

        if (token) {
            this.api.setAuth(token);
        }
    }

    static async fromCookie() {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session");

        if (sessionCookie) {
            apiClient.setHeaders({
                'Authorization': `Bearer ${sessionCookie.value}`,
                // or : 'Cookie': `session=${sessionCookie.value}` depends on backend
            });
        }

        return new CartService();
    }


    // ➤ POST /api/cart/items
    async addToCart(req: AddToCartRequest): Promise<CartResponse> {
        const res = await this.api.post<CartResponse>(`/api/cart/items`, req);
        return res.data;
    }

    // ➤ GET /api/cart
    async getCart(): Promise<CartResponse> {
        const res = await this.api.get<CartResponse>(`/cart`);
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

