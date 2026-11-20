import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";
import NewGoalInput from "../Inputs/newGoalInput";
import { Button } from "../ui/button";
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
    const { t } = useLanguage();
    const [value, setValue] = useState("");

    if (loading) {
        return <div>{t("common.loading")}</div>;
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

       const response = await addMoneyToGoal(user.id, goal.id, Number(value), new Date());

        if(!response.success){
            notify.error(t("goals.addMoneyError"));
            return;
        }

        notify.success(t("goals.amountAdded"));
        setValue("");
        await refreshGoals();
    }

    const verifyValue = () => {
        const MoneyValue = Number(value);

        if (!MoneyValue)
            return t("common.enterValue");

        if (isNaN(MoneyValue))
            return t("common.invalidValue");

        if (MoneyValue <= 0)
            return t("common.valueGreaterThanZero");
    }

    return (
        <div className="h-full flex flex-col gap-5">
            <div className="flex flex-col gap-5">
                <NewGoalInput 
                    title={t("goals.amount")} 
                    placeholder={t("goals.amountPlaceholder")} 
                    desc={t("goals.amountDesc")}
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)} 
                />
                <Button 
                    className="p-5 bg-green-padrao hover:bg-green-padrao-25 cursor-pointer"
                    onClick={() => addGoalMoney()}
                >
                    {t("common.add")}
                </Button>
            </div>
            <div className="flex items-center gap-3 text-text-padrao">
                <ShieldAlert />
                <p>{t("goals.autoTransactionHint")}</p>
            </div>
        </div>
    );
}

export default AddMoneyModal;