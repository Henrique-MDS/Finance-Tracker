import { supabase } from "../services/supabase"

type LogInUserResult = {
    success: boolean;
    message: string;
    name?: string;
    email?: string;
    error?: any;
}

export const getUserLogin = async (name:string, password:string): Promise<LogInUserResult> => {
    
    const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("name", name)
    .eq("password", password)
    .single();
    
    if(data){
        localStorage.setItem("userId", data.id);
        return {
            success: true,
            message: "Sessão iniciada!"
        }
    } else {
        return {
            success: false,
            message: "Falha no Login, verifique se o usuário existe",
            error: error
        }
    }
    console.log(data, error);
}