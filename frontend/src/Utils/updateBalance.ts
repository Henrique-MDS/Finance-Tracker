import { supabase } from "../services/supabase";
import { getData } from "./getData";
import { notify } from "./notify";

type updateBalance = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}


export async function updateBalance(userId:string | null, value:number, type:string) {
 
    if(userId !== null){
        const getNowBalance = async () => {
            const balance = await getData(
                "Balance",
                {"user_id": userId},
                "Buscar valor total da balança"
            );
            
            if(balance.success){
                if(balance.data?.length == 0){
                    return {success: true}; // não possui dados, logo necessita insert
                } else {
                    return {success: false, balanceData: balance.data}; // já possui dados não deve realizar insert
                }
            } else {
                notify.error("Erro ao buscar montante total");
            }
        }

        const response = await getNowBalance();

        if(response?.success){
            const nowBalance = calculateBalance(type, 0, value);
            const {error} = await supabase.from("Balance").insert({
                user_id: userId,
                balance_now: nowBalance
            })

            if(error){
                return {success: false, message: "Erro ao inserir balança", error: error}
            }
        } else {
            const nowBalance = calculateBalance(type, response?.balanceData?.[0]?.balance_now ?? 0, value);
            const { data, error } = await supabase
            .from("Balance")
            .update({
                balance_now: nowBalance
            })
            .eq("user_id", userId);

            if(error){
                return {success: false, message: "Erro ao inserir balança", error: error}
            } else {
                return {success: true, message: "Balança atualizada", data: data, error: error}
            }
        }
    }
    
}

const calculateBalance = (operation:string, nowBalanceValue:number, value:number) => {
    if(operation == "Receita"){
        return nowBalanceValue += value;
    } else {
        return nowBalanceValue -= value;
    }
}