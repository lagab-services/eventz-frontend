export enum EventStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

enum EventType {
    FESTIVAL = 'FESTIVAL',
    CONFERENCE = 'CONFERENCE',
    WORKSHOP = 'WORKSHOP',
    CONCERT = 'CONCERT',
    SPORTS = 'SPORTS',
    OTHER = 'OTHER'
}

export interface Address {
    id: number;
    name: string | null;
    address1: string;
    address2: string | null;
    city: string;
    state: string | null;
    country: string;
    zipCode: string | null;
    longitude: number | null;
    latitude: number | null;
    isOnline: boolean | null;
    onlineUrl: string | null;
}

export interface TicketType {
    id: number;
    name: string;
    description: string;
    price: number;
    quantityAvailable: number;
    quantitySold: number;
    saleStart: string | null;
    saleEnd: string | null;
    minQuantity: number;
    maxQuantity: number;
    isActive: boolean;
    remainingTickets: number | null;
    categoryId: number;
    categoryName: string;
    quantityRemaining: number;
    totalPrice: number;
    isOnSale: boolean;
    isSoldOut: boolean;
    eventId: number;
    eventName: string;
}

export interface TicketCategory {
    id: number;
    name: string;
    description: string;
    displayOrder: number;
    isActive: boolean;
    isCollapsed: boolean;
    ticketTypes: TicketType[];
}

export interface Event {
    id: number;
    name: string;
    description: string;
    summary: string;
    surtitle: string | null;
    subtitle: string | null;
    startDate: string;
    endDate: string;
    registrationStart: string;
    registrationEnd: string;
    status: EventStatus;
    type: EventType;
    imageUrl: string;
    website: string;
    maxAttendees: number;
    isPublic: boolean;
    isFree: boolean;
    currency: string;
    createdAt: string;
    updatedAt: string;
    organizerId: number;
    organizerName: string;
    organizationId: string;
    organizationName: string;
    address: Address;
    ticketCategories: TicketCategory[];
    averageRating: number;
    reviewCount: number;
}

/**
 * Represents a summary of an event, typically used in lists or search results.
 * This DTO is leaner than the full `Event` object, focusing on essential display information.
 */
export interface EventSummary {
    id: number;
    name: string;
    summary: string;
    startDate: string; // ISO string format
    endDate: string;   // ISO string format
    status: EventStatus;
    type: EventType;
    imageUrl: string;
    isPublic: boolean;
    isFree: boolean;
    currency: string;
    city?: string; // Optional, as some events might be online or city not explicitly listed in summary
    country?: string; // Optional
    averageRating?: number | null;
    reviewCount?: number | null;
    availableTickets?: number | null; // Added based on the /available-tickets endpoint
}

export interface EventSearchParams {
    keyword?: string;
    type?: string; // Use string for enum values if they are sent as strings
    status?: string; // Use string for enum values if they are sent as strings
    city?: string;
    startDate?: string; // ISO format string
    endDate?: string; // ISO format string
    isFree?: boolean;
    latitude?: number;
    longitude?: number;
    radius?: number;
    organizerId?: number;
    organizationId?: string;
}
