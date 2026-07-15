import { supabase } from "@/services/supabase";

type getDataInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}


export const getMonthlySummaryByDate = async (userId:string, iniDate:string | null, finalDate:string | null):Promise<getDataInterface> => {
    
    const { data, error } = await supabase.rpc(
        "get_monthly_summary_by_date",
        {
            p_user_id: userId,
            p_ini_date: iniDate,
            p_final_date: finalDate
        }
    );

    if (error) {
        return {success: false, message: "Error on getting month total value", error: error};
    }
    
    return {success: true, data: data, message: `Data has been found correctly`, error: error};
}