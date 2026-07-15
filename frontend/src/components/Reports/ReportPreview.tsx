import { Separator } from "@/components/ui/separator"
import ReportResumeCard from "./ReportResumeCards";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getReportData } from "@/Utils/callGetReportData";
import { notify } from "@/Utils/notify";
import { formatDate } from "@/Utils/formatDate";

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

export function ReportPreviewPage({iniDate, finalDate}:{iniDate:string | null, finalDate:string | null}){

    const userId = localStorage.getItem("userId");
    const [transactions, setTransactionsd] = useState<ReportTransaction[]>([]);

    function formatDateToUS(date: string | null): string {
        if(!date || date == null){
            return "";
        }
        const [day, month, year] = date.split("/");

        return `${year}/${month}/${day}`;
    }
    
    const dataInicial = formatDateToUS(iniDate);
    const dataFinal = formatDateToUS(finalDate);

    if(!userId){
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        const getChartData = async () => {
            const response = await getReportData(userId, dataInicial, dataFinal, null);
            console.log(response)
            if(response.success){
                if(response && response.data){
                    setTransactionsd(response.data);
                }
            } else {
                notify.error("Erro ao buscar dados do relatório");
                return;
            }
        }

        getChartData();
    }, [])
    console.log(transactions)

  return (
    <div className="bg-white text-black text-[10px] rounded-xl p-4">
        <div className="flex items-center justify-between">
            <div className="w-[100px]">
                <img src="src/assets/logo-tracker.png" alt="finance-tracker-logo" />
            </div>
            <div>
                <h3 className="font-semibold">Relatório Financeiro</h3>
                <p>Período: 01/07/2026 a 31/07/2026</p>
                <p>Gerado em: 09/10/2026</p>
            </div>
        </div>
        <Separator  className="bg-gray-200"/>
        <div className="py-4 flex flex-col gap-3">
            <h3 className="font-bold">Resumo do Período</h3>
            <div className="flex items-center gap-3">
                <ReportResumeCard title={"Receitas"} value={"R$ 5.000,00"} themeColor={"#009966"}/>
                <ReportResumeCard title={"Despesas"} value={"R$ 1.800,00"} themeColor={"#9E0F18"}/>
                <ReportResumeCard title={"Saldo"} value={"R$ 3.200,00"} themeColor={"#00A7E1"}/>
                <ReportResumeCard title={"Economia"} value={"64%"} themeColor={"#000000"}/>
            </div>
            <div>
                <div></div>
                <div></div>
            </div>
            <div>
                <h3 className="font-semibold py-3">Transações Recentes</h3>
                <div className="grid grid-cols-[100px_2fr_1.5fr_120px_100px] font-semibold border-b pb-2">
                    <p>data</p>
                    <p>descrição</p>
                    <p>categoria</p>
                    <p>tipo</p>
                    <p>valor</p>
                </div>
                {transactions && transactions.map((t)=>(
                    <div key={t.id} className="grid grid-cols-[100px_2fr_1.5fr_120px_100px] py-2 border-b">
                        <p>{formatDate(t.tran_date)}</p>
                        <p>{t.desc}</p>
                        <p>{t.category_name}</p>
                        <p>{t.type}</p>
                        <p>{t.value}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default ReportPreviewPage;