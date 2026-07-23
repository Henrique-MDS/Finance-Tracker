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
        password
    });

    if(error){
        return {success: false, message: "Email já está cadastrado", error: error} 
    }

    await supabase.from("Users").insert({
        auth_user_id: data.user!.id,
        name,
        email
    });
    
    return {success: true, message: "Usuário cadastrado com sucesso!"}  
}