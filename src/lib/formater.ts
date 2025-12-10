import {Address} from "@/types/events";
import {slugify} from "@/lib/utils";

export const formatAddress = (address: Address): string => {
    const parts = [
        address.address1,
        address.address2,
        `${address.zipCode} ${address.city}`.trim(),
        address.country
    ].filter(Boolean); // remove null, undefined, empty strings

    return parts.join(', ');
};

export const formatEventUrl = (eventTitle: string, eventId: number | string): string =>
    `/${slugify(eventTitle)}_E${eventId}`;

export const formatCurrency = (amount: number, locale: string, currency: string = "EUR") => {
    const localeMap: Record<string, string> = {
        fr: "fr-FR",
        en: "en-US",
        es: "es-ES",
    };
    return amount.toLocaleString(localeMap[locale] || locale, {
        style: "currency",
        currency,
    });
}