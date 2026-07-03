import { supabase } from "@/services/supabase";

type getMonthlyComparativeRDInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}


export const getMonthlyComparativeReceitaDespesa = async (userId:string, type:string):Promise<getMonthlyComparativeRDInterface> => {
    const { data, error } = await supabase.rpc(
        "get_monthly_comparative_receita_despesa",
        {
            p_user_id: userId,
            p_type: type
        }
    );

    if (error) {
        return {success: false, message: "Error on getting month total value", error: error};
    }
    
    return {success: true, data: data, message: `Data has been found correctly`, error: error};
}