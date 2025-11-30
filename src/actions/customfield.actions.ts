'use server';
import {EventService} from "@/services/EventService";
import {CustomField} from "@/types/customFields";

export type CustomFieldActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string;};

export async function getCustomFields(eventId: number): Promise<CustomFieldActionResponse<CustomField[]>> {
    try {
        const eventService = new EventService();
        const customFields = await eventService.getEventCustomFields(eventId);
        return {success: true, data: customFields};
    } catch (error) {
        console.error('NotFound fetching customFields:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch custom fields',
        };
    }
}
