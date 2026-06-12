import { supabase } from "../services/supabase"

type InsertUserResult = {
    success: boolean;
    message: string;
    name?: string;
    email?: string;
    error?: any;
}

export const insertUser = async (name:string, email: string, password:string): Promise<InsertUserResult> => {
    
    const { data: user, error: errorUser } = await supabase
    .from("Users")
    .select("*")
    .eq("email", email)
    .single();

    if(!user){
        const {data, error} = await supabase.from("Users").insert({
            name: name,
            email: email,
            password: password
        })

        if(error){
            if(error.code == "23505"){
                return {success: false, message: "Alguém já está utilizando este nome"}
            }
        }
        return {success: true, message: "Email cadastrado com sucesso", name: name, email: email}
    }
    return {success: false, message: "Email já está cadastrado", error: errorUser}  
}