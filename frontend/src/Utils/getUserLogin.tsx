import { supabase } from "../services/supabase"

type LogInUserResult = {
    success: boolean;
    message: string;
    name?: string;
    email?: string;
    error?: any;
}

export const getUserLogin = async (email:string, password:string): Promise<LogInUserResult> => {
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if(error){
        return {
            success: false,
            message: "Falha no Login, verifique se o usuário existe",
            error: error
        }
    }

    return {
        success: true,
        message: "Sessão Iniciada!"
    }
}