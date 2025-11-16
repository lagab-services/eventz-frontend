'use server';

import {AddToCartRequest, CartResponse} from '@/types/cart';
import {revalidatePath} from 'next/cache';
import {CartService} from "@/services/CartService";

export type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: string };

export async function addToCartAction(
    request: AddToCartRequest
): Promise<ActionResponse<CartResponse>> {
    try {
        const cartService = await CartService.fromCookie();
        const cart = await cartService.addToCart(request);
        revalidatePath('/checkout'); // Revalidate the checkout page
        return {success: true, data: cart};
    } catch (error) {
        console.error('NotFound adding to cart:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add to cart',
        };
    }
}

export async function getCartAction(): Promise<ActionResponse<CartResponse>> {
    try {
        const cartService = await CartService.fromCookie();
        const cart = await cartService.getCart();
        return {success: true, data: cart};
    } catch (error) {
        console.error('NotFound fetching cart:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch cart',
        };
    }
}

export async function updateCartItemAction(
    ticketTypeId: number,
    quantity: number
): Promise<ActionResponse<CartResponse>> {
    try {
        const cartService = await CartService.fromCookie();
        const cart = await cartService.updateCartItem(ticketTypeId, quantity);
        revalidatePath('/checkout');
        return {success: true, data: cart};
    } catch (error) {
        console.error('NotFound updating cart item:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update cart item',
        };
    }
}

export async function removeCartItemAction(
    ticketTypeId: number
): Promise<ActionResponse<CartResponse>> {
    try {
        const cartService = await CartService.fromCookie();
        const cart = await cartService.removeCartItem(ticketTypeId);
        revalidatePath('/checkout');
        return {success: true, data: cart};
    } catch (error) {
        console.error('NotFound removing cart item:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to remove cart item',
        };
    }
}

export async function clearCartAction(): Promise<ActionResponse<void>> {
    try {
        const cartService = await CartService.fromCookie();
        await cartService.clearCart();
        revalidatePath('/checkout');
        return {success: true, data: undefined};
    } catch (error) {
        console.error('NotFound clearing cart:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to clear cart',
        };
    }
}

export async function applyPromoCodeAction(
    promoCode: string
): Promise<ActionResponse<CartResponse>> {
    try {
        const cartService = await CartService.fromCookie();
        const cart = await cartService.applyPromoCode(promoCode);
        revalidatePath('/checkout');
        return {success: true, data: cart};
    } catch (error) {
        console.error('NotFound applying promo code:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Invalid promo code',
        };
    }
}

export async function removePromoCodeAction(): Promise<ActionResponse<CartResponse>> {
    try {
        const cartService = await CartService.fromCookie();
        const cart = await cartService.removePromoCode();
        revalidatePath('/checkout');
        return {success: true, data: cart};
    } catch (error) {
        console.error('NotFound removing promo code:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to remove promo code',
        };
    }
}
