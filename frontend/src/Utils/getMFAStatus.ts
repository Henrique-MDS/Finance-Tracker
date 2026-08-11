import { supabase } from "@/services/supabase";
import type { DataResponse } from "@/types/generalTypes";

export const getMFAStatus = async (): Promise<DataResponse> => {
    const { data, error } = await supabase.auth.mfa.listFactors();

    if (error) {
        return {
            success: false,
            message: "Erro ao buscar status MFA",
            error: error
        };
    }

    if (data && data.totp && data.totp.length > 0) {
        const verified = data.totp[0].status === "verified";
        return {
            success: true,
            data: [{ verified }],
            message: "Status do MFA buscado com sucesso",
            error: error
        };
    }
    
    return {
        success: true,
        data: [{ verified: false }],
        message: "Nenhum fator MFA cadastrado",
        error: null
    };
}