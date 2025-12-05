import { format, isSameDay, Locale } from "date-fns";

import { fr, enUS, es } from "date-fns/locale";

type SupportedLocale = "fr" | "en" | "es";

const localeMap: Record<string, Locale> = {
    fr,
    en: enUS,
    es,
};

export const formatEventDates = (
    startDateStr: string,
    endDateStr: string,
    locale: string = "fr"
): string => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const loc = localeMap[locale];

    const formatFull = (d: Date): string =>
        `${format(d, "d MMMM yyyy", { locale: loc })} · ${format(d, "HH:mm", { locale: loc })}`;

    // Case 1: Event happening on a single day
    if (isSameDay(start, end)) {
        return `${format(start, "d MMMM yyyy", { locale: loc })} · ${format(
            start,
            "HH:mm",
            { locale: loc }
        )} - ${format(end, "HH:mm", { locale: loc })}`;
    }

    // Case 2: Multi-day event → always show full date + time for both
    return `${formatFull(start)} → ${formatFull(end)}`;
};


/*
---------------------------------------------------------
 Example usage (Client Component - React)
---------------------------------------------------------

"use client";
import { formatEventDates } from "@/utils/format";
import { useLocale } from "next-intl";

export function Event({ start, end }: { start: string; end: string }) {
  // Retrieve the active locale ("fr", "en", "es", etc.)
  const locale = useLocale() as "fr" | "en" | "es";

  return (
    <p>{formatEventDates(start, end, locale)}</p>
  );
}

---------------------------------------------------------
 Example usage (Server Component - Next.js)
---------------------------------------------------------

import { formatEventDates } from "@/utils/format";
import { getLocale } from "next-intl/server";

export default async function Page2() {
  const locale = (await getLocale()) as "fr" | "en" | "es";

  return (
    <p>
      {formatEventDates(
        "2025-06-15T09:00:00Z",
        "2025-06-17T18:00:00Z",
        locale
      )}
    </p>
  );
}

---------------------------------------------------------
 Example output based on locale
---------------------------------------------------------

// French ("fr"):
// "15 juin 2025 · 09:00 → 17 juin 2025 · 18:00"

// English ("en"):
// "June 15, 2025 · 09:00 → June 17, 2025 · 18:00"

// Spanish ("es"):
// "15 junio 2025 · 09:00 → 17 junio 2025 · 18:00"

*/

export const formatEventDate = (
    dateStr: string,
    locale: string = "fr"
): string => {
    const date = new Date(dateStr);
    const loc = localeMap[locale];

    return `${format(date, "d MMMM yyyy", { locale: loc })} · ${format(
        date,
        "HH:mm",
        { locale: loc }
    )}`;
};
/*
---------------------------------------------------------
 Example usage (Client Component - React)
---------------------------------------------------------

"use client";
import { useLocale } from "next-intl";
import { formatEventDate } from "@/utils/format";

export function EventDate({ date }: { date: string }) {
  // Active locale from the client ("fr", "en", "es", ...)
  const locale = useLocale() as "fr" | "en" | "es";

  return <p>{formatEventDate(date, locale)}</p>;
}

---------------------------------------------------------
 Example usage (Server Component - Next.js)
---------------------------------------------------------

import { getLocale } from "next-intl/server";
import { formatEventDate } from "@/utils/format";

export default async function Page2() {
  const locale = (await getLocale()) as "fr" | "en" | "es";

  return (
    <p>
      {formatEventDate("2025-06-15T09:00:00Z", locale)}
    </p>
  );
}

---------------------------------------------------------
 Example output based on locale
---------------------------------------------------------

// French ("fr"):
// "15 juin 2025 · 09:00"

// English ("en"):
// "June 15, 2025 · 09:00"

// Spanish ("es"):
// "15 junio 2025 · 09:00"

*/