import ResumeCard from "./ResumeCards/ResumeCard";
import DonutChart from "./Graphs/pieChart";
import { getData } from "@/Utils/getData";
import { useEffect, useState } from "react";
import { notify } from "@/Utils/notify";
import { Toaster } from "react-hot-toast";
import { filterDespesaReceita } from "@/Utils/filterDespesaReceita";
import { getMonthTransactionsValue } from "@/Utils/callGetMonthBalance";
import { Navigate } from "react-router-dom";
import { ChartLegend, ChartLegendContent, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid,  XAxis} from "recharts";
import { getMonthlySummary } from "@/Utils/callGetMonthlySummary";
import walletIcon from "../assets/wallet-icon.svg";
import upArrow from "../assets/up-arrow-icon.svg";
import downArrow from "../assets/down-arrow-icon.svg";
import profitIcon from "../assets/profit-icon.svg";
import { getMonthlyComparativeBalance } from "@/Utils/callGetMonthlyComparative";
import { getMonthlyComparativeReceitaDespesa } from "@/Utils/callGetMonthlyComparativeReceitaDespesa";
import RecentTransactions from "./Recent_Transacations/RecentTransactions";

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

type MonthsBalance = {
  month: string;
  receita: number;
  despesa: number;
};

type MonthsComparative = {
  month: string;
  total: number;
};

export function MainPage() {
  const userId = localStorage.getItem("userId");
  if(!userId){
    return <Navigate to="/login" replace />;
  }
  const [balance, setBalance] = useState<any>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredType, setFilteredType] = useState<FilteredType>({despesas: [], receitas: []});
  const [monthTransactionsVal, setMonthTransactionsVal] = useState<any>(0);
  const [monthBalForChart, setMonthBalForChart] = useState<MonthsBalance[]>([{month: '', receita: 0, despesa: 0}]);
  const [monthsCompartive, setMonthsComparative] = useState<MonthsComparative[]>([{month: '', total: 0}]);
  const [totalReceitaMonth, setTotalReceitaMonth] = useState<MonthsComparative[]>([{month: '', total: 0}]);
  const [totalDespesaMonth, setTotalDespesaMonth] = useState<MonthsComparative[]>([{month: '', total: 0}]);
  const defitColor  = "#EF4444";
  const profitColor = "#2763AA";

  const chartConfig = {
    receita: {
      label: "Receitas",
      color: "#2CAE60",
    },
    despesa: {
      label: "Despesas",
      color: "#EF4444",
    },
  } satisfies ChartConfig
  
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
    setFilteredType(filterDespesaReceita(transactions));
    
    const getMonthVal = async () => {
      const now = new Date();

      const firstDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const lastDayMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        -1
      );

      const response = await getMonthTransactionsValue(userId, firstDay, lastDayMonth);
      if(!response.success){
        notify.error("Erro ao buscar balança mensal");
        return;
      } else {
        if(response && response.data !== undefined){
          setMonthTransactionsVal(response.data);
        } else {
          notify.error("Sem dados de transações");
          return;
        }
      }
    }

    const getMonthlySummaryForChart = async () => {
      const response = await getMonthlySummary(userId);
      
      if(!response.success){
        notify.error("Erro ao buscar balanças mensais");
        return;
      } else {
        if(response && response.data){
          setMonthBalForChart(response.data);
          return;
        } else {
          notify.error("Nenhum dado mensal a ser exibido");
          return;
        }
      }

    }

    const getMonthComparative = async () => {
      const response = await getMonthlyComparativeBalance(userId);
      if(!response.success){
        notify.error("Erro ao buscar comparativo mensal");
        return;
      } else {
        if(response && response.data){
          setMonthsComparative(response.data);
          return;
        }
      }
    }

    const getReceitaComparative = async () => {
      const response = await getMonthlyComparativeReceitaDespesa(userId, "Receita");
      if(!response.success){
        notify.error("Erro ao buscar comparativo mensal");
        return;
      } else {
        if(response && response.data){
          setTotalReceitaMonth(response.data);
          return;
        }
      }
    }

    const getDespesaComparative = async () => {
      const response = await getMonthlyComparativeReceitaDespesa(userId, "Despesa");
      if(!response.success){
        notify.error("Erro ao buscar comparativo mensal");
        return;
      } else {
        if(response && response.data){
          setTotalDespesaMonth(response.data);
          return;
        }
      }
    }

    getDespesaComparative();
    getReceitaComparative();
    getMonthComparative();
    getMonthlySummaryForChart();
    getMonthVal();
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

  const calculateComparativeSaldoMes = (data:MonthsComparative[]) => {
    // calcula % em relaçao ao saldo (receita - despesa) do mês passado
    if(!data || data.length == 0) return 0;
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const previousDate = new Date(now);
    previousDate.setMonth(previousDate.getMonth() - 1);
    const previousMonth = previousDate.toISOString().slice(0, 7);

    const current = data.find(item =>
      item.month.startsWith(currentMonth)
    );

    const previous = data.find(item =>
      item.month.startsWith(previousMonth)
    );

    if(!current || !previous) return 0;
    
    return (((current.total - previous.total) / Math.abs(previous.total)) * 100).toFixed(1);
  }

  const receitaPercent = calculateComparativeSaldoMes(totalReceitaMonth);
  const despesaPercent = calculateComparativeSaldoMes(totalDespesaMonth);
  const saldoPercent = calculateComparativeSaldoMes(monthsCompartive);
  
  return (
    <div className="flex flex-col gap-3">
      <Toaster />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-gray-300 font-medium">Dasboard</h1>
          <p>Visão geral de suas finanças</p>
        </div>
        <div>
          
        </div>
      </div>      
      <div className="flex gap-3 lg:flex-nowrap sm:flex-wrap">
        <ResumeCard title="Saldo atual" value={balance == null ? 0 : Number(balance.balance_now)} desc="total de receitas menos despesas" 
                    icon={upArrow} themeColor="#2CAE60" bgColor="#12302F"/>
        <ResumeCard title="Receitas" value={sumByType(filteredType.receitas)} desc={`${receitaPercent}% em relação ao mês anterior`}
                    icon={profitIcon} themeColor="#2763AA" bgColor="#2763AA"/>
        <ResumeCard title="Despesas" value={sumByType(filteredType.despesas)} desc={`${despesaPercent}% em relação ao mês anterior`} 
                    icon={downArrow} themeColor="#EF4444" bgColor="#EF4444"/>
        <ResumeCard title="Saldo do mês" value={monthTransactionsVal ?? 0} desc={`${saldoPercent}% em relação ao mês anterior`}
                    icon={walletIcon} themeColor="#3F3663" bgColor="#3F3663"/>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="w-full lg:flex-1">
          <DonutChart />
        </div>

        <div className="w-full lg:flex-1 bg-[#0E1621] rounded-xl flex items-center p-3">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={monthBalForChart}>
              <CartesianGrid vertical={false} horizontal={false}/>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="receita" fill="var(--color-receita)" radius={4} />
              <Bar dataKey="despesa" fill="var(--color-despesa)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
      <div>
        <div className="bg-[#0E1621] p-4 rounded-xl flex flex-col gap-4">
          <div className="flex justify-between cursor-pointer">
            <h2 className="text-white">Transações Recentes</h2>
            <p>Ver Todas</p>
          </div>
          {transactions && transactions.map((transaction, i) => {
            if (i > 3) return null;
            return <RecentTransactions key={transaction.id}/>
          })}
        </div>
      </div>
    </div>
  );
}

export default MainPage;