export function formatDate(date: string | Date | null) {
    if (!date) return null;
    const dateObj = new Date(date);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    return `${day}/${month}/${year}`;
}