import { cache } from "react";
import { EventService } from "@/services/EventService";
import { Event } from "@/types/events";

export const getEventCached = cache(async (eventId: number): Promise<Event> => {
    const service = new EventService();
    return await service.getEventById(eventId);
});
