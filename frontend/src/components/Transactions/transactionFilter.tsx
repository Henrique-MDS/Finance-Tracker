import { useLanguage } from "@/i18n/LanguageContext";
import { getDateLocale, translateCategory } from "@/i18n/i18n";
import { BrushCleaning, CalendarIcon, Funnel, X } from "lucide-react";
import SelectInput from "../Inputs/Select_Input";
import { useEffect, useState } from "react";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";
import { getData } from "@/Utils/getData";
import type { FilterTransactions } from "@/types/generalTypes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { notify } from "@/Utils/notify";

interface SelectOption {
    label: string;
    value: string;
}

interface Props {
    onFilter: (filters: FilterTransactions) => Promise<void>;
}

export function TransactionFilter({ onFilter }: Props) {

    const [catOptions, setCatOptions] = useState<SelectOption[]>([]);
    
    const { user, loading } = useAuth();
    const { t } = useLanguage();

    // filtros das trasações
    const [iniDate, setIniDate] = useState<Date>();
    const [finalDate, setFinalDate] = useState<Date>();
    const [categoryId, setCategoryId] = useState("");
    const [tranType, setTranType] = useState("");
    
    if (loading) {
        return <div>{t("common.loading")}</div>;
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    const getCategories = async () => {
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

        options.unshift({
            label: t("common.all"),
            value: "T",
        })

        setCatOptions(options);
    };

    const toUtcMidnightISOString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}T00:00:00.000Z`;
    }

    const callExecuteFilter = async () => {

        if(iniDate && finalDate){
            if(iniDate > finalDate){
                notify.error(t("transactions.dateRangeError"));
                return;
            }
        }

        const filters = {
            user_id: user.id,
            type: tranType === "T" ? null : tranType || null,
            iniDate: iniDate ? toUtcMidnightISOString(iniDate) : null,
            finalDate: finalDate ? toUtcMidnightISOString(finalDate) : null,
            catId: categoryId === "T" ? null : categoryId || null
        }

        await onFilter(filters);
    }

    const cleanFilter = () => {
        setIniDate(undefined);
        setFinalDate(undefined);
        setTranType("");
        setCategoryId("");
    }

    useEffect(() => {
        getCategories();
    }, [user.id])

  return (
    <div className="bg-dark-padrao p-5 rounded-xl text-foreground gap-5 flex flex-col">
        <div>
          <p className="flex gap-2 items-center"> 
            <span className="bg-green-padrao p-2 rounded-full">
              <Funnel />
            </span> 
            {t("transactions.filterTitle")}
          </p>
        </div>
        <div className="bg-subdiv2-padrao p-8 rounded-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SelectInput 
                    label={t("common.type")} 
                    placeholder={t("common.type")} 
                    options={[
                        { label: t("common.all"), value: "T" },
                        { label: t("type.Receita"), value: "Receita" }, 
                        { label: t("type.Despesa"), value: "Despesa" }
                    ]}
                    onValueChange={(e) => setTranType(e)} 
                    value={tranType}
                />
                <SelectInput 
                    label={t("common.category")} 
                    placeholder={t("common.category")}
                    options={catOptions} 
                    onValueChange={(e) => setCategoryId(e)} 
                    value={categoryId}
                />
                <div>
                    <p>{t("common.initialDate")}</p>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                data-empty={!iniDate}
                                className="w-full p-5 justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-subdiv2-padrao border-border"
                            >   
                                <div className="flex items-center gap-2">
                                    <CalendarIcon />
                                    {iniDate ? format(iniDate, "PPP", { locale: getDateLocale() }) : <span>{t("common.selectDate")}</span>}
                                </div>
                                <div className="cursor-pointer" onClick={() => setIniDate(undefined)}>
                                    <X />
                                </div>                              
                            </Button>                            
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={iniDate} onSelect={setIniDate}/>
                        </PopoverContent>                        
                    </Popover>
                </div>
                <div>
                    <p>{t("common.finalDate")}</p>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            data-empty={!finalDate}
                            className="w-full p-5 justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-subdiv2-padrao border-border"
                        >
                            <div className="flex items-center gap-2">
                                <CalendarIcon />
                                {finalDate ? format(finalDate, "PPP", { locale: getDateLocale() }) : <span>{t("common.selectDate")}</span>}
                            </div>
                            <div className="cursor-pointer" onClick={() => setFinalDate(undefined)}>
                                <X />
                            </div> 
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={finalDate} onSelect={setFinalDate}/>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <Button 
                className="cursor-pointer bg-green-padrao"
                onClick={() => callExecuteFilter()}
            >
                {t("transactions.filterButton")}
            </Button>
            <Button 
                className="cursor-pointer bg-blue-padrao"
                onClick={() => cleanFilter()}
            >
                <BrushCleaning />
                {t("transactions.clearFilter")}
            </Button>
        </div>
    </div>
  );
}

export default TransactionFilter;