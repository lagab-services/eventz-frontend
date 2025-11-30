export interface CustomField {
    id: string;
    fieldName: string;
    fieldLabel: string;
    fieldType: 'TEXT' | 'SELECT' | 'TEXTAREA' | 'CHECKBOX' | 'NUMBER';
    isRequired: boolean;
    fieldOptions: string | null;
    placeholder: string;
    displayOrder: number;
    eventId: number;
    ticketTypeId: number | null;
}
