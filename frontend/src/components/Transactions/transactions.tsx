import { SelectInput } from "../Inputs/Select_Input";
import { useEffect, useState } from "react";
import { getData } from "@/Utils/getData";
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
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
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"

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
  const [date, setDate] = React.useState<Date>()

  useEffect(() => {
    const getCategories = async () => {
      const categories = await getData(
        "Categories",
        { user_id: "101a0389-8f55-4467-afca-29bcc93a723a" },
        "Buscar todas as categorias"
      );

      const safeCategories = Array.isArray(categories) ? categories : [];

      setCat(safeCategories);

      const names = safeCategories.map((c) => c.name);
      setCatOptions(names);
    };

    getCategories();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl">Cadastrar Transações</h1>
      </div>

      <div className="bg-[#111820] p-5 rounded-xl text-white flex flex-col gap-5">
        <p>Dados da transação</p>

        <div className="flex gap-5 items-center flex-wrap">
          <SelectInput label="Tipo" placeholder="Tipo" options={["Receita", "Despesa"]} />
          <SelectInput label="Categoria" placeholder="Categoria" options={catOptions} />
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
                <Calendar mode="single" selected={date} onSelect={setDate} />
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
              />
            </Field>
          </div>
          <div className="w-full">
            <Textarea placeholder="Descrição..." />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;