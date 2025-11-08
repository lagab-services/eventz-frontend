export interface OrderItem {
    ticketType: TicketType;
    quantity: number;
}

export interface AttendeeInfo {
    firstName: string;
    lastName: string;
    email: string;
    ticketTypeId: number;
    ticketTypeName: string;
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