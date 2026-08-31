import { supabase } from "../services/supabase"

type InsertUserResult = {
    success: boolean;
    message: string;
    name?: string;
    email?: string;
    error?: any;
}

export const insertUser = async (name:string, email: string, password:string): Promise<InsertUserResult> => {
    
    const { data, error } = await supabase.auth.signUp({
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
            message: "Erro ao cadastrar email", 
            error: error
        } 
    }

    return {
        success: true, 
        message: "Usuário cadastrado com sucesso!"
    }  
}