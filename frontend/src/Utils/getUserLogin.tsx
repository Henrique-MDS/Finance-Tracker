import { supabase } from "../services/supabase"

type LogInUserResult = {
    success: boolean;
    message: string;
    hasMFA: boolean;
    name?: string;
    email?: string;
    error?: any;
}

export const getUserLogin = async (email:string, password:string): Promise<LogInUserResult> => {
    
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if(error){
        return {
            success: false,
            message: "Falha no Login, verifique se o usuário existe",
            error: error,
            hasMFA: false
        }
    }

    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (aalError) {
        return {
            success: false,
            message: "Erro ao verificar nível de autenticação",
            error: aalError,
            hasMFA: false,
        };
    }
    
    const hasMFA = aal.currentLevel === "aal1" && aal.nextLevel === "aal2";

    return {
        success: true,
        message: "Sessão Iniciada!",
        hasMFA: hasMFA
    }
}