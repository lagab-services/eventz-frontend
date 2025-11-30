import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const slugify = (text: string): string =>
    text
        .normalize("NFD")                 // Separate accent characters
        .replaceAll(/[\u0300-\u036f]/g, "")  // Remove accents
        .toLowerCase()
        .trim()
        .replaceAll(/[^a-z0-9]+/g, "-")      // Replace any non-alphanumeric character with "-"
        .replaceAll(/^-+|-+$/g, "");         // Remove leading/trailing "-"
