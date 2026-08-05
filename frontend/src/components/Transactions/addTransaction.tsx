import { useEffect, useState } from "react";
import { getData } from "@/Utils/getData";
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, CreditCard, Save, ShieldAlert } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { insertTransactionFormData } from "@/Utils/insertTransactionFormData";
import { notify } from "@/Utils/notify";
import { verifyForm } from "@/Utils/verifyForm";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";
import type { Category } from "@/types/generalTypes";
import SelectInput from "../Inputs/Select_Input";

interface Props {
    onSave: () => Promise<void>;
}

interface SelectOption {
    label: string;
    value: string;
}

interface SelectInputProps {
    options: SelectOption[];
    value: string;
    onValueChange: (value: string) => void;
}

export function CreateNewTransaction({ onSave }: Props) {

    const [cat, setCat] = useState<Category[]>([]);
    const [catOptions, setCatOptions] = useState<SelectOption[]>([]);
    const [date, setDate] = React.useState<Date>();
    const [type, setType] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [value, setValue] = useState("");
    const [desc, setDesc] = useState("");
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Carregando...</div>;
    }
    if (!user) {
        return <Navigate to="/Login" replace />;
    }
    
    const userId = user.id;

    useEffect(() => {
        const getCategories = async () => {
            const categories = await getData(
                "Categories",
                { user_id: userId },
                "Buscar todas as categorias"
            );
            const safeCategories = Array.isArray(categories.data) ? categories.data : [];
            setCat(safeCategories);

            const options = safeCategories.map((c) => ({
                label: c.name,
                value: c.id,
            }));
            setCatOptions(options);
        };

        getCategories();
    }, [userId]);

    const resetForm = () => {
        setType("");
        setCategoryId("");
        setValue("");
        setDesc("");
        setDate(undefined);
    };

    const saveFormData = async () => {
        if(verifyForm([type, categoryId, value])){
            if(desc && desc.length > 100){
                notify.error("Descrição deve ter menos que 100 caracteres");
                return false;
            }

            const sendData = {
                "type": type,
                "value": value,
                "tran_date": date?.toISOString(),
                "desc": desc,
                "user_id": userId,
                "cat_id": categoryId
            }
            
            const result = await insertTransactionFormData(sendData);
            
            if(result.success){
                notify.success(result.message);
                resetForm();
                await onSave();
            } else {
                notify.error(result.message);
            }
        }
    }


  return (
    <div className="bg-dark-padrao p-5 rounded-xl text-white flex flex-col gap-5">
        <div>
          <p className="flex gap-2 items-center"> 
            <span className="bg-green-padrao p-2 rounded-full">
              <CreditCard />
            </span> 
            Dados da transação
          </p>
        </div>
        <div className="flex gap-5 flex-wrap flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-subdiv2-padrao p-8 rounded-xl">
            <SelectInput 
                label="Tipo" placeholder="Tipo" options={[{ label: "Receita", value: "Receita" }, { label: "Despesa", value: "Despesa" }]}
                onValueChange={(e) => setType(e)} 
                value={type}
            />
            <SelectInput 
                label="Categoria" 
                placeholder="Categoria" 
                options={catOptions} 
                onValueChange={(e) => setCategoryId(e)} value={categoryId}
            />
            <div className="flex flex-col gap-3">
              <p>Data da transação</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="w-full p-5 justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-subdiv2-padrao border-white"
                    style={{border: "1px solid #1e2939"}}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate}/>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <p></p>
              <Field>
                <FieldLabel htmlFor="input-field-username">Valor R$</FieldLabel>
                <Input
                  id="input-field-username"
                  type="number"
                  placeholder="Valor da transação"
                  style={{border: "1px solid #1e2939"}}
                  className="p-5"
                  value={value}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Number(value) >= 0 || value === "") {
                      setValue(value);
                    }
                  }}
                />
              </Field>
            </div>
          </div>
          <div className="w-full min-w-0 bg-subdiv2-padrao p-8 rounded-xl flex flex-col gap-5">
            <p>Descrição (Opicional)</p>
            <Textarea placeholder="Adicione uma descrição para sua transação" 
            onChange={(e)=>setDesc(e.target.value)} 
            className="w-full break-all border-none" value={desc}/>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <Button 
            className="cursor-pointer bg-green-padrao hover:bg-emerald-900 w-fit" 
            onClick={()=>saveFormData()}
          > 
            <Save /> 
            Salvar Transação
          </Button>
          <div className="flex items-center gap-2 text-text-padrao text-sm">
            <ShieldAlert />
            <p>Crie novas categorias na página de categoria</p>
          </div>
        </div>
    </div>
  );
}

export default CreateNewTransaction;