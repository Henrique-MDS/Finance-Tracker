import { translate } from "@/i18n/i18n";
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
            message: translate("auth.loginFailed"),
            error: error,
            hasMFA: false
        }
    }

    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (aalError) {
        return {
            success: false,
            message: translate("auth.aalError"),
            error: aalError,
            hasMFA: false,
        };
    }
    
    const hasMFA = aal.currentLevel === "aal1" && aal.nextLevel === "aal2";

    return {
        success: true,
        message: translate("auth.loginSuccess"),
        hasMFA: hasMFA
    }
}