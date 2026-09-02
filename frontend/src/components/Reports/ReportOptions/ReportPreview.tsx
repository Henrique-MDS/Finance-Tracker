import { Separator } from "@/components/ui/separator"
import ReportResumeCard from "../ReportResumeCards";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getReportData } from "@/Utils/callGetReportData";
import { notify } from "@/Utils/notify";
import { formatDate } from "@/Utils/formatDate";
import { formatCurrencyBR } from "@/Utils/formateToBr";
import { Bar, BarChart, CartesianGrid,  Cell,  Pie,  PieChart,  ResponsiveContainer,  XAxis} from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../../ui/chart";
import { getMonthlySummaryByDate } from "@/Utils/callGetMonthlySummaryByDate";
import { getCategoryTotals } from "@/Utils/callGetCategoryTotals";
import { generateColor } from "@/Utils/generateColor";
import { getTotalByType } from "@/Utils/callGetTotalByType";
import { useAuth } from "@/Utils/AuthContext";
import logo from "@/assets/logo-tracker.png";

type ReportTransaction = {
    desc: string;
    id: string;
    total_value: number;
    tran_date:string;
    type: string;
    category_name: string;
    user_id: string;
    value: number;
}

type MonthlySummary = {
    despesa: number;
    month: string;
    receita: number;
}

type TotalByCategory = {
    category_name: string;
    total: number;
}

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

export function ReportPreviewPage({iniDate, finalDate}:{iniDate:string | null, finalDate:string | null}){

    const { user, loading } = useAuth();
    if (loading) {
        return <div>Carregando...</div>;
    }
    if (!user) {
        return <Navigate to="/Login" replace />;
    }
    const userId = user.id;
    const [transactions, setTransactions] = useState<ReportTransaction[]>([]);
    const [receitas, setReceitas] = useState<number>(0);
    const [despesas, setDespesas] = useState<number>(0);
    const [barChartData, setBarChartData] = useState<MonthlySummary[]>([{despesa: 0, month: "", receita: 0}]);
    const [totalDespesasByCategory, setTotalDespesasByCategory] = useState<TotalByCategory[]>([{category_name: "", total: 0}]);
    const [totalDespesa, setTotalDespesa] = useState<any>(0);
    let saldo = receitas - despesas;
    
    function formatDateToUS(date: string | null): string {
        if(!date || date == null){
            return "";
        }
        const [day, month, year] = date.split("/");

        return `${year}/${month}/${day}`;
    }
    
    const dataBrInicial = iniDate;
    const dataBrFinal = finalDate;
    const dataAtual = formatDate(new Date());

    const dataInicial = formatDateToUS(iniDate);
    const dataFinal = formatDateToUS(finalDate);

    if(!userId){
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        const getChartData = async () => {
            const response = await getReportData(userId, dataInicial, dataFinal, null);

            if(response.success){
                if(response && response.data){
                    setTransactions(response.data);
                }
            } else {
                notify.error("Erro ao buscar dados do relatório");
                return;
            }
        }

        const getCardsDataReceitas = async () => {
            const response = await getReportData(userId, dataInicial, dataFinal, "Receita");
            if(response.success){
                if(response && response.data){
                    response.data[0] ? setReceitas(response.data[0].total_value) : setReceitas(0);
                }
            } else {
                notify.error("Erro ao buscar dados do relatório");
                return;
            }
        }

        const getCardsDataDespesas = async () => {
            const response = await getReportData(userId, dataInicial, dataFinal, "Despesa");
            if(response.success){
                if(response && response.data){
                    response.data[0] ? setDespesas(response.data[0].total_value) : setDespesas(0);
                }
            } else {
                notify.error("Erro ao buscar dados do relatório");
                return;
            }
        }

        const getMonthlySummaryForChart = async () => {
            const response = await getMonthlySummaryByDate(userId, dataInicial, dataFinal);
            
            if(!response.success){
            notify.error("Erro ao buscar balanças mensais");
            return;
            } else {
            if(response && response.data){
                setBarChartData(response.data);
                return;
            } else {
                notify.error("Nenhum dado mensal a ser exibido");
                return;
            }
            }
    
        }

        const getTotalDespesasByCategory = async () => {
            const response = await getCategoryTotals(
                userId,
                "Despesa",
                dataInicial,
                dataFinal
            )
            
            if(!response.success){
                notify.error("Erro ao buscar total por categoria");
                return;
            } else {
                if(response && response.data){
                    setTotalDespesasByCategory(response.data);
                    return;
                }
            }
        }

        const getTotalDespesas = async () => {
            const response = await getTotalByType(
                userId,
                "Despesa",
                dataInicial,
                dataFinal
            )
            
            if(!response.success){
                notify.error("Erro ao buscar total por categoria");
                return;
            } else {
                if(response && response.data){
                    setTotalDespesa(response.data);
                    return;
                }
            }
        }

        getTotalDespesas();
        getTotalDespesasByCategory();
        getMonthlySummaryForChart();
        getCardsDataDespesas();
        getCardsDataReceitas();
        getChartData();
    }, [dataInicial, dataFinal])
    
    const calculateEconomy = (receita: number, despesa: number) => {
        if(!receita && !despesas){
            return 0;
        }
        const economy = ((receita - despesa) / receita) * 100;
        return economy.toFixed(0)
    }
    
  return (
    <div className="bg-white text-black text-[10px] rounded-xl p-4">
        <div className="flex items-center justify-between">
            <div className="w-[100px]">
                <img src={logo} alt="finance-tracker-logo" />
            </div>
            <div>
                <h3 className="font-semibold">Relatório Financeiro</h3>
                <p>{`Período: ${dataBrInicial} a ${dataBrFinal}`}</p>
                <p>{`Gerado em: ${dataAtual}`}</p>
            </div>
        </div>
        <Separator  className="bg-gray-200"/>
        <div className="py-4 flex flex-col gap-3">
            <h3 className="font-bold">Resumo do Período</h3>
            <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
                <ReportResumeCard title={"Receitas"} value={formatCurrencyBR(receitas)} themeColor={"#009966"}/>
                <ReportResumeCard title={"Despesas"} value={formatCurrencyBR(despesas)} themeColor={"#9E0F18"}/>
                <ReportResumeCard title={"Saldo"} value={formatCurrencyBR(saldo)} themeColor={"#00A7E1"}/>
                <ReportResumeCard title={"Economia"} value={`${calculateEconomy(receitas, despesas)}%`} themeColor={"#000000"}/>
            </div>
            <div className="grid grid-cols-1 gap-6 items-stretch">
                <div className="border rounded-xl p-4 h-[320px] border-gray-200">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <BarChart accessibilityLayer data={barChartData}>
                        <CartesianGrid vertical={false} horizontal={false}/>
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "#111820", fillOpacity: 0.3 }}/>
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="receita" fill="var(--color-receita)" radius={4} />
                        <Bar dataKey="despesa" fill="var(--color-despesa)" radius={4} />
                    </BarChart>
                </ChartContainer>
                </div>
                <div className="border rounded-xl p-4 min-h-[320px] flex flex-wrap items-center justify-center gap-5 border-gray-200">
                    <div className="relative w-full max-w-[320px] h-[320px] p-5 mx-auto sm:mx-0">
                        <h2 className="font-semibold">Resumo das Despesas</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                            <Pie
                                data={totalDespesasByCategory}
                                dataKey="total"
                                innerRadius={70}
                                outerRadius={100}
                            >
                                {totalDespesasByCategory.map((_, index) => (
                                <Cell key={index} fill={generateColor(index)} />
                                ))}
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {totalDespesa.toString().length > 8 ? (
                            <div className="flex flex-col items-center justify-center mt-4 static">
                                <span className="text-sm text-gray-400">Total</span>
                                <span className="text-xl font-bold">R$ {totalDespesa}</span>
                            </div>
                            ) : (
                            <div className="top-0 left-0 right-0 bottom-6 flex flex-col items-center justify-center absolute">
                                <span className="text-sm text-gray-400">Total</span>
                                <span className="text-xl font-bold">R$ {totalDespesa}</span>
                            </div>
                        )}
                    </div>

                    <div className="w-40 flex flex-col gap-2 justify-center">
                        {totalDespesasByCategory.map((item, index) => {
                            const percentage = (
                                (item.total / totalDespesa) * 100
                            ).toFixed(1);

                            return (
                                <div
                                    key={item.category_name}
                                    className="flex items-center justify-between gap-3"
                                >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: generateColor(index),
                                        }}
                                    />

                                    <span>{item.category_name.length > 15 ? item.category_name.slice(0, 15) + "..." : item.category_name}</span>
                                </div>

                                <span>{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="border-[1px] border-gray-200 rounded-[4px] p-5">
                <h3 className="font-semibold py-3">Transações Do Período</h3>
                <div className="overflow-x-auto print:overflow-visible">
                    <div className="min-w-[560px] print:min-w-0">
                        <div className="grid grid-cols-[100px_2fr_1.5fr_120px_100px] gap-3 font-semibold border-b pb-2">
                            <p>data</p>
                            <p>descrição</p>
                            <p>categoria</p>
                            <p>tipo</p>
                            <p>valor</p>
                        </div>
                        {transactions && transactions.map((t)=>(
                            <div key={t.id} className="grid grid-cols-[100px_2fr_1.5fr_120px_100px] gap-3 py-2 border-b border-gray-200">
                                <p>{formatDate(t.tran_date)}</p>
                                <p>{t.desc}</p>
                                <p>{t.category_name}</p>
                                <p>{t.type}</p>
                                <p style={t.type == "Receita" ? {color: "#2CAE60"}: {color: "#DD3C3C"}}
                                    className="font-bold">
                                    {t.type == "Receita" ? `+ ${t.value}` : `- ${t.value}`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="flex w-full items-center justify-center text-gray-500">
            <p>Relatório Gerado por Finance Tracker</p>
        </div>
    </div>
  );
}

export default ReportPreviewPage;