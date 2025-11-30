import {apiClient, RestApi} from "@/lib/httpClient";
import {Page, PaginationParams} from "@/types/page";
import {EventSearchParams, Event, EventSummary} from "@/types/events";

export class EventService {
    private readonly api: RestApi;

    constructor(token?: string) {
        this.api = apiClient;
        if (token) {
            this.api.setAuth(token);
        }
    }

    // ➤ GET /api/v1/events
    async searchEvents(
        params: EventSearchParams = {},
        pagination: PaginationParams = {}
    ): Promise<Page<EventSummary>> {
        const combinedParams = { ...params, ...pagination };
        const res = await this.api.get<Page<EventSummary>>("/api/v1/events", {
            params: combinedParams,
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/{id}
    async getEventById(eventId: number): Promise<Event> {
        const res = await this.api.get<Event>(`/api/v1/events/${eventId}`);
        return res.data;
    }

    // ➤ GET /api/v1/events/upcoming
    async getUpcomingEvents(pagination: PaginationParams = {}): Promise<Page<EventSummary>> {
        const res = await this.api.get<Page<EventSummary>>("/api/v1/events/upcoming", {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/upcoming/{organizerId}
    async getUpcomingEventsByOrganizer(
        organizerId: number,
        pagination: PaginationParams = {}
    ): Promise<Page<EventSummary>> {
        const res = await this.api.get<Page<EventSummary>>(`/api/v1/events/upcoming/${organizerId}`, {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/organizer/{organizerId}
    async getEventsByOrganizer(
        organizerId: number,
        pagination: PaginationParams = {}
    ): Promise<Page<EventSummary>> {
        const res = await this.api.get<Page<EventSummary>>(`/api/v1/events/organizer/${organizerId}`, {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ POST /api/v1/events/search (Advanced search using request body)
    async searchEventsAdvanced(
        searchParams: EventSearchParams,
        pagination: PaginationParams = {}
    ): Promise<Page<EventSummary>> {
        const res = await this.api.post<Page<EventSummary>>("/api/v1/events/search", searchParams, {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/city/{city}
    async getEventsByCity(
        city: string,
        pagination: PaginationParams = {}
    ): Promise<Page<EventSummary>> {
        const res = await this.api.get<Page<EventSummary>>(`/api/v1/events/city/${city}`, {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/type/{type}
    async getEventsByType(
        type: string, // Assuming type is passed as a string representing the enum value
        pagination: PaginationParams = {}
    ): Promise<Page<EventSummary>> {
        const res = await this.api.get<Page<EventSummary>>(`/api/v1/events/type/${type}`, {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/free
    async getFreeEvents(pagination: PaginationParams = {}): Promise<Page<EventSummary>> {
        const res = await this.api.get<Page<EventSummary>>("/api/v1/events/free", {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/available-tickets
    async getEventsWithAvailableTickets(pagination: PaginationParams = {}): Promise<Page<EventSummary>> {
        const res = await this.api.get<Page<EventSummary>>("/api/v1/events/available-tickets", {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/upcoming-free
    async getUpcomingFreeEvents(pagination: PaginationParams = {}): Promise<Page<EventSummary>> {
        const res = await this.api.get<Page<EventSummary>>("/api/v1/events/upcoming-free", {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/nearby
    async getNearbyEvents(
        latitude: number,
        longitude: number,
        radius: number = 10.0,
        params: Partial<Pick<EventSearchParams, 'type' | 'isFree'>> = {},
        pagination: PaginationParams = {}
    ): Promise<Page<EventSummary>> {
        const combinedParams = {
            latitude,
            longitude,
            radius,
            ...params,
            ...pagination,
        };
        const res = await this.api.get<Page<EventSummary>>("/api/v1/events/nearby", {
            params: combinedParams,
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/status/{status}
    async getEventsByStatus(
        status: string, // Assuming status is passed as a string representing the enum value
        pagination: PaginationParams = {}
    ): Promise<Page<EventSummary>> {
        const res = await this.api.get<Page<EventSummary>>(`/api/v1/events/status/${status}`, {
            params: { ...pagination },
        });
        return res.data;
    }

    // ➤ GET /api/v1/events/organizer/{organizerId}/count
    async countEventsByOrganizer(organizerId: number): Promise<number> {
        const res = await this.api.get<number>(`/api/v1/events/organizer/${organizerId}/count`);
        return res.data;
    }

}