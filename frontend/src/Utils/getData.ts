import { supabase } from "../services/supabase";

export async function getData(
  tableName: string,
  filters: Record<string, string | number>,
  operation: string
) {
  let query = supabase.from(tableName).select("*");

  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, error } = await query;

  if (error) {
    console.error(`Error on getting operation: ${operation}`);
    return null;
  }
  
  return data;
}