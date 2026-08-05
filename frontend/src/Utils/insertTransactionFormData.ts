import { supabase } from "../services/supabase";

type InsertTransactionResult = {
    success: boolean;
    message: string;
    dados?: any;
    error?: any;
}

type TransactionFormData = {
    user_id: string | null,
    cat_id: string,
    value: string,
    type: string,
    desc: string,
    tran_date: string | undefined
}

export async function insertTransactionFormData(sentData:TransactionFormData):Promise<InsertTransactionResult> {
    
    const {data, error} = await supabase.from("Transactions").insert({
        user_id: sentData.user_id,
        cat_id: sentData.cat_id,
        value: sentData.value,
        type: sentData.type,
        desc: sentData.desc,
        tran_date: sentData.tran_date
    })

    if(error){
        return {success: false, message: "Erro ao cadastrar Transação", error: error}
    }
    return {success: true, message: "Transação cadastrada", dados: data}
}