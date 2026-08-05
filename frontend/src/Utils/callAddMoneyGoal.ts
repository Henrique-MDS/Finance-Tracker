import { supabase } from "@/services/supabase";
import type { DataResponse } from "@/types/generalTypes";

export const addMoneyToGoal = async (userId:string, goalId:string, value: number):Promise<DataResponse> => {
    const { data, error } = await supabase.rpc(
        "add_money_to_goal",
        {
            p_goal_id: goalId,
            p_user_id: userId,
            p_value: value
        }
    );

    if (error) {
        return {
            success: false, 
            message: "Error on updating goal value", 
            error: error
        };
    }
    
    return {
        success: true, 
        data: data, 
        message: "Your goal was updated correctly", 
        error: error
    };
}