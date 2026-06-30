import ResumeCard from "./ResumeCards/ResumeCard";
import DonutChart from "./Graphs/pieChart";
import BarGraph from "./Graphs/barGraph";
import { getData } from "@/Utils/getData";
import { useEffect, useState } from "react";
import { notify } from "@/Utils/notify";
import { Toaster } from "react-hot-toast";

type Transaction = {
  cat_id: string;
  created_at: string;
  desc: string;
  id: string;
  tran_date: string;
  type: "Despesa" | "Receita";
  user_id: string;
  value: number;
};

type FilteredType = {
  despesas: Transaction[];
  receitas: Transaction[];
};

export function MainPage() {
  const userId = localStorage.getItem("userId");
  const [balance, setBalance] = useState<any>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredType, setFilteredType] = useState<FilteredType>({despesas: [], receitas: []});
  
  useEffect(() => {
    if(!userId) return;
    const getNowBalance = async () => {
      const response = await getData(
        "Balance",
        {user_id: userId},
        "Buscar balança atual"
      );
      
      if(!response.success){
        notify.error("Erro ao buscar dados");
        return;
      } else {
        if(response && response.data){
          setBalance(response.data[0]);
        } else {
          setBalance(null);
        }   
      }

    }

    const getTransactionsData = async () => {
      const response = await getData(
        "Transactions",
        {user_id: userId},
        "Buscar transações"
      );
      
      if(!response.success){
        notify.error("Erro ao buscar dados");
        return;
      } else {
        if(response && response.data){
          setTransactions(response.data);
        } else {
          notify.error("Sem dados de transações");
          return;
        }
      }

    }

    getTransactionsData();
    getNowBalance();
  }, [])

  useEffect(() => {
    const filterDespesaReceita = () => {
      const despesas = transactions.filter(
        (transaction) => transaction.type === "Despesa"
      );

      const receitas = transactions.filter(
        (transaction) => transaction.type === "Receita"
      );

      setFilteredType({
        despesas,
        receitas,
      });
    };

    filterDespesaReceita();
  }, [transactions])

  const sumByType = (data:Transaction[]) => {
    let total = 0;
    if(!data) return 0;
    if(data && data.length >= 1){
      for (const element of data) {
        total += element.value;
      }
    }
    return total;
  }

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-gray-300 font-medium">Dasboard</h1>
          <p>Visão geral de suas finanças</p>
        </div>
        <div>
          
        </div>
      </div>      
      <div className="py-3 flex gap-3 flex-wrap">
        <ResumeCard title="Saldo atual" value={balance == null ? 0 : Number(balance.balance_now)} desc="+12% em relação ao mês anterior" 
                    emoji="💵" themeColor="#2CAE60" bgColor="#12302F"/>
        <ResumeCard title="Receitas" value={sumByType(filteredType.receitas)} desc="+12% em relação ao mês anterior" 
                    emoji="💵" themeColor="#2CAE60" bgColor="#12302F"/>
        <ResumeCard title="Despesas" value={sumByType(filteredType.despesas)} desc="+12% em relação ao mês anterior" 
                    emoji="💵" themeColor="#2CAE60" bgColor="#12302F"/>
        
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="w-full lg:flex-1">
          <DonutChart />
        </div>

        <div className="w-full lg:flex-1">
          <BarGraph />
        </div>
      </div>
    </div>
  );
}

export default MainPage;