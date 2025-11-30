/**
 * uuid-base64.ts
 *
 * Convert UUID ⇄ Base64 URL-safe (22 characters, no padding)
 */

import { v4 as uuidv4 } from "uuid";

/**
 * Convert a UUID string to Base64 URL-safe (no padding)
 * @param uuid UUID in standard format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
 * @returns Base64 URL-safe string (22 characters)
 */
export function uuidToBase64(uuid: string): string {
    return Buffer.from(uuid.replaceAll("-", ""), "hex")
        .toString("base64")
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", ""); // remove padding
}

/**
 * Convert a Base64 URL-safe string (22 characters) back to a standard UUID
 * @param b64 Base64 URL-safe string (22 characters)
 * @returns UUID in standard format
 */
export function base64ToUuid(b64: string): string {
    // restore standard Base64 characters and padding
    const padded = b64.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (b64.length % 4)) % 4);

    const hex = Buffer.from(padded, "base64").toString("hex");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Generate a random UUID (v4)
 */
export function generateUuid(): string {
    return uuidv4();
}

/**
 * Generate a random Base64 URL-safe UUID directly
 */
export function generateBase64Uuid(): string {
    return uuidToBase64(generateUuid());
}
