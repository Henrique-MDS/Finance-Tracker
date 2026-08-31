import { getDaysInMonth, setDate } from "date-fns";

export function buildExecutionTime(freq: string, day: string, iniDate: Date): Date {
    if (freq === "Mensal" || freq === "Anual") {
        const dayNumber = Number(day);
        const daysInMonth = getDaysInMonth(iniDate);
        const clampedDay = Math.min(dayNumber, daysInMonth);
        return setDate(iniDate, clampedDay);
    }

    return iniDate;
}
