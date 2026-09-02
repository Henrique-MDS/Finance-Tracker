import { supabase } from "@/services/supabase";

type getDataInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}


export const getRecurrentResume = async (userId:string):Promise<getDataInterface> => {
    
    const { data, error } = await supabase.rpc(
        "get_recurrent_resume",
        {
            p_user_id: userId,
        }
    );

    if (error) {
        return {success: false, message: "Error on getting resume", error: error};
    }
    
    return {success: true, data: data, message: `Data has been found correctly`, error: error};
}