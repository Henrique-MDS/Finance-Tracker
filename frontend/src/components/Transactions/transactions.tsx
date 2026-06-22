import { SelectInput } from "../Inputs/Select_Input";
import { useEffect, useState } from "react";
import { getData } from "@/Utils/getData";
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
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
import toast, { Toaster } from "react-hot-toast";
import { insertTransactionFormData } from "@/Utils/insertTransactionFormData";
import { notify } from "@/Utils/notify";

interface Category {
  created_at: string;
  id: string;
  name: string;
  updated_at: string;
  user_id: string;
}

export function Transactions() {
  const [cat, setCat] = useState<Category[]>([]);
  const [catOptions, setCatOptions] = useState<string[]>([]);
  const [date, setDate] = React.useState<Date>();
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const getCategories = async () => {
      if (!userId) {
        console.error("Usuário não autenticado");
        return;
      }
      const categories = await getData(
        "Categories",
        { user_id: userId },
        "Buscar todas as categorias"
      );

      const safeCategories = Array.isArray(categories) ? categories : [];

      setCat(safeCategories);

      const names = safeCategories.map((c) => c.name);
      setCatOptions(names);
    };

    getCategories();
  }, []);

  const verifyForm = () => {
    if(!type || !category || !value){
      notify.error("Campos obrigatórios não preenchidos")
      return false;
    }

    if(desc && desc.length > 100){
      notify.error("Descrição deve ter menos que 100 caracteres");
      return false;
    }
    return true;
  }

  const resetForm = () => {
    setType("");
    setCategory("");
    setValue("");
    setDesc("");
    setDate(undefined);
  };

  const saveFormData = async () => {
    if(verifyForm()){
      const selectedCategory = cat.find(
        (c) => c.name === category
      );

      if (!selectedCategory) {
        console.error("Categoria não encontrada");
        return;
      }
      const sendData = {
        "type": type,
        "value": value,
        "tran_date": date?.toISOString(),
        "desc": desc,
        "user_id": userId,
        "cat_id": selectedCategory.id
      }
      
      const result = await insertTransactionFormData(sendData);

      if(result.success){
        notify.success(result.message);
        resetForm();
      } else {
        notify.error(result.message);
      }
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Toaster />
      <div>
        <h1 className="text-2xl">Cadastrar Transações</h1>
      </div>

      <div className="bg-[#111820] p-5 rounded-xl text-white flex flex-col gap-5">
        <p>Dados da transação</p>

        <div className="flex gap-5 items-center flex-wrap">
          <SelectInput label="Tipo" placeholder="Tipo" options={["Receita", "Despesa"]} onValueChange={(e) => setType(e)} value={type}/>
          <SelectInput label="Categoria" placeholder="Categoria" options={catOptions} onValueChange={(e) => setCategory(e)} value={category}/>
          <div className="flex flex-col gap-3">
            <p>Data da transação</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!date}
                  className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-[#111820]"
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
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
                value={value}
                onChange={(e)=>setValue(e.target.value)}
              />
            </Field>
          </div>
          <div className="w-full min-w-0">
            <Textarea placeholder="Descrição..." onChange={(e)=>setDesc(e.target.value)} className="w-full break-all" value={desc}/>
          </div>
        </div>
        <div>
          <Button className="cursor-pointer bg-emerald-600 hover:bg-emerald-900" onClick={()=>saveFormData()}>Salvar Transação</Button>
        </div>
      </div>
    </div>
  );
}

export default Transactions;