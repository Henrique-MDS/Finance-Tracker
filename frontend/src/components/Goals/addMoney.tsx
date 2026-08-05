import { useState } from "react";
import NewGoalInput from "../Inputs/newGoalInput";
import { Button } from "../ui/button";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";
import type { Goal } from "@/types/generalTypes";
import { notify } from "@/Utils/notify";
import { addMoneyToGoal } from "@/Utils/callAddMoneyGoal";
import { ShieldAlert } from "lucide-react";

interface NewGoalModalProps {
    goal: Goal;
    refreshGoals: () => Promise<void>;
}

export function AddMoneyModal({ goal, refreshGoals }: NewGoalModalProps) {

    const { user, loading } = useAuth();
    const [value, setValue] = useState("");

    if (loading) {
        return <div>Carregando...</div>;
    }
    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    const addGoalMoney = async () => {
        const FieldError = verifyValue();

        if (FieldError) {
            notify.error(FieldError);
            return;
        }

       const response = await addMoneyToGoal(user.id, goal.id, Number(value));

        if(!response.success){
            notify.error("Erro ao adicionar valor a meta");
            return;
        }

        notify.success("Quantia adicionada");
        setValue("");
        await refreshGoals();
    }

    const verifyValue = () => {
        const MoneyValue = Number(value);

        if (!MoneyValue)
            return "Informe um valor.";

        if (isNaN(MoneyValue))
            return "Informe um valor válido.";

        if (MoneyValue <= 0)
            return "O valor deve ser maior que zero.";
    }

    return (
        <div className="h-full flex flex-col gap-5">
            <div className="flex flex-col gap-5">
                <NewGoalInput 
                    title="Quantia" 
                    placeholder="R$ 0,00" 
                    desc="Adicione uma quantia para sua meta"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)} 
                />
                <Button 
                    className="p-5 bg-green-padrao hover:bg-green-padrao-25 cursor-pointer"
                    onClick={() => addGoalMoney()}
                >
                    Adicionar
                </Button>
            </div>
            <div className="flex items-center gap-3 text-text-padrao">
                <ShieldAlert />
                <p>Ao adicionar dinheiro em uma meta, uma transação automática será gerada</p>
            </div>
        </div>
    );
}

export default AddMoneyModal;