import { supabase } from "../services/supabase";

type getIntervalDataInterface = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}

type FilterValue = string | number | null | Date;

export async function getIntervalData(
  tableName: string,
  fieldName:string,
  value1: FilterValue,
  value2: FilterValue,
  operation: string
):Promise<getIntervalDataInterface> {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .gte(fieldName, value1)
    .lte(fieldName, value2);

  if (error) {
    return {success: false, message: `Error on getting operation: ${operation}`, error: error};
  }
  
  return {success: true, data: data, message: `Data has been found correctly`, error: error};
}