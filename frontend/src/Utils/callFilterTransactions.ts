import { supabase } from "@/services/supabase";
import type { DataResponse, FilterTransactions } from "@/types/generalTypes";


export const filterTransactions = async ({user_id, type, iniDate, finalDate, catId}: FilterTransactions):Promise<DataResponse> => {
    console.log(user_id, type, iniDate, finalDate, catId);
    const { data, error } = await supabase.rpc(
        "filter_transaction",
        {
            p_user_id: user_id,
            p_tran_type: type,
            p_category_id: catId,
            p_ini_date: iniDate,
            p_final_date: finalDate
        }
    );

    if (error) {
        return {
            success: false, 
            message: "Error on Filter Transactions", 
            error: error
        };
    }
    
    return {
        success: true, 
        data: data, 
        message: "Data has been filtered correctly", 
        error: error
    };
}