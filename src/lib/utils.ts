
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFullUrl = (relativeUrl: string | null | undefined) => {
    if (!relativeUrl) return 'https://placehold.co/600x400.png';
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (relativeUrl.startsWith('http') || relativeUrl.startsWith('data:')) return relativeUrl;
    if (!baseUrl) return relativeUrl; // fallback if base url is not set
    return `${baseUrl}${relativeUrl}`;
};
