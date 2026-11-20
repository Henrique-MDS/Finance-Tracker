import { useLanguage } from "@/i18n/LanguageContext";
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
    const { t } = useLanguage();
    const [reportData, setReportData] = useState<ReportData[]>();
    const [receitas, setReceitas] = useState<number>(0);
    const [despesas, setDespesas] = useState<number>(0);
    const dataAtual = formatDate(new Date());
    let saldo = receitas - despesas;

    if (loading) {
        return <div>{t("common.loading")}</div>;
    }
    if (!user) {
        return <Navigate to="/Login" replace />;
    }
    
    const getCashFlow = async () => {
        const { data, error } = await supabase.rpc(
            "fluxo_de_caixa",
            {
                p_user_id: user.id,
                p_data_inicial: (iniDate ?? ""),
                p_data_final: (finalDate ?? ""),
            }
        );

        if(error){
            notify.error(t("reports.cashFlowError"));
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
        const response = await getReportData(user.id, (iniDate ?? ""), (finalDate ?? ""), "Receita");
        if(response.success){
            if(response && response.data){
                response.data[0] ? setReceitas(response.data[0].total_value) : setReceitas(0);
            }
        } else {
            notify.error(t("common.reportDataError"));
            return;
        }
    }

    const getDespesas = async () => {
        const response = await getReportData(user.id, (iniDate ?? ""), (finalDate ?? ""), "Despesa");
        if(response.success){
            if(response && response.data){
                response.data[0] ? setDespesas(response.data[0].total_value) : setDespesas(0);
            }
        } else {
            notify.error(t("common.reportDataError"));
            return;
        }
    }
    
    useEffect(() => {
        getDespesas();
        getReceitas();
        getCashFlow();
    }, [user])
    
  return (
    <div className="bg-white text-black text-[10px] rounded-xl p-4">
        <div>
            <div className="flex items-center justify-between">
                <div className="w-[100px]">
                    <img src={logo} alt="finance-tracker-logo" />
                </div>
                <div>
                    <h3 className="font-semibold">{t("reports.docTitle")}</h3>
                    <p>{t("reports.period", { start: formatDate(iniDate) ?? "", end: formatDate(finalDate) ?? "" })}</p>
                    <p>{t("reports.generatedAt", { date: dataAtual ?? "" })}</p>
                </div>
            </div>

            <div>
                <h3 className="font-bold">{t("reports.periodSummary")}</h3>
                <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
                    <ReportResumeCard title={t("common.income")} value={formatCurrencyBR(receitas)} themeColor={"#009966"}/>
                    <ReportResumeCard title={t("common.expenses")} value={formatCurrencyBR(despesas)} themeColor={"#9E0F18"}/>
                    <ReportResumeCard title={t("common.balance")} value={formatCurrencyBR(saldo)} themeColor={"#00A7E1"}/>
                    <ReportResumeCard title={t("common.savings")} value={`${calculateEconomy(receitas, despesas)}%`} themeColor={"#000000"}/>
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
                    labelFormatter={(value) => {
                        return formatDate(String(value)) ?? "";
                    }}
                    formatter={(value) =>
                    `R$ ${Number(value).toFixed(2)}`
                    }
                />

                <Legend />

                <XAxis dataKey="tran_date" 
                    tickFormatter={(value) => {
                        return formatDate(value)?.replace(/\d{2}(\d{2})$/, "$1") ?? "";
                    }}
                />

                    <Line
                        type="monotone"
                        dataKey="receitas"
                        name={t("reports.inflows")}
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                    />

                    <Line
                        type="monotone"
                        dataKey="despesas"
                        name={t("reports.outflows")}
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                    />

                    <Line
                        type="monotone"
                        dataKey="saldo_acumulado"
                        name={t("common.balance")}
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3">
            <h3 className="font-semibold">{t("reports.dailyBalances")}</h3>
            <div>
                <div className="grid grid-cols-2">
                    <p className="text-sm font-bold">{t("reports.date")}</p>
                    <p className="text-sm font-bold">{t("reports.dayBalance")}</p>
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