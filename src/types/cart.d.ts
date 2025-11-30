export interface CartItemResponse {
    ticketTypeId: number;
    ticketTypeName: string;
    eventTitle: string;
    eventId: number;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    availableQuantity: number;
    isAvailable: boolean;
}

export interface CartMessage {
    type: 'warning' | 'error' | 'info';
    message: string;
    ticketTypeId?: number;
}

export interface CartResponse {
    items: CartItemResponse[];
    subtotal: number;
    fees: number;
    discount: number;
    total: number;
    totalItems: number;
    updatedAt: string;
    promoCode: string | null;
    isValid: boolean;
    warnings: CartMessage[];
    errors: CartMessage[];
    session: string;
}

export interface AddToCartRequest {
    eventId: number;
    items: {
        ticketTypeId: number;
        quantity: number;
    }[];
}