import { translate } from "@/i18n/i18n";
import { supabase } from "../services/supabase"

type InsertUserResult = {
    success: boolean;
    message: string;
    name?: string;
    email?: string;
    error?: any;
}

export const insertUser = async (name:string, email: string, password:string): Promise<InsertUserResult> => {
    
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name
            }
        }
    });
    
    if(error){
        return {
            success: false, 
            message: translate("auth.registerEmailError"), 
            error: error
        } 
    }

    return {
        success: true, 
        message: translate("auth.registerSuccess")
    }  
}