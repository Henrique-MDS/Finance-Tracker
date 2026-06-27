import { supabase } from "../services/supabase";

type deleteDataInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}

export async function deleteData(
    tableName: string,
    filters: Record<string, string | number | null>,
    operation: string
):Promise<deleteDataInterface> {
    let query = supabase.from(tableName).delete();

    Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
    });

    const { error } = await query;

    if (error) {
        return {success: false, message: `Error on deleting operation: ${operation}`, error: error};
    }
    
    return {success: true, message: `Data has been deleted correctly`, error: error};
}