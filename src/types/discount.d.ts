export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Discount {
    id?: string;
    type: DiscountType;
    code: string;
    amount_off?: number;
    percent_off?: number;
    eventId: number;
    ticket_type_ids: number[];
    quantity_available: number;
    quantity_sold: number;
    start_date: string;
    end_date: string;
    end_date_relative?: number;
    ticket_category_id: number;
    ticket_category_name: string;
}
