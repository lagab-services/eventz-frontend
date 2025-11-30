import {NextResponse} from "next/server";
import {EventService} from "@/services/EventService";
import {Address} from "@/types/events";

const getEventById = async (eventId: number) => {
    try {
        const eventService = new EventService();
        return await eventService.getEventById(eventId);
    } catch (error) {
        console.error(error);
        return null;
    }
};

const formatDateToICS = (date: string) =>
    new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

const formatAddress = (address: Address) => {
    if (!address) return "";

    if (address.isOnline) {
        return address.onlineUrl || "En ligne";
    }

    const parts = [
        address.name,
        address.address1,
        address.address2,
        address.zipCode,
        address.city,
        address.state,
        address.country
    ]
        .filter(Boolean)
        .join(", ");

    return parts;
};

export const GET = async (
    req: Request,
    context: { params: { eventId: string } | Promise<{ eventId: string }> }
) => {
    const { eventId: rawId } = await context.params;

    const eventId = rawId.replace(".ics", "");

    if (!eventId) {
        return NextResponse.json({error: "Missing event ID"}, {status: 400});
    }

    const event = await getEventById(Number(eventId));

    if (!event) {
        return NextResponse.json({error: "Event not found"}, {status: 404});
    }

    const start = formatDateToICS(event.startDate);
    const end = formatDateToICS(event.endDate);

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//TonApp//Event//FR
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${formatDateToICS(new Date().toISOString())}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.name}
DESCRIPTION:${event.description.replace(/\n/g, "\\n")}
LOCATION:${formatAddress(event.address)}
ORGANIZER:${event.organizerName ?? ""}
END:VEVENT
END:VCALENDAR
`.trim();

    return new NextResponse(icsContent, {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="event-${eventId}.ics"`,
        },
    });
};
