export interface OrderResponse {
    orderId: number;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    feesAmount: number;
    createdAt: string;        // ISO date string or Date

    // Ticket details
    items: OrderItemResponse[];

    // Event information
    eventTitle: string;
    eventDate: string;        // ISO date string or Date
    eventLocation: string;

    // Next steps
    expiresAt: string | null; // ISO date string or Date
    notes: string | null;
}

export interface OrderItemResponse {
    ticketTypeName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export enum OrderStatus {
    PENDING = "PENDING",
    ABORTED = "ABORTED",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    REFUNDED = "REFUNDED"
}
