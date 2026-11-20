import { translate } from "@/i18n/i18n";
import { supabase } from "@/services/supabase";
import type { DataResponse } from "@/types/generalTypes";
import { notify } from "./notify";

export const logout = async ():Promise<DataResponse> => {
  const { error } = await supabase.auth.signOut();

    if (error) {
        return {
            success: false, 
            message: "Error on getting report data", 
            error: error
        };
    }
    notify.success(translate("auth.logoutSuccess"));
    return {
        success: true, 
        message: "User Logged out"
    };
};