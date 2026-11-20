import { useLanguage } from "@/i18n/LanguageContext";
import { getDateLocale } from "@/i18n/i18n";
import { CalendarIcon, FileText, Save } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import NewGoalInput from "../Inputs/newGoalInput";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "../ui/button";
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { notify } from "@/Utils/notify";
import { insertData } from "@/Utils/insertData";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";
import { defaultIcons } from "@/Utils/icons";

interface NewGoalModalProps {
    refreshGoals: () => Promise<void>;
}

export function NewGoalModal({ refreshGoals }: NewGoalModalProps) {

    const { user, loading } = useAuth();
    const { t } = useLanguage();
    const [title, setTitle] = useState("");
    const [goalValue, setGoalValue] = useState("");
    const [date, setDate] = React.useState<Date>();
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

    if (loading) {
        return <div>{t("common.loading")}</div>;
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }
    
    const saveNewGoal = async () => {
        const error = validateForm();
        if (error) {
            notify.error(error);
            return;
        }

        const response = await insertData(
            "Goals", 
            {user_id: user.id, title: title, goal_value: goalValue, limit_date: date, icon: selectedIcon}, 
            "Inserir Nova Meta"
        );

        if(!response.success){
            notify.error(t("goals.createError"));
            return;
        }

        notify.success(t("goals.created"));
        await refreshGoals();
        resetFields();
    }
    
    const validateForm = () => {
        const trimmedTitle = title.trim();
        const value = Number(goalValue);

        if (!trimmedTitle)
            return t("goals.enterName");

        if (trimmedTitle.length > 20)
            return t("goals.nameTooLong");

        if (!goalValue)
            return t("goals.enterValue");

        if (isNaN(value))
            return t("common.invalidValue");

        if (value <= 0)
            return t("common.valueGreaterThanZero");

        if (!date)
            return t("goals.selectDate");

        const today = new Date();
        today.setHours(0,0,0,0);

        if (date < today)
            return t("goals.futureDate");

        return null;
    }

    const resetFields = () => {
        setTitle("");
        setGoalValue("");
        setDate(undefined);
    }

    return (
        <div className="h-full flex flex-col gap-5 justify-between overflow-auto scrollbar-hide">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <FileText color="#2CAE60"/>
                    <h2 className="text-[16px]">{t("goals.info")}</h2>
                </div>
                <div className="flex flex-col gap-4">
                    <NewGoalInput 
                        title={t("goals.nameLabel")} 
                        placeholder={t("goals.namePlaceholder")} 
                        desc={t("goals.nameDesc")}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}                        
                    />
                    <NewGoalInput 
                        title={t("goals.valueLabel")} 
                        placeholder={t("goals.amountPlaceholder")} 
                        desc={t("goals.valueDesc")}
                        type="number"
                        value={goalValue}
                        onChange={(e) => setGoalValue(e.target.value)}                        
                    />
                    <div className="flex flex-col gap-2">
                        <p>{t("goals.limitDate")}</p>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    data-empty={!date}
                                    className="w-full justify-start text-left p-5 font-normal data-[empty=true]:text-muted-foreground bg-dark-padrao"
                                >
                                <CalendarIcon />
                                {date ? format(date, "PPP", { locale: getDateLocale() }) : <span>{t("common.selectDate")}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate}/>
                            </PopoverContent>
                        </Popover>
                    </div>         
                </div>
                <div className="flex flex-col gap-3">
                    <p className="text-text-padrao">{t("goals.selectIcon")}</p>
                    <div className="grid sm:grid-cols-3 lg:grid-cols-8 gap-3">
                        {defaultIcons.map(({ name, icon: Icon }) => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => setSelectedIcon(name)}
                                className={`flex items-center justify-center rounded-lg border p-3 cursor-pointer
                            ${
                                selectedIcon === name
                                ? "border-blue-500"
                                : "border-gray-300"
                            }`}
                            >
                            <Icon size={24} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Separator/>
                <Button 
                    className="bg-green-padrao hover:bg-green-padrao-25 p-5 flex items-center gap-4 cursor-pointer"
                    onClick={() => saveNewGoal()}
                >
                    <Save />
                    {t("common.save")}
                </Button>
            </div>
        </div>
    );
}

export default NewGoalModal;