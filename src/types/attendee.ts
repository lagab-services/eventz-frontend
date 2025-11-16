
export enum CheckInStatus {
    NOT_CHECKED_IN = "NOT_CHECKED_IN",
    CHECKED_IN = "CHECKED_IN",
    NO_SHOW = "NO_SHOW",
    CANCELLED = "CANCELLED"
}

export interface Attendee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    ticketNumber: string;
    ticketTypeName: string;
    checkInStatus: CheckInStatus;
    customFields: Record<string, string>;
}
