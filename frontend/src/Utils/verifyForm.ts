import { translate } from "@/i18n/i18n";
import { notify } from "./notify";


export function verifyForm(fields: string[]): boolean {
    if (!fields || fields.length < 1) {
        return false;
    }

    for (const field of fields) {
        if (!field) {
            notify.error(translate("common.requiredFields"));
            return false;
        }
    }

    return true;
}