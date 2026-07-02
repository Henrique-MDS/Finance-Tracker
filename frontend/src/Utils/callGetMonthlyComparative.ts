import { supabase } from "@/services/supabase";

type getMonthlyComparativeInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}


export const getMonthlyComparativeBalance = async (userId:string):Promise<getMonthlyComparativeInterface> => {
    const { data, error } = await supabase.rpc(
        "get_monthly_comparative_balance",
        {
            p_user_id: userId
        }
    );

    if (error) {
        return {success: false, message: "Error on getting month total value", error: error};
    }
    
    return {success: true, data: data, message: `Data has been found correctly`, error: error};
}