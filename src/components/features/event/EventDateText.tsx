"use client";

import {useFormatter, useTranslations} from "next-intl";


type EventMessageValues =
    | { date: string }
    | { start: string; end: string };

const EventDateText = ({
                           startDate,
                           endDate
                       }: {
    startDate: string;
    endDate?: string | null;
}) => {
    const t = useTranslations("event");
    const f = useFormatter();

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const now = new Date();

    const formattedStart = f.dateTime(start, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const formattedEnd = end
        ? f.dateTime(end, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
        : null;


    const isOngoing = end && start <= now && now <= end;
    const isPast = (!end && start < now) || (end && end < now);
    //const isFuture = !isOngoing && !isPast;

    const renderMessage = (key: string, values: EventMessageValues) =>
        t.rich(key, {
            date: (chunk) => <span className="text-accent-foreground">{chunk}</span>,
            start: (chunk) => <span className="text-accent-foreground">{chunk}</span>,
            end: (chunk) => <span className="text-accent-foreground">{chunk}</span>,
            ...values
        });

    if (isOngoing) {
        return end
            ? renderMessage("ongoingRange", {start: formattedStart, end: formattedEnd!})
            : renderMessage("ongoingSingle", {date: formattedStart});
    }

    if (isPast) {
        return end
            ? renderMessage("pastRange", {start: formattedStart, end: formattedEnd!})
            : renderMessage("pastSingle", {date: formattedStart});
    }

    return end
        ? renderMessage("futureRange", {start: formattedStart, end: formattedEnd!})
        : renderMessage("futureSingle", {date: formattedStart});
};

export default EventDateText;