import { supabase } from "@/services/supabase";

type GetTotalByTypeInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}


export const getTotalByType = async (userId:string, type:string, iniDate: string | null, finalDate: string | null):Promise<GetTotalByTypeInterface> => {
    const { data, error } = await supabase.rpc(
        "get_total_by_type",
        {
            p_user_id: userId,
            p_type: type,
            p_ini_date: iniDate,
            p_final_date: finalDate
        }
    );

    if (error) {
        return {success: false, message: "Error on getting month total value", error: error};
    }
    
    return {success: true, data: data, message: `Data has been found correctly`, error: error};
}