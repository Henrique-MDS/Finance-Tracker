import { supabase } from "@/services/supabase";

type getDataInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}


export const getMonthTransactionsValue = async (userId:string):Promise<getDataInterface> => {
    const now = new Date();

    const firstDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const firstDayNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
    );
    
    const { data, error } = await supabase.rpc(
        "get_month_balance",
        {
            p_user_id: userId,
            p_start_date: firstDay.toISOString(),
            p_end_date: firstDayNextMonth.toISOString(),
        }
    );

    if (error) {
        return {success: false, message: "Error on getting month total value", error: error};
    }
    
    return {success: true, data: data, message: `Data has been found correctly`, error: error};
}