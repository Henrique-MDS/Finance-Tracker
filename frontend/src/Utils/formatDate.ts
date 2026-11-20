import { getLanguage } from "@/i18n/i18n";

export function formatDate(date: string | Date | null) {
    if (!date) return null;
    const dateObj = new Date(date);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    return getLanguage() === "en-US" ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
}

export function toISODate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
