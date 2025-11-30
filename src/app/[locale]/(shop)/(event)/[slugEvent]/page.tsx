import {notFound} from "next/navigation";
import EventWrapper from "./EventWrapper";
import React from "react";
import Footer from "@/components/layout/Footer";
import {EventService} from "@/services/EventService";
import {Event} from "@/types/events";
import Header from "@/components/layout/Header";
import {getEventCached} from "@/app/[locale]/(shop)/(event)/_actions/event.action";

export const extractEventId = (slug: string): number | null => {
    const match = slug.match(/^(.*)_E(\w+)$/);
    return match ? Number(match[2]) : null;
};

export const generateMetadata = async ({ params }: { params: Promise<{ slugEvent: string }> }) => {
    const { slugEvent } = await params;

    const eventId = extractEventId(slugEvent);
    if (!eventId) return {};

    let event: Event;
    try {
        event = await getEventCached(eventId);
    } catch {
        return {};
    }

    return {
        title: `${event.name}`,
        description: event.summary ?? `${event.name}`,
        openGraph: {
            title: event.name,
            description: event.summary ?? "",
            url: `/${slugEvent}`,
            images: event.imageUrl ? [{ url: event.imageUrl }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: event.name,
            description: event.summary ?? "",
            images: event.imageUrl ? [event.imageUrl] : [],
        },
    };
};

const EventPage = async ({params}: { params: Promise<{ slugEvent: string }> }) => {

    const {slugEvent} = await params;

    const eventId = extractEventId(slugEvent);
    if (!eventId) notFound();

    let eventData: Event;
    try {
        eventData = await getEventCached(eventId);
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <>
            <Header/>
            <main>
                <div className="mx-auto space-y-3 -mt-4 md:-mt-14 w-full">
                    <EventWrapper event={eventData}/>
                </div>
            </main>
            <Footer/>
        </>
    );
};

export default EventPage;