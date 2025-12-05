export interface Ticket {
    eventName: string;
    surtitle: string | null;
    subtitle: string | null;
    startDate: string;
    endDate: string;
    venueName: string;
    venueAddress: string;
    venueCity: string;
    venueCountry: string;
    buyerName: string;
    buyerEmail: string;
    ticketType: string;
    ticketNumber: string;
    qrCode: string;
    barcodeNumber: string;
    organizerName: string;
    organizerPhone: string;
    organizerEmail: string;
    organizerWebsite: string;
    orderNumber: string;
    orderDate: string;
    ticketId: string;
    price: number;
}