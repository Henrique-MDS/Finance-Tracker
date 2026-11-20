import type { RecurrentTable } from "@/types/generalTypes";

const daysInMonthUTC = (year: number, month: number) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

const withAnchorDay = (base: Date, year: number, month: number, anchorDay: number) => {
    const date = new Date(base);
    date.setUTCFullYear(year, month, Math.min(anchorDay, daysInMonthUTC(year, month)));
    return date;
};

const step = (current: Date, frequency: string, anchor: Date) => {
    const next = new Date(current);

    switch (frequency) {
        case "Diaria":
            next.setUTCDate(next.getUTCDate() + 1);
            return next;
        case "Semanal":
            next.setUTCDate(next.getUTCDate() + 7);
            return next;
        case "Mensal": {
            const month = current.getUTCMonth() + 1;
            return withAnchorDay(current, current.getUTCFullYear() + Math.floor(month / 12), month % 12, anchor.getUTCDate());
        }
        case "Anual":
            return withAnchorDay(current, current.getUTCFullYear() + 1, anchor.getUTCMonth(), anchor.getUTCDate());
        default:
            return null;
    }
};

export function computeNextExecution(recurrent: RecurrentTable, from: Date = new Date()): Date {
    const startOfDay = new Date(from);
    startOfDay.setHours(0, 0, 0, 0);

    const anchor = new Date(recurrent.execution_time ?? recurrent.next_execution ?? from);
    let next = new Date(recurrent.next_execution ?? anchor);

    while (next < startOfDay) {
        const stepped = step(next, recurrent.frequency, anchor);
        if (!stepped) break;
        next = stepped;
    }

    return next;
}
