import { SelectInput } from "../Inputs/Select_Input";
import { useEffect, useState } from "react";
import { getData } from "@/Utils/getData";
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, CreditCard, Save, UserSearch } from "lucide-react"
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
import TransactionGrid from "../Transaction_Grid/TransactionGrid";
import { verifyForm } from "@/Utils/verifyForm";
import { defaultIcons } from "@/Utils/icons";

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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [nowBalance, setNowBalance] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");

  const getTransactionData = async () => {
    const transctionData = await getData(
      "Transactions",
      { user_id: userId },
      "Buscar transações do usuário no banco"
    );

    if(transctionData.success == false){
      notify.error(transctionData.message);
      return;
    }

    setTransactions(transctionData.data || []);
  }

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
      const safeCategories = Array.isArray(categories.data) ? categories.data : [];
      setCat(safeCategories);

      const names = safeCategories.map((c) => c.name);
      setCatOptions(names);
    };

    getCategories();
    getTransactionData();
  }, [userId]);

  const resetForm = () => {
    setType("");
    setCategory("");
    setValue("");
    setDesc("");
    setDate(undefined);
  };

  const saveFormData = async () => {
    if(verifyForm([type, category, value])){
      if(desc && desc.length > 100){
        notify.error("Descrição deve ter menos que 100 caracteres");
        return false;
      }
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
        await getTransactionData();
      } else {
        notify.error(result.message);
      }
    }
  }
  console.log(openMenu)
  return (
    <div className="flex flex-col gap-5">
      <Toaster />
      <div>
        <h1 className="text-2xl">Cadastrar Transações</h1>
      </div>

      <div className="bg-[#111820] p-5 rounded-xl text-white flex flex-col gap-5">
        <div>
          <p className="flex gap-2 items-center"> 
            <span className="bg-[#15472F] p-2 rounded-full">
              <CreditCard />
            </span> 
            Dados da transação
          </p>
        </div>
        

        <div className="flex gap-5 flex-wrap flex-col">
          <div className="flex gap-5 sm:flex-wrap lg:flex-nowrap bg-[#1A232F] p-8 rounded-xl">
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
          <div className="flex flex-col gap-3 bg-[#1A232F] p-8 rounded-xl">
            <h3 className="flex gap-2">
              <span>
                <UserSearch className="text-blue-500"/>
              </span>
              Escolha um ícone
            </h3>
            <p className="text-sm text-gray-400">Escolha um ícone que melhor representa sua transação</p>
            <div>
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
          <div className="w-full min-w-0 bg-[#1A232F] p-8 rounded-xl flex flex-col gap-5">
            <p>Descrição (Opicional)</p>
            <Textarea placeholder="Adicione uma descrição para sua transação" 
            onChange={(e)=>setDesc(e.target.value)} 
            className="w-full break-all border-none" value={desc}/>
          </div>
        </div>
        <div>
          <Button className="cursor-pointer bg-emerald-600 hover:bg-emerald-900" onClick={()=>saveFormData()}> <Save /> Salvar Transação</Button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <p className="text-2xl">Suas Transações</p>
        <div className="max-h-96 overflow-y-auto flex flex-col gap-3 scrollbar-hide">
          {transactions &&
            transactions.map((transaction) => {
              const specificCat = cat.find((c) => c.id === transaction.cat_id);

              return (
                <TransactionGrid
                  key={transaction.id}
                  transactionProps={{
                    ...transaction,
                    specificCat
                  }}
                  onDelete={getTransactionData}
                />
              );
            })}
        </div>        
      </div>
    </div>
  );
}

export default Transactions;