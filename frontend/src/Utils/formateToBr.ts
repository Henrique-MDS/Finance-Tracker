import { getLanguage } from "@/i18n/i18n";

export function formatCurrencyBR(value: number): string {
  return new Intl.NumberFormat(getLanguage(), {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
