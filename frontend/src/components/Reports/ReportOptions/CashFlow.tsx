import { supabase } from "@/services/supabase";
import { useAuth } from "@/Utils/AuthContext";
import { getReportData } from "@/Utils/callGetReportData";
import { notify } from "@/Utils/notify";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import logo from "@/assets/logo-tracker.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDate } from "@/Utils/formatDate";
import ReportResumeCard from "../ReportResumeCards";
import { formatCurrencyBR } from "@/Utils/formateToBr";

type ReportData = {
    tran_date: string; 
    receitas: number; 
    despesas: number; 
    saldo_acumulado: number;
    saldo_diario: number;
}

export function CashFlowReport({iniDate, finalDate}:{iniDate:string | null, finalDate:string | null}){

    const { user, loading } = useAuth();
    const [reportData, setReportData] = useState<ReportData[]>();
    const [receitas, setReceitas] = useState<number>(0);
    const [despesas, setDespesas] = useState<number>(0);
    const dataAtual = formatDate(new Date());
    let saldo = receitas - despesas;

    if (loading) {
        return <div>Carregando...</div>;
    }
    if (!user) {
        return <Navigate to="/Login" replace />;
    }
    
    function formatDateToUS(date:string | null): string {
        if(!date || date == null){
            return "";
        }
        const [day, month, year] = date.split("/");

        return `${year}/${month}/${day}`;
    }

    const getCashFlow = async () => {
        const { data, error } = await supabase.rpc(
            "fluxo_de_caixa",
            {
                p_user_id: user.id,
                p_data_inicial: formatDateToUS(iniDate),
                p_data_final: formatDateToUS(finalDate),
            }
        );

        if(error){
            notify.error("Erro ao buscar fluxo de caixa");
            return;
        }

        setReportData(data)
    }

    const calculateEconomy = (receita: number, despesa: number) => {
        if(!receita && !despesas){
            return 0;
        }
        const economy = ((receita - despesa) / receita) * 100;
        return economy.toFixed(0)
    }

    const getReceitas = async () => {
        const response = await getReportData(user.id, formatDateToUS(iniDate), formatDateToUS(finalDate), "Receita");
        if(response.success){
            if(response && response.data){
                response.data[0] ? setReceitas(response.data[0].total_value) : setReceitas(0);
            }
        } else {
            notify.error("Erro ao buscar dados do relatório");
            return;
        }
    }

    const getDespesas = async () => {
        const response = await getReportData(user.id, formatDateToUS(iniDate), formatDateToUS(finalDate), "Despesa");
        if(response.success){
            if(response && response.data){
                response.data[0] ? setDespesas(response.data[0].total_value) : setDespesas(0);
            }
        } else {
            notify.error("Erro ao buscar dados do relatório");
            return;
        }
    }
    
    useEffect(() => {
        getDespesas();
        getReceitas();
        getCashFlow();
    }, [user])
    console.log(reportData)
  return (
    <div className="bg-white text-black text-[10px] rounded-xl p-4">
        <div>
            <div className="flex items-center justify-between">
                <div className="w-[100px]">
                    <img src={logo} alt="finance-tracker-logo" />
                </div>
                <div>
                    <h3 className="font-semibold">Relatório Financeiro</h3>
                    <p>{`Período: ${iniDate} a ${finalDate}`}</p>
                    <p>{`Gerado em: ${dataAtual}`}</p>
                </div>
            </div>

            <div>
                <h3 className="font-bold">Resumo do Período</h3>
                <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
                    <ReportResumeCard title={"Receitas"} value={formatCurrencyBR(receitas)} themeColor={"#009966"}/>
                    <ReportResumeCard title={"Despesas"} value={formatCurrencyBR(despesas)} themeColor={"#9E0F18"}/>
                    <ReportResumeCard title={"Saldo"} value={formatCurrencyBR(saldo)} themeColor={"#00A7E1"}/>
                    <ReportResumeCard title={"Economia"} value={`${calculateEconomy(receitas, despesas)}%`} themeColor={"#000000"}/>
                </div>
            </div>
        </div>

        <div className="bg-white text-black text-[10px] rounded-xl p-4" style={{ height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={reportData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 10,
                        bottom: 10,
                    }}
                >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="dia" />

                <YAxis
                    tickFormatter={(value) =>
                    `R$ ${value}`
                    }
                />

                <Tooltip
                    formatter={(value) =>
                    `R$ ${Number(value).toFixed(2)}`
                    }
                />

                <Legend />

                <XAxis dataKey="tran_date" />

                    <Line
                        type="monotone"
                        dataKey="receitas"
                        name="Entradas"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                    />

                    <Line
                        type="monotone"
                        dataKey="despesas"
                        name="Saídas"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                    />

                    <Line
                        type="monotone"
                        dataKey="saldo_acumulado"
                        name="Saldo"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Saldos diários</h3>
            <div>
                <div className="grid grid-cols-2">
                    <p className="text-sm font-bold">Data</p>
                    <p className="text-sm font-bold">Saldo do dia</p>
                </div>
                { reportData && reportData.map((data, i) => (
                    <div className={ i % 2 == 0 ? "grid grid-cols-2 py-1" : "grid grid-cols-2 py-1 bg-gray-200 rounded-sm"} key={i}>
                        <p>{formatDate(data.tran_date)}</p>
                        <p className={data.saldo_acumulado > 0 ? "text-green-padrao" : "text-red-padrao"}>{data.saldo_diario}</p>
                    </div>
                )) }
            </div>
        </div>
    </div>
    
  );
}

export default CashFlowReport;