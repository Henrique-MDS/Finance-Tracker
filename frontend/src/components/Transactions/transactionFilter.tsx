import { CalendarIcon, Funnel } from "lucide-react";
import SelectInput from "../Inputs/Select_Input";
import { useEffect, useState } from "react";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";
import { getData } from "@/Utils/getData";
import type { Category } from "@/types/generalTypes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface SelectOption {
    label: string;
    value: string;
}

export function TransactionFilter() {

    const [catOptions, setCatOptions] = useState<SelectOption[]>([]);
    const [iniDate, setIniDate] = useState<Date>();
    const [finalDate, setFinalDate] = useState<Date>();
    const { user, loading } = useAuth();
    const [categoryId, setCategoryId] = useState("");
    
    if (loading) {
        return <div>Carregando...</div>;
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
            label: c.name,
            value: c.id,
        }));
        setCatOptions(options);
    };

    useEffect(() => {
        getCategories();
    }, [user.id])

  return (
    <div className="bg-dark-padrao p-5 rounded-xl text-white gap-5 flex flex-col">
        <div>
          <p className="flex gap-2 items-center"> 
            <span className="bg-green-padrao p-2 rounded-full">
              <Funnel />
            </span> 
            Filtrar Transações
          </p>
        </div>
        <div className="bg-subdiv2-padrao p-8 rounded-xl">
            <div className="grid grid-cols-2 gap-5">
                <SelectInput 
                    label="Tipo" 
                    placeholder="Tipo" 
                    options={[{ label: "Receita", value: "Receita" }, { label: "Despesa", value: "Despesa" }]}
                />
                <SelectInput 
                    label="Categoria" 
                    placeholder="Categoria"
                    options={catOptions} 
                    onValueChange={(e) => setCategoryId(e)} value={categoryId}
                />
                <div>
                    <p>Data Inicial</p>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            data-empty={!iniDate}
                            className="w-full p-5 justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-subdiv2-padrao border-white"
                            style={{border: "1px solid #1e2939"}}
                        >
                            <CalendarIcon />
                            {iniDate ? format(iniDate, "PPP") : <span>Selecione a data</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={iniDate} onSelect={setIniDate}/>
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <p>Data Final</p>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            data-empty={!finalDate}
                            className="w-full p-5 justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-subdiv2-padrao border-white"
                            style={{border: "1px solid #1e2939"}}
                        >
                            <CalendarIcon />
                            {finalDate ? format(finalDate, "PPP") : <span>Selecione a data</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={finalDate} onSelect={setFinalDate}/>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
        <div>
            <Button className="cursor-pointer bg-green-padrao">
                Filtrar
            </Button>
        </div>
    </div>
  );
}

export default TransactionFilter;