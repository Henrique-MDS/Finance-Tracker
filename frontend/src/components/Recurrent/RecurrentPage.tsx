import { Button } from "../ui/button";
import RecurrentCard from "./RecurrentCard/RecurrentCard";
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, ChevronDown, ListFilter } from "lucide-react";
import RecurrentGrid from "./RecurrentComponents/RecurrentGrid";
import { Input } from "../ui/input";
import SelectInput from "../Inputs/Select_Input";
import { getData } from "@/Utils/getData";
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

interface SelectOption {
    label: string;
    value: string;
}


export function RecurrentPage() {

    const [categoryId, setCategoryId] = useState("");
    const [catOptions, setCatOptions] = useState<SelectOption[]>([]);
    const { user, loading } = useAuth();
    const [freq, setFreq] = useState("");
    const [day, setDay] = useState("");
    const frequencyOptions = [
        {label: "Diária", value: "Diaria"},
        {label: "Semanal", value: "Semanal"},
        {label: "Mensal", value: "Mensal"},
        {label: "Anual", value: "Anual"}
    ]
    const [iniDate, setIniDate] = React.useState<Date>();
    const [finalDate, setFinalDate] = React.useState<Date>();
    console.log(freq);
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
    <div className="flex flex-col gap-5">
        <div>
            <h1 className="text-2xl text-white">Transações Recorrentes</h1>
            <p>Gerencie suas despesas e receitas que repetem automaticamente</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap w-full">
            <RecurrentCard
                title="Receitas Recorrentes" 
                desc="R$ 3283" 
                info="2 Recorrencias"
                color="bg-green-padrao"
                icon={ArrowDownIcon}
            />
            <RecurrentCard
                title="Receitas Recorrentes" 
                desc="R$ 3283" 
                info="2 Recorrencias"
                color="bg-green-padrao"
                icon={ArrowDownIcon}
            />
            <RecurrentCard
                title="Receitas Recorrentes" 
                desc="R$ 3283" 
                info="2 Recorrencias"
                color="bg-green-padrao"
                icon={ArrowDownIcon}
            />
            <RecurrentCard
                title="Receitas Recorrentes" 
                desc="R$ 3283" 
                info="2 Recorrencias"
                color="bg-green-padrao"
                icon={ArrowDownIcon}
            />
        </div>
        <div className="flex gap-5">
            <div className="w-[70%] flex flex-col gap-5 p-3 rounded-xl" style={{border: "1px solid #111820"}}>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Suas transações recentes</h2>
                    <div className="flex gap-3">
                        <Button className="p-5 bg-transparent cursor-pointer" style={{border: "1px solid #111820"}}>
                            Todos Status
                            <ChevronDown />
                        </Button>
                        <Button className="p-5 bg-transparent cursor-pointer" style={{border: "1px solid #111820"}}>
                            Filtros
                            <ListFilter />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-6 bg-subdiv-padrao p-3 rounded-sm">
                        <p>Descrição</p>
                        <p>Categoria</p>
                        <p>Valor</p>
                        <p>Frequência</p>
                        <p>Próxima execução</p>
                        <p>Status</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <RecurrentGrid />
                        <RecurrentGrid />
                        <RecurrentGrid />
                    </div>
                </div>
            </div>
            <div className="w-[30%] flex flex-col gap-5 p-3 rounded-xl" style={{border: "1px solid #111820"}}>
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-white">Nova transação recorrente</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <p>Descrição</p>
                            <Input  className="p-5" style={{border: "1px solid #1e2939"}}/>
                        </div>
                        <div className="flex flex-col gap-3">
                            <SelectInput 
                                label="Categoria" 
                                placeholder="Categoria" 
                                options={catOptions} 
                                onValueChange={(e) => setCategoryId(e)} value={categoryId}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <ToggleGroup type="single" variant="outline" defaultValue="all" className="w-full">
                                <ToggleGroupItem 
                                    value="all" 
                                    aria-label="Toggle all" 
                                    className="w-[50%] p-5 cursor-pointer"                                
                                >
                                    <ArrowUpIcon color="#2CAE60"/>
                                    Receita
                                </ToggleGroupItem>
                                <ToggleGroupItem 
                                    value="missed" 
                                    aria-label="Toggle missed" 
                                    className="w-[50%] p-5 cursor-pointer"
                                >
                                    <ArrowDownIcon color="#EF4444"/>
                                    Despesa
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <div>
                            <p>Valor</p>
                            <Input 
                                type="number" 
                                className="p-5" 
                                style={{border: "1px solid #1e2939"}}
                            />
                        </div>
                        <div>
                            <SelectInput 
                                label="Frequência" 
                                placeholder="Frequência" 
                                options={frequencyOptions} 
                                onValueChange={(e) => setFreq(e)} value={categoryId}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Dia da execução</p>
                            <div className="flex gap-3">
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
                                    placeholder="1 a 31"
                                    className="p-5 w-[50%]"
                                    style={{ border: "1px solid #1e2939" }}
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!iniDate}
                                        className="w-[50%] p-5 justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-main-bg border-white"
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
                            <div className="flex flex-col gap-3">
                                <p>Data Final (Opcional)</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!finalDate}
                                        className="w-full p-5 justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-main-bg border-white"
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
                            <div className="flex items-center gap-3">
                                <Button className="bg-red-padrao cursor-pointer p-5 w-[50%]">
                                    Limpar
                                </Button>
                                <Button className="bg-green-padrao cursor-pointer p-5 w-[50%]">
                                    Salvar Recorrente
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