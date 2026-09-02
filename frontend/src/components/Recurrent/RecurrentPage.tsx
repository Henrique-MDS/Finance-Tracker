import { Button } from "../ui/button";
import RecurrentCard from "./RecurrentCard/RecurrentCard";
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, ChevronDown, CircleCheck, ListFilter, RefreshCcw, Sparkle, Wallet } from "lucide-react";
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
        {label: "Diária", value: "Diaria"},
        {label: "Semanal", value: "Semanal"},
        {label: "Mensal", value: "Mensal"},
        {label: "Anual", value: "Anual"}
    ]

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
        const fields = {
            "Descrição": desc,
            "Categoria": categoryId,
            "Tipo (Receita/Despesa)": type,
            "Valor": recurrentValue,
            "Frequência": freq,
            "Data de início": iniDate,
            "Data Final": finalDate,
        };

        for (const [key, val] of Object.entries(fields)) {
            if ((!val || val === "") && key !== "Data Final") {
                return {
                    error: true,
                    message: `Campo ${key} não pode ficar vazio`,
                };
            }
        }

        const numericValue = Number(recurrentValue);

        if (isNaN(numericValue) || numericValue <= 0) {
            return {
                error: true,
                message: "O valor deve ser maior que zero",
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
                    message: "O dia de execução deve estar entre 1 e 31",
                };
            }
        }

        if (finalDate && iniDate && finalDate < iniDate) {
            return {
                error: true,
                message: "A data final não pode ser anterior à data de início",
            };
        }

        return {
            error: false,
            message: "",
        };
    };

    const insertRecurrentData = async () => {
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
            notify.error("Erro ao cadastrar transação recorrente");
            return;
        }

        notify.success("Transação recorrente cadastrada");
        await getRecurrent();
        await callGetRecurrentResume();
        clearForm();
    }

    const getRecurrent = async () => {
        const response = await getData("Recurrent", {user_id: user.id}, "buscar dados de recorrencias do usuário");
        if(response.success){
            setRecurrent(response.data ?? []);
        } else {
            notify.error("Erro ao buscar recorrências");
            return;
        }

    }

    const callGetRecurrentResume = async () => {
        const response = await getRecurrentResume(user.id);
        
        if(response.success){
            if(response.data && response.data.length > 0){
                setRecurrentResume(response.data[0]);
            }
        } else {
            notify.error("Erro ao buscar resumo de recorrências");
            return;
        }
    }

    useEffect(() => {
        callGetRecurrentResume();
        getRecurrent();
        getCategories();
    }, [user.id])
    
  return (
    <div className="flex flex-col gap-5 lg:h-full">
        <div>
            <h1 className="text-2xl text-white">Transações Recorrentes</h1>
            <p>Gerencie suas despesas e receitas que repetem automaticamente</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap w-full">
            <RecurrentCard
                title="Ativas" 
                desc={recurrentResume.total_active} 
                info="Transações Recorrentes"
                color="bg-green-padrao"
                icon={RefreshCcw}
            />
            <RecurrentCard
                title="Próximos 30 Dias" 
                desc={formatCurrencyBR(recurrentResume.value_to_be_executed_next_30_days)} 
                info="Total Previsto"
                color="bg-blue-padrao"
                icon={CalendarIcon}
            />
            <RecurrentCard
                title="Este Mês" 
                desc={formatCurrencyBR(recurrentResume.total_value_executed_this_month)}
                info="Total Executado"
                color="bg-salmon-padrao"
                icon={Wallet}
            />
            <RecurrentCard
                title="Executadas este Mês" 
                desc={recurrentResume.executed_this_month}
                info="Transações"
                color="bg-purple-padrao"
                icon={CircleCheck}
            />
        </div>
        <div className="flex flex-col lg:flex-row gap-5 lg:flex-1 lg:min-h-0">
            <div className="w-full lg:w-[70%] h-130 lg:h-full flex flex-col gap-5 p-3 rounded-xl" style={{border: "1px solid #111820"}}>
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
                <div className="flex flex-col gap-3 flex-1 min-h-0">
                    <div className="hidden md:grid gap-2 items-center grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)_44px] bg-subdiv-padrao p-3 rounded-sm">
                        <p>Descrição</p>
                        <p>Categoria</p>
                        <p>Valor</p>
                        <p>Frequência</p>
                        <p>Próxima execução</p>
                        <p>Status</p>
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
                                Cadastre uma transação recorrente para começar!
                                <Sparkle size={15}/>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-[30%] h-auto lg:h-full flex flex-col gap-5 p-3 rounded-xl overflow-y-auto scrollbar-hide" style={{border: "1px solid #111820"}}>
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-white">Nova transação recorrente</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <p>Descrição</p>
                            <Input  
                                className="p-5" 
                                style={{border: "1px solid #1e2939"}}
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
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
                                    Receita
                                </ToggleGroupItem>
                                <ToggleGroupItem 
                                    value="Despesa" 
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
                                value={recurrentValue}
                                onChange={(e) => setRecurrentValue(e.target.value)}
                            />
                        </div>
                        <div>
                            <SelectInput 
                                label="Frequência" 
                                placeholder="Frequência" 
                                options={frequencyOptions} 
                                onValueChange={(e) => setFreq(e)} value={freq}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            {requiresDay && <p>Dia da execução</p>}
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
                                        placeholder="1 a 31"
                                        className="p-5 w-[50%]"
                                        style={{ border: "1px solid #1e2939" }}
                                    />
                                )}
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!iniDate}
                                        className={`${requiresDay ? "w-[50%]" : "w-full"} p-5 justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-main-bg border-white`}
                                        style={{border: "1px solid #1e2939"}}
                                    >
                                        <CalendarIcon />
                                        {iniDate ? format(iniDate, "PPP") : <span>Data de início</span>}
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
                                        {finalDate ? format(finalDate, "PPP") : <span>Data Final</span>}
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
                                    Limpar
                                </Button>
                                <Button 
                                    className="bg-green-padrao cursor-pointer p-5 w-[50%]"
                                    onClick={() => insertRecurrentData()}
                                >
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