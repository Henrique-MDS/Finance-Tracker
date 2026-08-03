import { supabase } from "../services/supabase";

type insertDataInterface = {
  success: boolean;
  message: string;
  data?: any[];
  name?: string;
  email?: string;
  error?: any;
}

type GenericObject = {
  [key: string]: any;
};

export async function insertData(tableName:string, fields:GenericObject, operation:string):Promise<insertDataInterface> {
  let query = supabase.from(tableName).insert(fields);

  const { error } = await query;

  if (error) {
    return {
      success: false, 
      message: `Error operation: ${operation}`, 
      error: error
    };
  }

  return {
    success: true, 
    message: `Data has been inserted correctly`, 
    error: error
  };
}