import { enUS, ptBR } from "date-fns/locale";
import { en, pt, type TranslationKey } from "./translations";

export type Language = "pt-BR" | "en-US";

export const LANGUAGES: { value: Language; label: string }[] = [
    { value: "pt-BR", label: "Português (Brasil)" },
    { value: "en-US", label: "English (US)" },
];

const STORAGE_KEY = "language";
const dictionaries: Record<Language, Record<TranslationKey, string>> = { "pt-BR": pt, "en-US": en };

export const isLanguage = (value: unknown): value is Language =>
    value === "pt-BR" || value === "en-US";

const readStoredLanguage = (): Language => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (isLanguage(stored)) return stored;
    } catch {
        /* storage indisponível */
    }
    return navigator.language?.toLowerCase().startsWith("pt") ? "pt-BR" : "en-US";
};

let currentLanguage: Language = readStoredLanguage();
document.documentElement.lang = currentLanguage;

export const getLanguage = () => currentLanguage;

export const setCurrentLanguage = (language: Language) => {
    currentLanguage = language;
    document.documentElement.lang = language;
    try {
        localStorage.setItem(STORAGE_KEY, language);
    } catch {
        /* storage indisponível */
    }
};

export const translate = (key: TranslationKey, params?: Record<string, string | number>) => {
    let text = dictionaries[currentLanguage][key] ?? pt[key] ?? key;
    if (params) {
        for (const [name, value] of Object.entries(params)) {
            text = text.replaceAll(`{${name}}`, String(value));
        }
    }
    return text;
};

export const getDateLocale = () => (currentLanguage === "pt-BR" ? ptBR : enUS);

export const translateType = (type: string) =>
    type === "Receita" || type === "Despesa" ? translate(`type.${type}`) : type;

export const translateFrequency = (freq: string) =>
    freq === "Diaria" || freq === "Semanal" || freq === "Mensal" || freq === "Anual"
        ? translate(`freq.${freq}`)
        : freq;

const defaultCategoryCodes: Record<string, string> = {
    "Alimentação": "FOOD",
    "Transporte": "TRANSPORT",
    "Lazer": "LEISURE",
    "Aporte para Metas": "GOAL_DEPOSIT",
};

export const translateCategory = (name: string) => {
    const code = defaultCategoryCodes[name];
    return code ? translate(`category.${code}` as TranslationKey) : name;
};

export const monthName = (month: number) => {
    if (month < 1 || month > 12) return "";
    const name = new Date(2000, month - 1, 1).toLocaleString(currentLanguage, { month: "long" });
    return name.charAt(0).toUpperCase() + name.slice(1);
};

const englishShortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export const shortMonth = (value: string) => {
    const index = englishShortMonths.indexOf(value.trim().slice(0, 3).toLowerCase());
    if (index === -1) return value.slice(0, 3);
    const name = new Date(2000, index, 1).toLocaleString(currentLanguage, { month: "short" }).replace(".", "");
    return name.charAt(0).toUpperCase() + name.slice(1);
};
