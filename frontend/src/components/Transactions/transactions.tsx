import { useEffect, useState } from "react";
import { getData } from "@/Utils/getData";
import { Toaster } from "react-hot-toast";
import { notify } from "@/Utils/notify";
import TransactionGrid from "../Transaction_Grid/TransactionGrid";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";
import CreateNewTransaction from "./addTransaction";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Banknote, FunnelPlus } from "lucide-react";
import TransactionFilter from "./transactionFilter";

interface Category {
  created_at: string;
  id: string;
  name: string;
  updated_at: string;
  user_id: string;
}

export function Transactions() {
  const [cat, setCat] = useState<Category[]>([]);
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }
  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  const userId = user.id;
  const [transactions, setTransactions] = useState<any[]>([]);

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

  const getCategories = async () => {
    const categories = await getData(
      "Categories",
      { user_id: userId },
      "Buscar categorias"
    );

    if (!categories.success) {
      notify.error(categories.message);
      return;
    }

    setCat(categories.data || []);
  };

  useEffect(() => {
    getCategories();
    getTransactionData();
  }, [userId]);


  return (
    <div className="flex flex-col gap-5">
      <Toaster />
      <div>
        <h1 className="text-2xl">Cadastrar Transações</h1>
      </div>

      <Accordion defaultValue={"item-1"} type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex items-center gap-2 text-xl text-white cursor-pointer">
            <Banknote size={35} className="text-green-padrao"/>
            Adicionar Transação
          </AccordionTrigger>
          <AccordionContent>
            <CreateNewTransaction onSave={getTransactionData}/>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="flex items-center gap-2 text-xl text-white cursor-pointer">
            <FunnelPlus size={35} className="text-blue-padrao"/>
            Filtro
          </AccordionTrigger>
          <AccordionContent>
            <TransactionFilter />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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