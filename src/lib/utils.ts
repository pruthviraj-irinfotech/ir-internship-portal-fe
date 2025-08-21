
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFullUrl = (relativeUrl: string | null | undefined): string | undefined => {
    if (!relativeUrl) {
        return undefined; // Return undefined for falsy URLs
    }
    if (relativeUrl.startsWith('http') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
    }
    // Ensure no double slashes if NEXT_PUBLIC_API_BASE_URL has a trailing slash
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
    if (!baseUrl) return relativeUrl; // fallback if base url is not set
    return `${baseUrl}${relativeUrl}`;
};
