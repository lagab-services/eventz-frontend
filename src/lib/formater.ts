import {Address} from "@/types/events";

export const formatAddress = (address: Address): string => {
    const parts = [
        address.address1,
        address.address2,
        `${address.zipCode} ${address.city}`.trim(),
        address.country
    ].filter(Boolean); // remove null, undefined, empty strings

    return parts.join(', ');
};