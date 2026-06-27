import { notify } from "./notify";


export function verifyForm(fields: string[]): boolean {
    if (!fields || fields.length < 1) {
        return false;
    }

    for (const field of fields) {
        if (!field) {
            notify.error("Campos obrigatórios não preenchidos");
            return false;
        }
    }

    return true;
}