import { supabase } from "../services/supabase";

type getDataInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}

export async function getData(
  tableName: string,
  filters: Record<string, string | number | null>,
  operation: string
):Promise<getDataInterface> {
  let query = supabase.from(tableName).select("*");

  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, error } = await query;

  if (error) {
    return {success: false, message: `Error on getting operation: ${operation}`, error: error};
  }
  
  return {success: true, data: data, message: `Data has been found correctly`, error: error};
}