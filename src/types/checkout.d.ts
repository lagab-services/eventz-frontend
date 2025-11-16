export interface OrderItem {
    ticketType: TicketType;
    quantity: number;
}

export interface AttendeeInfo {
    firstName: string;
    lastName: string;
    email: string;
    ticketTypeId: number;
    ticketTypeName?: string;
    customFields?: object;
}

export interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    acceptTerms: boolean;
    subscribeNewsletter?: boolean;
}

export type CheckoutStep = 'tickets' | 'info' | 'payment' | 'confirmation';

export interface OrderRequest {
    // Mandatory billing information
    billingName: string;
    billingEmail: string;
    billingPhone?: string;

    // Billing address (optional)
    billingAddress?: string;
    billingCity?: string;
    billingZipCode?: string;
    billingCountry?: string;

    // Attendees
    attendees: AttendeeInfo[];

    // Notes
    notes?: string;

    // Terms and newsletter
    acceptTerms: boolean;
    subscribeNewsletter?: boolean;

    // Return URLs
    successUrl?: string;
    cancelUrl?: string;
}

export interface TrackOrderRequest {
    orderNumber: string;
    email: string;
}


export interface CheckoutResponse {
    checkoutUrl: string;
    orderId: string;
    sessionId: string;
    expiresAt: number;
}
