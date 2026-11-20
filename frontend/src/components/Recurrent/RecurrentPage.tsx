import { useLanguage } from "@/i18n/LanguageContext";
import { getDateLocale, translateCategory } from "@/i18n/i18n";
import { Button } from "../ui/button";
import RecurrentCard from "./RecurrentCard/RecurrentCard";
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, CircleCheck, RefreshCcw, Sparkle, Wallet } from "lucide-react";
import RecurrentGrid from "./RecurrentComponents/RecurrentGrid";
import { Input } from "../ui/input";
import SelectInput from "../Inputs/Select_Input";
import { getData } from "@/Utils/getData";
import { insertData } from "@/Utils/insertData";
import { buildExecutionTime } from "@/Utils/buildExecutionTime";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/Utils/AuthContext";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns";
import { notify } from "@/Utils/notify";
import type { RecurrentTable } from "@/types/generalTypes";
import { getRecurrentResume } from "@/Utils/callGetRecurrentResume";
import { formatCurrencyBR } from "@/Utils/formateToBr";

interface SelectOption {
    label: string;
    value: string;
}

interface VerifyData {
    error: boolean;
    message: string;
}

interface GetRecurrentResume {
    executed_this_month: number;
    total_active: number;
    total_value_executed_this_month: number;
    value_to_be_executed_next_30_days: number;
}

export function RecurrentPage() {

    const [categoryId, setCategoryId] = useState("");
    const [catOptions, setCatOptions] = useState<SelectOption[]>([]);
    const { user, loading } = useAuth();
    const { t } = useLanguage();
    const [freq, setFreq] = useState("");
    const [day, setDay] = useState("");
    const [iniDate, setIniDate] = React.useState<Date>();
    const [finalDate, setFinalDate] = React.useState<Date>();
    const [desc, setDesc] = useState("");
    const [type, setType] = useState("");
    const [recurrentValue, setRecurrentValue] = useState("");
    const [recurrent, setRecurrent] = useState<RecurrentTable[]>([]);
    const [recurrentResume, setRecurrentResume] = useState<GetRecurrentResume>({
        executed_this_month: 0,
        total_active: 0,
        total_value_executed_this_month: 0,
        value_to_be_executed_next_30_days: 0
    });
    const frequencyOptions = [
        {label: t("freq.Diaria"), value: "Diaria"},
        {label: t("freq.Semanal"), value: "Semanal"},
        {label: t("freq.Mensal"), value: "Mensal"},
        {label: t("freq.Anual"), value: "Anual"}
    ]

    const getCategories = async () => {
        if (!user) return;
        const categories = await getData(
            "Categories",
            { user_id: user.id },
            "Buscar todas as categorias"
        );
        const safeCategories = Array.isArray(categories.data) ? categories.data : [];

        const options = safeCategories.map((c) => ({
            label: translateCategory(c.name),
            value: c.id,
        }));
        setCatOptions(options);
    };

    const clearForm = () => {
        setDesc("");
        setDay("");
        setCategoryId("");
        setType("");
        setRecurrentValue("");
        setFreq("");
        setIniDate(undefined);
        setFinalDate(undefined);
    }

    const requiresDay = freq === "Mensal" || freq === "Anual";

    const verifyFormData = (): VerifyData => {
        const fields: [string, unknown][] = [
            [t("common.description"), desc],
            [t("common.category"), categoryId],
            [t("recurrent.typeField"), type],
            [t("common.value"), recurrentValue],
            [t("common.frequency"), freq],
            [t("recurrent.startDate"), iniDate],
        ];

        for (const [field, val] of fields) {
            if (!val) {
                return {
                    error: true,
                    message: t("recurrent.emptyField", { field }),
                };
            }
        }

        const numericValue = Number(recurrentValue);

        if (isNaN(numericValue) || numericValue <= 0) {
            return {
                error: true,
                message: t("common.valueGreaterThanZero"),
            };
        }

        if (requiresDay) {
            const executionDay = Number(day);

            if (
                !day ||
                !Number.isInteger(executionDay) ||
                executionDay < 1 ||
                executionDay > 31
            ) {
                return {
                    error: true,
                    message: t("recurrent.dayRange"),
                };
            }
        }

        if (finalDate && iniDate && finalDate < iniDate) {
            return {
                error: true,
                message: t("recurrent.dateOrder"),
            };
        }

        return {
            error: false,
            message: "",
        };
    };

    const insertRecurrentData = async () => {
        if (!user) return;
        const verify = verifyFormData();
        if (verify.error) {
            notify.error(verify.message);
            return;
        }

        const executionTime = buildExecutionTime(freq, day, iniDate as Date);

        const result = await insertData(
            "Recurrent",
            {
                user_id: user.id,
                desc: desc,
                category_id: categoryId,
                value: Number(recurrentValue),
                type: type,
                frequency: freq,
                execution_time: executionTime.toISOString(),
                next_execution: executionTime.toISOString(),
                end_date: finalDate ? finalDate.toISOString() : null,
            },
            "Cadastrar transação recorrente"
        );

        if (!result.success) {
            notify.error(t("recurrent.saveError"));
            return;
        }

        notify.success(t("recurrent.saved"));
        await getRecurrent();
        await callGetRecurrentResume();
        clearForm();
    }

    const getRecurrent = async () => {
        if (!user) return;
        const response = await getData("Recurrent", {user_id: user.id}, "buscar dados de recorrencias do usuário");
        if(response.success){
            setRecurrent(response.data ?? []);
        } else {
            notify.error(t("recurrent.fetchError"));
            return;
        }

    }

    const callGetRecurrentResume = async () => {
        if (!user) return;
        const response = await getRecurrentResume(user.id);
        
        if(response.success){
            if(response.data && response.data.length > 0){
                setRecurrentResume(response.data[0]);
            }
        } else {
            notify.error(t("recurrent.resumeError"));
            return;
        }
    }

    useEffect(() => {
        callGetRecurrentResume();
        getRecurrent();
        getCategories();
    }, [user?.id])

    if (loading) {
        return <div>{t("common.loading")}</div>;
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

  return (
    <div className="flex flex-col gap-5 lg:h-full">
        <div>
            <h1 className="text-2xl text-foreground">{t("recurrent.title")}</h1>
            <p>{t("recurrent.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 w-full">
            <RecurrentCard
                title={t("recurrent.active")} 
                desc={recurrentResume.total_active} 
                info={t("recurrent.recurringTransactions")}
                color="bg-green-padrao"
                icon={RefreshCcw}
            />
            <RecurrentCard
                title={t("recurrent.next30")} 
                desc={formatCurrencyBR(recurrentResume.value_to_be_executed_next_30_days)} 
                info={t("recurrent.expectedTotal")}
                color="bg-blue-padrao"
                icon={CalendarIcon}
            />
            <RecurrentCard
                title={t("recurrent.thisMonth")} 
                desc={formatCurrencyBR(recurrentResume.total_value_executed_this_month)}
                info={t("recurrent.executedTotal")}
                color="bg-salmon-padrao"
                icon={Wallet}
            />
            <RecurrentCard
                title={t("recurrent.executedThisMonth")} 
                desc={recurrentResume.executed_this_month}
                info={t("recurrent.transactions")}
                color="bg-purple-padrao"
                icon={CircleCheck}
            />
        </div>
        <div className="flex flex-col lg:flex-row gap-5 lg:flex-1 lg:min-h-0">
            <div className="w-full lg:w-[70%] h-130 lg:h-full flex flex-col gap-5 p-3 rounded-xl" style={{border: "1px solid var(--border)"}}>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">{t("recurrent.yours")}</h2>
                </div>
                <div className="flex flex-col gap-3 flex-1 min-h-0">
                    <div className="hidden md:grid gap-2 items-center grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)_44px] bg-subdiv-padrao p-3 rounded-sm">
                        <p>{t("common.description")}</p>
                        <p>{t("common.category")}</p>
                        <p>{t("common.value")}</p>
                        <p>{t("common.frequency")}</p>
                        <p>{t("recurrent.nextExecution")}</p>
                        <p>{t("common.status")}</p>
                        <p className="text-right"></p>
                    </div>
                    <div className="flex flex-col gap-3 scrollbar-hide overflow-y-auto flex-1 min-h-0">
                        { recurrent && recurrent.length > 0 ? recurrent.map((recurrent) => (
                            <RecurrentGrid 
                                recurrentData={recurrent} 
                                onRefresh={getRecurrent} 
                                onRefreshRecurrentResume={callGetRecurrentResume}
                                key={recurrent.id}
                            />
                        )) : 
                            <div className="w-full flex items-center justify-center gap-3">
                                {t("recurrent.empty")}
                                <Sparkle size={15}/>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-[30%] h-auto lg:h-full flex flex-col gap-5 p-3 rounded-xl overflow-y-auto scrollbar-hide" style={{border: "1px solid var(--border)"}}>
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-foreground">{t("recurrent.new")}</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <p>{t("common.description")}</p>
                            <Input  
                                className="p-5" 
                                style={{border: "1px solid var(--border)"}}
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <SelectInput 
                                label={t("common.category")} 
                                placeholder={t("common.category")} 
                                options={catOptions} 
                                onValueChange={(e) => setCategoryId(e)} value={categoryId}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <ToggleGroup
                                type="single"
                                variant="outline"
                                value={type}
                                className="w-full"
                                onValueChange={(value) => setType(value)}
                            >
                                <ToggleGroupItem 
                                    value="Receita" 
                                    aria-label="Toggle all" 
                                    className="w-[50%] p-5 cursor-pointer"                                
                                >
                                    <ArrowUpIcon color="#2CAE60"/>
                                    {t("type.Receita")}
                                </ToggleGroupItem>
                                <ToggleGroupItem 
                                    value="Despesa" 
                                    aria-label="Toggle missed" 
                                    className="w-[50%] p-5 cursor-pointer"
                                >
                                    <ArrowDownIcon color="#EF4444"/>
                                    {t("type.Despesa")}
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <div>
                            <p>{t("common.value")}</p>
                            <Input 
                                type="number" 
                                className="p-5" 
                                style={{border: "1px solid var(--border)"}}
                                value={recurrentValue}
                                onChange={(e) => setRecurrentValue(e.target.value)}
                            />
                        </div>
                        <div>
                            <SelectInput 
                                label={t("common.frequency")} 
                                placeholder={t("common.frequency")} 
                                options={frequencyOptions} 
                                onValueChange={(e) => setFreq(e)} value={freq}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            {requiresDay && <p>{t("recurrent.executionDay")}</p>}
                            <div className="flex gap-3">
                                {requiresDay && (
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={2}
                                        value={day}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!/^\d*$/.test(value)) {
                                                return;
                                            }

                                            if (value === "") {
                                                setDay("");
                                                return;
                                            }

                                            const number = Number(value);

                                            if (number >= 1 && number <= 31) {
                                                setDay(value);
                                            }
                                        }}
                                        placeholder={t("recurrent.dayPlaceholder")}
                                        className="p-5 w-[50%]"
                                        style={{ border: "1px solid var(--border)" }}
                                    />
                                )}
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!iniDate}
                                        className={`${requiresDay ? "w-[50%]" : "w-full"} p-5 justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-main-bg border-border`}
                                        style={{border: "1px solid var(--border)"}}
                                    >
                                        <CalendarIcon />
                                        {iniDate ? format(iniDate, "PPP", { locale: getDateLocale() }) : <span>{t("recurrent.startDate")}</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={iniDate} onSelect={setIniDate}/>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>{t("recurrent.finalDateOptional")}</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!finalDate}
                                        className="w-full p-5 justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-main-bg border-border"
                                        style={{border: "1px solid var(--border)"}}
                                    >
                                        <CalendarIcon />
                                        {finalDate ? format(finalDate, "PPP", { locale: getDateLocale() }) : <span>{t("common.finalDate")}</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={finalDate} onSelect={setFinalDate}/>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button 
                                    className="bg-red-padrao cursor-pointer p-5 w-[50%]"
                                    onClick={() => clearForm()}
                                >
                                    {t("common.clear")}
                                </Button>
                                <Button 
                                    className="bg-green-padrao cursor-pointer p-5 w-[50%]"
                                    onClick={() => insertRecurrentData()}
                                >
                                    {t("recurrent.saveButton")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default RecurrentPage;