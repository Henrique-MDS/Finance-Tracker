import { supabase } from "@/services/supabase";

type getDataInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}


export const getReportData = async (userId:string, iniDate:string, finalDate:string, type:string | null):Promise<getDataInterface> => {
    
    const { data, error } = await supabase.rpc(
        "get_report_data",
        {
            p_user_id: userId,
            p_ini_date: iniDate,
            p_final_date: finalDate,
            p_type: type
        }
    );

    if (error) {
        return {success: false, message: "Error on getting report data", error: error};
    }
    
    return {success: true, data: data, message: `Data has been found correctly`, error: error};
}