import { notify } from "./notify";


export function verifyForm(fields:string[]) {
    if(!fields || fields.length < 1) return null;
    fields.forEach(field => {
        if(!field){
            notify.error("Campos obrigatórios não preenchidos")
            return false;
        } 
    });

    return true;
}